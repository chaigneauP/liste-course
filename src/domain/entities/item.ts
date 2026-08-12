export type ItemUnit = 'piece' | 'g' | 'kg' | 'ml' | 'l';

const ITEM_UNITS: ItemUnit[] = ['piece', 'g', 'kg', 'ml', 'l'];

export function isItemUnit(value: unknown): value is ItemUnit {
  return typeof value === 'string' && ITEM_UNITS.includes(value as ItemUnit);
}

export const MAX_ITEM_NOTE_LENGTH = 80;

export type Item = {
  id: string;
  name: string;
  checked?: boolean;
  quantity?: number;
  unit?: ItemUnit;
  note?: string;
};

export type ItemDetails = {
  name: string;
  quantity?: number;
  unit?: ItemUnit;
  note?: string;
};

export function normalizeItemNote(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.length > MAX_ITEM_NOTE_LENGTH) {
    return trimmed.slice(0, MAX_ITEM_NOTE_LENGTH);
  }
  return trimmed;
}

const UNIT_LABELS: Record<ItemUnit, string> = {
  piece: 'u',
  g: 'g',
  kg: 'kg',
  ml: 'mL',
  l: 'L',
};

function normalizeItemDetails(details: ItemDetails): ItemDetails {
  const name = details.name.trim();
  let quantity = details.quantity;
  let unit = details.unit;
  const note = details.note !== undefined ? normalizeItemNote(details.note) : undefined;

  if (quantity !== undefined && (!Number.isFinite(quantity) || quantity <= 0)) {
    quantity = undefined;
    unit = undefined;
  }

  if (quantity === undefined) {
    unit = undefined;
  } else if (!unit || !isItemUnit(unit)) {
    unit = 'piece';
  }

  return { name, quantity, unit, note };
}

export function createItem(id: string, details: ItemDetails): Item {
  const normalized = normalizeItemDetails(details);
  const item: Item = { id, name: normalized.name };

  if (normalized.quantity !== undefined) {
    item.quantity = normalized.quantity;
    item.unit = normalized.unit;
  }

  if (normalized.note !== undefined) {
    item.note = normalized.note;
  }

  return item;
}

function formatQuantityNumber(quantity: number): string {
  return Number.isInteger(quantity) ? String(quantity) : String(quantity);
}

export function formatItemQuantity(item: Pick<Item, 'quantity' | 'unit'>): string | undefined {
  if (item.quantity === undefined) {
    return undefined;
  }

  const unit = item.unit ?? 'piece';
  return `${formatQuantityNumber(item.quantity)} ${UNIT_LABELS[unit]}`;
}

export function itemDetailsMatchItem(item: Item, details: ItemDetails): boolean {
  const normalized = normalizeItemDetails(details);

  if (item.name !== normalized.name) {
    return false;
  }

  if (item.quantity !== normalized.quantity) {
    return false;
  }

  if (normalized.quantity === undefined) {
    if (item.unit !== undefined) {
      return false;
    }
  } else if ((item.unit ?? 'piece') !== normalized.unit) {
    return false;
  }

  return item.note === normalized.note;
}

export function applyItemDetails(item: Item, details: ItemDetails): Item {
  const normalized = normalizeItemDetails(details);
  const next: Item = {
    id: item.id,
    name: normalized.name,
    checked: item.checked,
  };

  if (normalized.quantity !== undefined) {
    next.quantity = normalized.quantity;
    next.unit = normalized.unit;
  }

  if (normalized.note !== undefined) {
    next.note = normalized.note;
  }

  return next;
}
