export type ColorSchemeName = 'light' | 'dark';

export type ThemePreference = ColorSchemeName | 'system';

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function resolveColorScheme(
  preference: ThemePreference,
  systemScheme: ColorSchemeName
): ColorSchemeName {
  return preference === 'system' ? systemScheme : preference;
}
