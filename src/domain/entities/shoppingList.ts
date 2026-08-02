import type { Item } from './item';

export type ListStatus = 'active' | 'archived';

export type ListCompletion = 'complete' | 'in-progress';

export type ShoppingList = {
  id: string;
  name: string;
  items: Item[];
  status: ListStatus;
  createdAt: string;
  updatedAt: string;
};

export function isListStatus(value: unknown): value is ListStatus {
  return value === 'active' || value === 'archived';
}

export function isListEditable(list: ShoppingList): boolean {
  return list.status === 'active';
}

export function getListCompletion(list: ShoppingList): ListCompletion | undefined {
  if (list.items.length === 0) {
    return undefined;
  }
  return list.items.every((item) => item.checked) ? 'complete' : 'in-progress';
}

// Les opérations ci-dessous renvoient la liste d'origine quand la règle métier
// interdit la modification : l'appelant peut ainsi détecter un no-op par identité.

export function addItemToList(list: ShoppingList, item: Item): ShoppingList {
  if (!isListEditable(list) || !item.name) {
    return list;
  }
  return { ...list, items: [...list.items, item] };
}

export function renameItemInList(
  list: ShoppingList,
  itemId: string,
  name: string
): ShoppingList {
  const trimmed = name.trim();
  if (!isListEditable(list) || !trimmed) {
    return list;
  }

  const items = list.items.map((item) =>
    item.id === itemId ? { ...item, name: trimmed } : item
  );
  return { ...list, items };
}

export function removeItemFromList(list: ShoppingList, itemId: string): ShoppingList {
  if (!isListEditable(list)) {
    return list;
  }

  const items = list.items.filter((item) => item.id !== itemId);
  if (items.length === list.items.length) {
    return list;
  }
  return { ...list, items };
}

export function toggleItemInList(list: ShoppingList, itemId: string): ShoppingList {
  if (!isListEditable(list)) {
    return list;
  }

  const items = list.items.map((item) =>
    item.id === itemId ? { ...item, checked: !item.checked } : item
  );
  return { ...list, items };
}

export function markListAsArchived(list: ShoppingList): ShoppingList {
  if (list.status === 'archived') {
    return list;
  }
  return { ...list, status: 'archived' };
}

export function filterListsByStatus(
  lists: ShoppingList[],
  status: ListStatus
): ShoppingList[] {
  return lists.filter((list) => list.status === status);
}

export function sortListsByRecentUpdate(lists: ShoppingList[]): ShoppingList[] {
  return [...lists].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
