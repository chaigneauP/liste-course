import { StyleSheet } from 'react-native';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import type { ColorSchemeName } from '@/domain/entities/themePreference';

import type { Theme } from './theme';
import { useTheme } from './ThemeProvider';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Transforme une fabrique de styles en hook. Les feuilles de styles sont mises
 * en cache par thème pour ne pas être recréées à chaque rendu.
 */
export function makeStyles<T extends NamedStyles<T>>(factory: (theme: Theme) => T) {
  const cache = new Map<ColorSchemeName, T>();

  return function useStyles(): T {
    const theme = useTheme();

    let styles = cache.get(theme.scheme);
    if (!styles) {
      styles = StyleSheet.create(factory(theme));
      cache.set(theme.scheme, styles);
    }

    return styles;
  };
}
