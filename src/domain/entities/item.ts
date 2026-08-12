export type ItemUnit = 'piece' | 'g' | 'kg' | 'ml' | 'l';

const ITEM_UNITS: ItemUnit[] = ['piece', 'g', 'kg', 'ml', 'l'];

export function isItemUnit(value: unknown): value is ItemUnit {
  return typeof value === 'string' && ITEM_UNITS.includes(value as ItemUnit);
}

export type ItemAisle =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'fish'
  | 'bakery'
  | 'frozen'
  | 'grocery'
  | 'drinks'
  | 'hygiene'
  | 'home'
  | 'other';

const ITEM_AISLES: ItemAisle[] = [
  'produce',
  'dairy',
  'meat',
  'fish',
  'bakery',
  'frozen',
  'grocery',
  'drinks',
  'hygiene',
  'home',
  'other',
];

export function isItemAisle(value: unknown): value is ItemAisle {
  return typeof value === 'string' && ITEM_AISLES.includes(value as ItemAisle);
}

export const AUTO_AISLE_KEY = 'auto' as const;

export type ItemAisleGroupKey = typeof AUTO_AISLE_KEY | ItemAisle;

export const ITEM_AISLE_ORDER: readonly ItemAisleGroupKey[] = [
  AUTO_AISLE_KEY,
  'produce',
  'dairy',
  'meat',
  'fish',
  'bakery',
  'frozen',
  'grocery',
  'drinks',
  'hygiene',
  'home',
  'other',
];

export const ITEM_AISLE_LABELS: Record<ItemAisle, string> = {
  produce: 'Fruits et Légumes',
  dairy: 'Crèmerie',
  meat: 'Boucherie',
  fish: 'Poissonnerie',
  bakery: 'Boulangerie',
  frozen: 'Surgelés',
  grocery: 'Epicerie',
  drinks: 'Boissons',
  hygiene: 'Hygiène',
  home: 'Maison',
  other: 'Autres',
};

export const AUTO_AISLE_LABEL = 'Auto';

export type ItemAisleSection = {
  key: ItemAisleGroupKey;
  title: string;
  items: Item[];
};

export function getItemAisleSectionLabel(key: ItemAisleGroupKey): string {
  if (key === AUTO_AISLE_KEY) {
    return AUTO_AISLE_LABEL;
  }
  return ITEM_AISLE_LABELS[key];
}

export function groupItemsByAisle(items: Item[]): ItemAisleSection[] {
  const buckets = new Map<ItemAisleGroupKey, Item[]>();

  for (const item of items) {
    const key: ItemAisleGroupKey = item.aisle ?? AUTO_AISLE_KEY;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.push(item);
    } else {
      buckets.set(key, [item]);
    }
  }

  return ITEM_AISLE_ORDER.filter((key) => buckets.has(key)).map((key) => ({
    key,
    title: getItemAisleSectionLabel(key),
    items: buckets.get(key)!,
  }));
}

export const MAX_ITEM_NOTE_LENGTH = 80;

export type Item = {
  id: string;
  name: string;
  checked?: boolean;
  quantity?: number;
  unit?: ItemUnit;
  note?: string;
  aisle?: ItemAisle;
};

export type ItemDetails = {
  name: string;
  quantity?: number;
  unit?: ItemUnit;
  note?: string;
  aisle?: ItemAisle;
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
  let aisle = details.aisle;

  if (quantity !== undefined && (!Number.isFinite(quantity) || quantity <= 0)) {
    quantity = undefined;
    unit = undefined;
  }

  if (quantity === undefined) {
    unit = undefined;
  } else if (!unit || !isItemUnit(unit)) {
    unit = 'piece';
  }

  if (aisle !== undefined && !isItemAisle(aisle)) {
    aisle = undefined;
  }

  return { name, quantity, unit, note, aisle };
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

  if (normalized.aisle !== undefined) {
    item.aisle = normalized.aisle;
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

  if (item.note !== normalized.note) {
    return false;
  }

  return item.aisle === normalized.aisle;
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

  if (normalized.aisle !== undefined) {
    next.aisle = normalized.aisle;
  }

  return next;
}
