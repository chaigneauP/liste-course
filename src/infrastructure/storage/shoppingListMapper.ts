import { isItemUnit, normalizeItemNote, type Item } from '@/domain/entities/item';
import { isListStatus, type ShoppingList } from '@/domain/entities/shoppingList';

/**
 * Couche anti-corruption : tout ce qui sort du stockage est du JSON non fiable
 * et doit être validé avant d'entrer dans le domaine.
 */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseQuantity(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }
  return value;
}

export function parseItem(value: unknown): Item | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string') {
    return null;
  }

  const quantity = parseQuantity(value.quantity);
  const unit =
    quantity !== undefined ? (isItemUnit(value.unit) ? value.unit : 'piece') : undefined;
  const note = typeof value.note === 'string' ? normalizeItemNote(value.note) : undefined;

  return {
    id: value.id,
    name: value.name,
    checked: typeof value.checked === 'boolean' ? value.checked : undefined,
    quantity,
    unit,
    note,
  };
}

export function parseItems(value: unknown): Item[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(parseItem).filter((item): item is Item => item !== null);
}

export function parseShoppingList(value: unknown): ShoppingList | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.name !== 'string' ||
    !Array.isArray(value.items) ||
    typeof value.createdAt !== 'string' ||
    typeof value.updatedAt !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    items: parseItems(value.items),
    status: isListStatus(value.status) ? value.status : 'active',
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

export function parseShoppingLists(value: unknown): ShoppingList[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map(parseShoppingList)
    .filter((list): list is ShoppingList => list !== null);
}
