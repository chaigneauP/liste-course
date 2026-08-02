import type { ColorSchemeName } from '@/domain/entities/themePreference';

import {
  createShadows,
  opacity,
  palettes,
  radius,
  spacing,
  typography,
  type Opacity,
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
  opacity: Opacity;
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
    opacity,
  };
}

export const themes: Record<ColorSchemeName, Theme> = {
  light: buildTheme('light'),
  dark: buildTheme('dark'),
};
