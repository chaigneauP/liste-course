import AsyncStorage from '@react-native-async-storage/async-storage';

import { parseAisleDictionary } from '@/domain/entities/aisleDictionary';
import type { AisleDictionaryRepository } from '@/domain/ports/aisleDictionaryRepository';

import { STORAGE_KEYS } from './storageKeys';

export function createAsyncStorageAisleDictionaryRepository(): AisleDictionaryRepository {
  return {
    async read() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.aisleDictionary);
        if (stored === null) {
          return null;
        }

        return parseAisleDictionary(JSON.parse(stored));
      } catch (error) {
        console.warn('Lecture du dictionnaire de rayons impossible', error);
        return null;
      }
    },

    async write(dictionary) {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.aisleDictionary, JSON.stringify(dictionary));
      } catch (error) {
        console.warn('Sauvegarde du dictionnaire de rayons impossible', error);
      }
    },
  };
}
