import {
  coerceItemAisle,
  isItemUnit,
  normalizeItemNote,
  type Item,
  type ItemAisle,
  type ItemUnit,
} from './item';
import { normalizeListTitle, parseListTitle } from './listTitle';
import type { ShoppingList } from './shoppingList';

export const LIST_EXPORT_FORMAT = 'liste-course' as const;
export const LIST_EXPORT_VERSION = 1 as const;

export type ExportedItem = {
  name: string;
  checked?: boolean;
  quantity?: number;
  unit?: ItemUnit;
  note?: string;
  aisle?: ItemAisle;
};

export type ExportedListPayload = {
  format: typeof LIST_EXPORT_FORMAT;
  version: typeof LIST_EXPORT_VERSION;
  list: {
    name: string;
    items: ExportedItem[];
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseExportedQuantity(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }
  return value;
}

function parseExportedItem(value: unknown): ExportedItem | null {
  if (!isRecord(value) || typeof value.name !== 'string') {
    return null;
  }

  const name = value.name.trim();
  if (!name) {
    return null;
  }

  const quantity = parseExportedQuantity(value.quantity);
  const unit =
    quantity !== undefined ? (isItemUnit(value.unit) ? value.unit : 'piece') : undefined;
  const note = typeof value.note === 'string' ? normalizeItemNote(value.note) : undefined;
  const aisle = coerceItemAisle(value.aisle);
  const checked = typeof value.checked === 'boolean' ? value.checked : undefined;

  return { name, checked, quantity, unit, note, aisle };
}

function parseExportedItems(value: unknown): ExportedItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(parseExportedItem).filter((item): item is ExportedItem => item !== null);
}

/** Construit le payload versionné à partir d’une liste du domaine. */
export function buildListExportPayload(list: ShoppingList): ExportedListPayload {
  return {
    format: LIST_EXPORT_FORMAT,
    version: LIST_EXPORT_VERSION,
    list: {
      name: list.name,
      items: list.items.map((item) => {
        const exported: ExportedItem = { name: item.name };
        if (item.checked !== undefined) {
          exported.checked = item.checked;
        }
        if (item.quantity !== undefined) {
          exported.quantity = item.quantity;
          exported.unit = item.unit;
        }
        if (item.note !== undefined) {
          exported.note = item.note;
        }
        if (item.aisle !== undefined) {
          exported.aisle = item.aisle;
        }
        return exported;
      }),
    },
  };
}

export function serializeListExport(list: ShoppingList): string {
  return JSON.stringify(buildListExportPayload(list), null, 2);
}

/** Valide un JSON d’export ; renvoie `null` si le format est invalide. */
export function parseListExport(raw: string): ExportedListPayload | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (
    !isRecord(parsed) ||
    parsed.format !== LIST_EXPORT_FORMAT ||
    parsed.version !== LIST_EXPORT_VERSION ||
    !isRecord(parsed.list) ||
    typeof parsed.list.name !== 'string'
  ) {
    return null;
  }

  const name = parseListTitle(parsed.list.name);
  if (name === null) {
    return null;
  }

  return {
    format: LIST_EXPORT_FORMAT,
    version: LIST_EXPORT_VERSION,
    list: {
      name,
      items: parseExportedItems(parsed.list.items),
    },
  };
}

export type ImportListIds = {
  listId: string;
  nextItemId: () => string;
};

/** Crée une nouvelle liste active à partir d’un export (nouveaux ids). */
export function buildShoppingListFromExport(
  payload: ExportedListPayload,
  ids: ImportListIds,
  now: string
): ShoppingList {
  const items: Item[] = payload.list.items.map((exported) => {
    const item: Item = {
      id: ids.nextItemId(),
      name: exported.name,
    };
    if (exported.checked !== undefined) {
      item.checked = exported.checked;
    }
    if (exported.quantity !== undefined) {
      item.quantity = exported.quantity;
      item.unit = exported.unit ?? 'piece';
    }
    if (exported.note !== undefined) {
      item.note = exported.note;
    }
    if (exported.aisle !== undefined) {
      item.aisle = exported.aisle;
    }
    return item;
  });

  return {
    id: ids.listId,
    name: payload.list.name,
    items,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };
}

/** Nom de fichier sûr pour le partage (sans extension). */
export function buildExportBasename(listName: string): string {
  const normalized = normalizeListTitle(listName)
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
  return normalized.length > 0 ? normalized : 'liste';
}

export function buildExportFilename(listName: string): string {
  return `${buildExportBasename(listName)}.json`;
}
