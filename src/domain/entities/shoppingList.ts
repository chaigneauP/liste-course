import {
  applyItemDetails,
  itemDetailsMatchItem,
  normalizeItemDetails,
  normalizeItemNameForComparison,
  type Item,
  type ItemDetails,
} from './item';

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

export function findMergeCandidate(list: ShoppingList, details: ItemDetails): Item | undefined {
  if (!isListEditable(list)) {
    return undefined;
  }

  const normalized = normalizeItemDetails(details);
  if (!normalized.name) {
    return undefined;
  }

  const targetName = normalizeItemNameForComparison(normalized.name);

  return list.items.find(
    (item) => !item.checked && normalizeItemNameForComparison(item.name) === targetName
  );
}

export function mergeItemIntoList(
  list: ShoppingList,
  existingId: string,
  details: ItemDetails
): ShoppingList {
  if (!isListEditable(list)) {
    return list;
  }

  const existing = list.items.find((item) => item.id === existingId);
  if (!existing || existing.checked) {
    return list;
  }

  const normalized = normalizeItemDetails(details);
  let changed = false;

  const items = list.items.map((item) => {
    if (item.id !== existingId) {
      return item;
    }

    changed = true;
    const merged: Item = {
      id: item.id,
      name: normalized.name,
      checked: item.checked,
    };

    const quantityMerge = mergeItemQuantities(item, normalized);
    if (quantityMerge.quantity !== undefined) {
      merged.quantity = quantityMerge.quantity;
      merged.unit = quantityMerge.unit;
    }

    const existingNote = item.note?.trim();
    if (existingNote) {
      merged.note = item.note;
    } else if (normalized.note !== undefined) {
      merged.note = normalized.note;
    }

    if (item.aisle !== undefined) {
      merged.aisle = item.aisle;
    } else if (normalized.aisle !== undefined) {
      merged.aisle = normalized.aisle;
    }

    return merged;
  });

  if (!changed) {
    return list;
  }
  return { ...list, items };
}

function mergeItemQuantities(
  existing: Item,
  incoming: ItemDetails
): { quantity?: number; unit?: Item['unit'] } {
  const existingHasQty = existing.quantity !== undefined;
  const incomingHasQty = incoming.quantity !== undefined;

  if (!existingHasQty && !incomingHasQty) {
    return { quantity: 2, unit: 'piece' };
  }

  if (existingHasQty && !incomingHasQty) {
    return {
      quantity: existing.quantity! + 1,
      unit: existing.unit ?? 'piece',
    };
  }

  if (!existingHasQty && incomingHasQty) {
    return {
      quantity: incoming.quantity,
      unit: incoming.unit ?? 'piece',
    };
  }

  const existingUnit = existing.unit ?? 'piece';
  const incomingUnit = incoming.unit ?? 'piece';

  if (existingUnit === incomingUnit) {
    return {
      quantity: existing.quantity! + incoming.quantity!,
      unit: existingUnit,
    };
  }

  return {
    quantity: existing.quantity! + 1,
    unit: existingUnit,
  };
}

export function addItemToList(list: ShoppingList, item: Item): ShoppingList {
  if (!isListEditable(list) || !item.name) {
    return list;
  }
  return { ...list, items: [...list.items, item] };
}

export function updateItemInList(
  list: ShoppingList,
  itemId: string,
  details: ItemDetails
): ShoppingList {
  const trimmed = details.name.trim();
  if (!isListEditable(list) || !trimmed) {
    return list;
  }

  let changed = false;
  const items = list.items.map((item) => {
    if (item.id !== itemId || itemDetailsMatchItem(item, details)) {
      return item;
    }
    changed = true;
    return applyItemDetails(item, details);
  });

  if (!changed) {
    return list;
  }
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

  let found = false;
  const items = list.items.map((item) => {
    if (item.id !== itemId) {
      return item;
    }
    found = true;
    return { ...item, checked: !item.checked };
  });

  if (!found) {
    return list;
  }
  return { ...list, items };
}

export function markListAsArchived(list: ShoppingList): ShoppingList {
  if (list.status === 'archived') {
    return list;
  }
  return { ...list, status: 'archived' };
}

export function filterListsByStatus(lists: ShoppingList[], status: ListStatus): ShoppingList[] {
  return lists.filter((list) => list.status === status);
}

/** Tri décroissant sur `updatedAt` ISO-8601 (comparaison lexicographique). */
export function sortListsByRecentUpdate(lists: ShoppingList[]): ShoppingList[] {
  return [...lists].sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0
  );
}
