import { DEFAULT_THEME_PREFERENCE, type ThemePreference } from '@/domain/entities/themePreference';
import type { ThemePreferenceRepository } from '@/domain/ports/themePreferenceRepository';

export type GetThemePreference = () => Promise<ThemePreference>;

export type SaveThemePreference = (preference: ThemePreference) => Promise<void>;

export function makeGetThemePreference(repository: ThemePreferenceRepository): GetThemePreference {
  return async () => (await repository.read()) ?? DEFAULT_THEME_PREFERENCE;
}

export function makeSaveThemePreference(
  repository: ThemePreferenceRepository
): SaveThemePreference {
  return (preference) => repository.write(preference);
}
