import type { ViewStyle } from 'react-native';

import type { ThemeColors } from './colors';

export type Shadows = {
  /** Menu contextuel affiché au-dessus d'une carte. */
  menu: ViewStyle;
  /** Bouton d'action flottant. */
  floating: ViewStyle;
};

export function createShadows(colors: ThemeColors): Shadows {
  return {
    menu: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
    },
    floating: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
  };
}
