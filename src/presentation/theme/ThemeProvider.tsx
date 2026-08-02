import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';

import {
  DEFAULT_THEME_PREFERENCE,
  resolveColorScheme,
  type ColorSchemeName,
  type ThemePreference,
} from '@/domain/entities/themePreference';
import { useThemeUseCases } from '@/presentation/providers/UseCasesProvider';

import { themes, type Theme } from './theme';

type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeUseCases = useThemeUseCases();
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(
    DEFAULT_THEME_PREFERENCE
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    themeUseCases
      .getPreference()
      .then((stored) => {
        if (!cancelled) {
          setPreferenceState(stored);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setHydrated(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [themeUseCases]);

  // Aligne les composants natifs (Alert, clavier, barre système) sur le choix manuel.
  useEffect(() => {
    if (!hydrated) {
      return;
    }
    Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
  }, [hydrated, preference]);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next);
      void themeUseCases.savePreference(next);
    },
    [themeUseCases]
  );

  const scheme: ColorSchemeName = resolveColorScheme(
    preference,
    systemScheme === 'dark' ? 'dark' : 'light'
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: themes[scheme], preference, setPreference }),
    [preference, scheme, setPreference]
  );

  if (!hydrated) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('Le thème doit être consommé à l’intérieur de ThemeProvider');
  }
  return context;
}

export function useTheme(): Theme {
  return useThemeContext().theme;
}

export function useThemePreference() {
  const { preference, setPreference } = useThemeContext();
  return { preference, setPreference };
}
