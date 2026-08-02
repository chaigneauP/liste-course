import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Item } from '../types';

const ITEMS_KEY = '@liste-course/items';

function isItem(value: unknown): value is Item {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Item).id === 'string' &&
    typeof (value as Item).name === 'string'
  );
}

export async function loadItems(): Promise<Item[]> {
  try {
    const raw = await AsyncStorage.getItem(ITEMS_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isItem);
  } catch (error) {
    console.warn('Lecture du stockage impossible', error);
    return [];
  }
}

export async function saveItems(items: Item[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Sauvegarde du stockage impossible', error);
  }
}
