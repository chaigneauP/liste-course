import { StyleSheet } from 'react-native';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { useTheme } from './ThemeProvider';
import type { ColorScheme, ThemeColors } from './tokens';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Transforme une fabrique de styles en hook. Les feuilles de styles sont mises en
 * cache par thème pour ne pas être recréées à chaque rendu.
 */
export function makeStyles<T extends NamedStyles<T>>(factory: (colors: ThemeColors) => T) {
  const cache = new Map<ColorScheme, T>();

  return function useStyles(): T {
    const { scheme, colors } = useTheme();

    let styles = cache.get(scheme);
    if (!styles) {
      styles = StyleSheet.create(factory(colors));
      cache.set(scheme, styles);
    }

    return styles;
  };
}
