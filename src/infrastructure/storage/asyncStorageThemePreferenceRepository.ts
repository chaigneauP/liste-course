import AsyncStorage from '@react-native-async-storage/async-storage';

import { isThemePreference } from '@/domain/entities/themePreference';
import type { ThemePreferenceRepository } from '@/domain/ports/themePreferenceRepository';

import { STORAGE_KEYS } from './storageKeys';

export function createAsyncStorageThemePreferenceRepository(): ThemePreferenceRepository {
  return {
    async read() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.themePreference);
        return isThemePreference(stored) ? stored : null;
      } catch (error) {
        console.warn('Lecture de la préférence de thème impossible', error);
        return null;
      }
    },

    async write(preference) {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.themePreference, preference);
      } catch (error) {
        console.warn('Sauvegarde de la préférence de thème impossible', error);
      }
    },
  };
}
