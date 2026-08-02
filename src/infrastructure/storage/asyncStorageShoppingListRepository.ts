import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ShoppingList } from '@/domain/entities/shoppingList';
import type { Clock } from '@/domain/ports/clock';
import type { IdGenerator } from '@/domain/ports/idGenerator';
import type { ShoppingListRepository } from '@/domain/ports/shoppingListRepository';

import { createMutex } from './createMutex';
import { parseItems, parseShoppingLists } from './shoppingListMapper';
import { STORAGE_KEYS } from './storageKeys';

const LEGACY_LIST_NAME = 'Ma liste';

export function createAsyncStorageShoppingListRepository(
  clock: Clock,
  idGenerator: IdGenerator
): ShoppingListRepository {
  const runExclusive = createMutex();

  async function writeLists(lists: ShoppingList[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.lists, JSON.stringify(lists));
    } catch (error) {
      console.warn('Sauvegarde du stockage impossible', error);
    }
  }

  async function migrateLegacyItems(): Promise<ShoppingList[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.legacyItems);
      if (!raw) {
        return [];
      }

      const legacyItems = parseItems(JSON.parse(raw));
      if (legacyItems.length === 0) {
        return [];
      }

      const now = clock.now();
      const migrated: ShoppingList = {
        id: idGenerator.generate(),
        name: LEGACY_LIST_NAME,
        items: legacyItems,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.lists, JSON.stringify([migrated]));
      await AsyncStorage.removeItem(STORAGE_KEYS.legacyItems);

      return [migrated];
    } catch (error) {
      console.warn('Migration de l’ancien stockage impossible', error);
      return [];
    }
  }

  // Lecture sans verrou : réservée aux appels déjà protégés par le mutex.
  async function readLists(): Promise<ShoppingList[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.lists);
      if (!raw) {
        return migrateLegacyItems();
      }

      const lists = parseShoppingLists(JSON.parse(raw));
      return lists.length > 0 ? lists : migrateLegacyItems();
    } catch (error) {
      console.warn('Lecture du stockage impossible', error);
      return [];
    }
  }

  return {
    findAll() {
      return runExclusive(readLists);
    },

    findById(id) {
      return runExclusive(async () => {
        const lists = await readLists();
        return lists.find((list) => list.id === id) ?? null;
      });
    },

    save(list) {
      return runExclusive(async () => {
        const lists = await readLists();
        const index = lists.findIndex((entry) => entry.id === list.id);

        if (index === -1) {
          await writeLists([list, ...lists]);
          return;
        }

        const next = [...lists];
        next[index] = list;
        await writeLists(next);
      });
    },

    replaceAll(lists) {
      return runExclusive(() => writeLists(lists));
    },
  };
}
