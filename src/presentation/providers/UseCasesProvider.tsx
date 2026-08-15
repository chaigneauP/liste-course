import { createContext, useContext, type ReactNode } from 'react';

import type {
  AppUseCases,
  AisleDictionaryUseCases,
  ShoppingListUseCases,
  ThemeUseCases,
} from '@/application/appUseCases';

const UseCasesContext = createContext<AppUseCases | null>(null);

type Props = {
  useCases: AppUseCases;
  children: ReactNode;
};

/**
 * Rend les cas d'usage disponibles à l'arbre React. La présentation ne connaît
 * ainsi que des signatures, jamais AsyncStorage ni aucun détail technique.
 */
export function UseCasesProvider({ useCases, children }: Props) {
  return <UseCasesContext.Provider value={useCases}>{children}</UseCasesContext.Provider>;
}

export function useAppUseCases(): AppUseCases {
  const useCases = useContext(UseCasesContext);
  if (!useCases) {
    throw new Error('useAppUseCases doit être utilisé à l’intérieur de UseCasesProvider');
  }
  return useCases;
}

export function useShoppingListUseCases(): ShoppingListUseCases {
  return useAppUseCases().shoppingLists;
}

export function useThemeUseCases(): ThemeUseCases {
  return useAppUseCases().theme;
}

export function useAisleDictionaryUseCases(): AisleDictionaryUseCases {
  return useAppUseCases().aisleDictionary;
}
