import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';

import { themes, type ColorScheme, type ThemeColors } from './tokens';

const PREFERENCE_KEY = '@liste-course/theme';

export type ThemePreference = ColorScheme | 'system';

type ThemeContextValue = {
  colors: ThemeColors;
  scheme: ColorScheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPreference() {
      try {
        const stored = await AsyncStorage.getItem(PREFERENCE_KEY);
        if (!cancelled && isThemePreference(stored)) {
          setPreferenceState(stored);
        }
      } catch (error) {
        console.warn('Lecture de la préférence de thème impossible', error);
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    }

    void loadPreference();

    return () => {
      cancelled = true;
    };
  }, []);

  // Aligne les composants natifs (Alert, clavier, barre système) sur le choix manuel.
  useEffect(() => {
    if (!hydrated) {
      return;
    }
    Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
  }, [hydrated, preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);

    AsyncStorage.setItem(PREFERENCE_KEY, next).catch((error: unknown) => {
      console.warn('Sauvegarde de la préférence de thème impossible', error);
    });
  }, []);

  const scheme: ColorScheme =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({ colors: themes[scheme], scheme, preference, setPreference }),
    [preference, scheme, setPreference]
  );

  if (!hydrated) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l’intérieur de ThemeProvider');
  }
  return context;
}
