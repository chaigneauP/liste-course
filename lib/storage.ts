import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Item, ShoppingList } from '../types';

const LISTS_KEY = '@liste-course/lists';
const LEGACY_ITEMS_KEY = '@liste-course/items';

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isItem(value: unknown): value is Item {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Item).id === 'string' &&
    typeof (value as Item).name === 'string'
  );
}

function isShoppingList(value: unknown): value is ShoppingList {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ShoppingList).id === 'string' &&
    typeof (value as ShoppingList).name === 'string' &&
    Array.isArray((value as ShoppingList).items) &&
    typeof (value as ShoppingList).createdAt === 'string' &&
    typeof (value as ShoppingList).updatedAt === 'string'
  );
}

async function loadLegacyItems(): Promise<Item[]> {
  try {
    const raw = await AsyncStorage.getItem(LEGACY_ITEMS_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isItem);
  } catch (error) {
    console.warn('Lecture de l’ancien stockage impossible', error);
    return [];
  }
}

async function migrateLegacyItemsIfNeeded(lists: ShoppingList[]): Promise<ShoppingList[]> {
  if (lists.length > 0) {
    return lists;
  }

  const legacyItems = await loadLegacyItems();
  if (legacyItems.length === 0) {
    return lists;
  }

  const now = new Date().toISOString();
  const migratedList: ShoppingList = {
    id: createId(),
    name: 'Ma liste',
    items: legacyItems,
    createdAt: now,
    updatedAt: now,
  };

  await AsyncStorage.setItem(LISTS_KEY, JSON.stringify([migratedList]));
  await AsyncStorage.removeItem(LEGACY_ITEMS_KEY);

  return [migratedList];
}

export async function loadLists(): Promise<ShoppingList[]> {
  try {
    const raw = await AsyncStorage.getItem(LISTS_KEY);
    if (!raw) {
      return migrateLegacyItemsIfNeeded([]);
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return migrateLegacyItemsIfNeeded([]);
    }

    const lists = parsed
      .filter(isShoppingList)
      .map((list) => ({ ...list, items: list.items.filter(isItem) }));

    return migrateLegacyItemsIfNeeded(lists);
  } catch (error) {
    console.warn('Lecture du stockage impossible', error);
    return [];
  }
}

export async function saveLists(lists: ShoppingList[]): Promise<void> {
  try {
    await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(lists));
  } catch (error) {
    console.warn('Sauvegarde du stockage impossible', error);
  }
}

export async function createList(name: string): Promise<ShoppingList> {
  const lists = await loadLists();
  const now = new Date().toISOString();
  const list: ShoppingList = {
    id: createId(),
    name: name.trim(),
    items: [],
    createdAt: now,
    updatedAt: now,
  };

  lists.unshift(list);
  await saveLists(lists);
  return list;
}

export async function updateList(list: ShoppingList): Promise<void> {
  const lists = await loadLists();
  const index = lists.findIndex((entry) => entry.id === list.id);
  if (index === -1) {
    return;
  }

  lists[index] = { ...list, updatedAt: new Date().toISOString() };
  await saveLists(lists);
}

export async function getListById(id: string): Promise<ShoppingList | null> {
  const lists = await loadLists();
  return lists.find((entry) => entry.id === id) ?? null;
}

export async function deleteList(id: string): Promise<void> {
  const lists = await loadLists();
  await saveLists(lists.filter((entry) => entry.id !== id));
}
