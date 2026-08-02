import type { ColorSchemeName } from '@/domain/entities/themePreference';

export type ThemeColors = {
  bg: string;
  surface: string;
  border: string;

  btnPrimaryBg: string;
  btnPrimaryBgHover: string;
  btnSecondaryBg: string;
  btnSecondaryBgHover: string;

  btnPrimaryIcon: string;
  btnSecondaryIcon: string;

  accentBg: string;
  accentIcon: string;

  textPrimary: string;
  textSecondary: string;

  success: string;
  danger: string;

  /** Fond des modales. */
  overlay: string;
  /** Fond des lignes cochées. */
  successSurface: string;
  successSurfacePressed: string;
  /** Fond doux des actions destructrices. */
  dangerSurface: string;
  dangerSurfacePressed: string;
  shadow: string;
};

export const lightColors: ThemeColors = {
  bg: '#F4F1E8',
  surface: '#FFFFFF',
  border: '#E3DECF',
  btnPrimaryBg: '#4A6B4D',
  btnPrimaryBgHover: '#3A5A3D',
  btnSecondaryBg: '#FFFFFF',
  btnSecondaryBgHover: '#EDE9DD',
  btnPrimaryIcon: '#F4F1E8',
  btnSecondaryIcon: '#4A6B4D',
  accentBg: '#D98E63',
  accentIcon: '#4A1B0C',
  textPrimary: '#2E2A24',
  textSecondary: '#6B6558',
  success: '#4A6B4D',
  danger: '#C4573B',
  overlay: 'rgba(46, 42, 36, 0.45)',
  successSurface: '#E8EEE6',
  successSurfacePressed: '#DCE6DA',
  dangerSurface: '#F7E9E4',
  dangerSurfacePressed: '#F0DAD2',
  shadow: '#2E2A24',
};

export const darkColors: ThemeColors = {
  bg: '#1E1C18',
  surface: '#2A2722',
  border: '#3D3931',
  btnPrimaryBg: '#7FA07D',
  btnPrimaryBgHover: '#94B592',
  btnSecondaryBg: '#2A2722',
  btnSecondaryBgHover: '#3D3931',
  btnPrimaryIcon: '#1E1C18',
  btnSecondaryIcon: '#7FA07D',
  accentBg: '#E3A57D',
  accentIcon: '#4A1B0C',
  textPrimary: '#F0EDE4',
  textSecondary: '#A8A196',
  success: '#7FA07D',
  danger: '#E07A5F',
  overlay: 'rgba(0, 0, 0, 0.6)',
  successSurface: '#2F362E',
  successSurfacePressed: '#384038',
  dangerSurface: '#3A2620',
  dangerSurfacePressed: '#462E27',
  shadow: '#000000',
};

export const palettes: Record<ColorSchemeName, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};
