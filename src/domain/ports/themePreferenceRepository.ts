import type { ThemePreference } from '../entities/themePreference';

export interface ThemePreferenceRepository {
  read(): Promise<ThemePreference | null>;
  write(preference: ThemePreference): Promise<void>;
}
