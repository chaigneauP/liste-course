import { isItemAisle, normalizeItemNameForComparison, type ItemAisle } from './item';
import { AISLE_DICTIONARY_ALIASES, AISLE_DICTIONARY_CATALOG } from './aisleDictionarySeed';

export type AisleDictionary = Record<string, ItemAisle>;

export type AisleLearningDecision =
  | { type: 'none' }
  | { type: 'learn'; name: string; aisle: ItemAisle }
  | { type: 'confirm'; name: string; previousAisle: ItemAisle; nextAisle: ItemAisle };

export function normalizeAisleDictionaryKey(name: string): string | undefined {
  const normalized = normalizeItemNameForComparison(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae');
  return normalized.length > 0 ? normalized : undefined;
}

export function buildAisleDictionarySeed(
  catalog: Record<ItemAisle, readonly string[]> = AISLE_DICTIONARY_CATALOG,
  aliases: ReadonlyArray<readonly [string, ItemAisle]> = AISLE_DICTIONARY_ALIASES
): AisleDictionary {
  const seed: AisleDictionary = {};

  for (const [aisle, names] of Object.entries(catalog) as [ItemAisle, readonly string[]][]) {
    for (const name of names) {
      const key = normalizeAisleDictionaryKey(name);
      if (key && seed[key] === undefined) {
        seed[key] = aisle;
      }
    }
  }

  for (const [name, aisle] of aliases) {
    const key = normalizeAisleDictionaryKey(name);
    if (key && seed[key] === undefined) {
      seed[key] = aisle;
    }
  }

  return seed;
}

export const DEFAULT_AISLE_DICTIONARY_SEED: AisleDictionary = buildAisleDictionarySeed();

export function lookupAisle(dictionary: AisleDictionary, name: string): ItemAisle | undefined {
  const key = normalizeAisleDictionaryKey(name);
  if (!key) {
    return undefined;
  }
  return dictionary[key];
}

export function resolveAisleLearning(
  dictionary: AisleDictionary,
  name: string,
  aisle: ItemAisle | undefined
): AisleLearningDecision {
  if (aisle === undefined) {
    return { type: 'none' };
  }

  const key = normalizeAisleDictionaryKey(name);
  if (!key) {
    return { type: 'none' };
  }

  const knownAisle = dictionary[key];
  if (knownAisle === undefined) {
    return { type: 'learn', name, aisle };
  }

  if (knownAisle === aisle) {
    return { type: 'none' };
  }

  return { type: 'confirm', name, previousAisle: knownAisle, nextAisle: aisle };
}

export function addAisleEntryIfUnknown(
  dictionary: AisleDictionary,
  name: string,
  aisle: ItemAisle
): AisleDictionary {
  const key = normalizeAisleDictionaryKey(name);
  if (!key || dictionary[key] !== undefined) {
    return dictionary;
  }

  return { ...dictionary, [key]: aisle };
}

export function upsertAisleEntry(
  dictionary: AisleDictionary,
  name: string,
  aisle: ItemAisle
): AisleDictionary {
  const key = normalizeAisleDictionaryKey(name);
  if (!key) {
    return dictionary;
  }

  if (dictionary[key] === aisle) {
    return dictionary;
  }

  return { ...dictionary, [key]: aisle };
}

export function mergeSeedIntoDictionary(
  dictionary: AisleDictionary,
  seed: AisleDictionary
): AisleDictionary {
  let changed = false;
  const next: AisleDictionary = { ...dictionary };

  for (const [key, aisle] of Object.entries(seed)) {
    if (next[key] === undefined) {
      next[key] = aisle;
      changed = true;
    }
  }

  return changed ? next : dictionary;
}

export function isAisleDictionary(value: unknown): value is AisleDictionary {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.entries(value).every(
    ([key, aisle]) =>
      typeof key === 'string' && key.length > 0 && typeof aisle === 'string' && isItemAisle(aisle)
  );
}

export function parseAisleDictionary(value: unknown): AisleDictionary | null {
  return isAisleDictionary(value) ? value : null;
}
