export type ItemUnit = 'piece' | 'g' | 'kg' | 'ml' | 'l';

const ITEM_UNITS: ItemUnit[] = ['piece', 'g', 'kg', 'ml', 'l'];

export function isItemUnit(value: unknown): value is ItemUnit {
  return typeof value === 'string' && ITEM_UNITS.includes(value as ItemUnit);
}

export type Item = {
  id: string;
  name: string;
  checked?: boolean;
  quantity?: number;
  unit?: ItemUnit;
};

export type ItemDetails = {
  name: string;
  quantity?: number;
  unit?: ItemUnit;
};

const UNIT_LABELS: Record<ItemUnit, string> = {
  piece: 'unité',
  g: 'g',
  kg: 'kg',
  ml: 'mL',
  l: 'L',
};

function normalizeItemDetails(details: ItemDetails): ItemDetails {
  const name = details.name.trim();
  let quantity = details.quantity;
  let unit = details.unit;

  if (quantity !== undefined && (!Number.isFinite(quantity) || quantity <= 0)) {
    quantity = undefined;
    unit = undefined;
  }

  if (quantity === undefined) {
    unit = undefined;
  } else if (!unit || !isItemUnit(unit)) {
    unit = 'piece';
  }

  return { name, quantity, unit };
}

export function createItem(id: string, details: ItemDetails): Item {
  const normalized = normalizeItemDetails(details);
  const item: Item = { id, name: normalized.name };

  if (normalized.quantity !== undefined) {
    item.quantity = normalized.quantity;
    item.unit = normalized.unit;
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
    return item.unit === undefined;
  }

  return (item.unit ?? 'piece') === normalized.unit;
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

  return next;
}
