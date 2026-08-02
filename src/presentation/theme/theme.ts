import type { ColorSchemeName } from '@/domain/entities/themePreference';

import {
  createShadows,
  palettes,
  radius,
  spacing,
  typography,
  type Radius,
  type Shadows,
  type Spacing,
  type ThemeColors,
  type Typography,
} from './tokens';

export type Theme = {
  scheme: ColorSchemeName;
  colors: ThemeColors;
  spacing: Spacing;
  radius: Radius;
  typography: Typography;
  shadow: Shadows;
};

function buildTheme(scheme: ColorSchemeName): Theme {
  const colors = palettes[scheme];

  return {
    scheme,
    colors,
    spacing,
    radius,
    typography,
    shadow: createShadows(colors),
  };
}

export const themes: Record<ColorSchemeName, Theme> = {
  light: buildTheme('light'),
  dark: buildTheme('dark'),
};
