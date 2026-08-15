import {
  DEFAULT_AISLE_DICTIONARY_SEED,
  addAisleEntryIfUnknown,
  lookupAisle,
  mergeSeedIntoDictionary,
  normalizeAisleDictionaryKey,
  resolveAisleLearning,
  upsertAisleEntry,
  type AisleDictionary,
} from './aisleDictionary';

describe('aisleDictionary entity', () => {
  describe('normalizeAisleDictionaryKey', () => {
    it('trims and lowercases the name', () => {
      expect(normalizeAisleDictionaryKey('  Lait  ')).toBe('lait');
    });

    it('strips accents and folds œ', () => {
      expect(normalizeAisleDictionaryKey('Pâtes')).toBe('pates');
      expect(normalizeAisleDictionaryKey('Œufs')).toBe('oeufs');
      expect(normalizeAisleDictionaryKey('Épinard')).toBe('epinard');
    });

    it('returns undefined for blank names', () => {
      expect(normalizeAisleDictionaryKey('   ')).toBeUndefined();
    });
  });

  describe('lookupAisle', () => {
    it('returns the aisle for a known normalized name', () => {
      expect(lookupAisle({ lait: 'fresh' }, 'Lait')).toBe('fresh');
    });

    it('returns undefined when the name is unknown', () => {
      expect(lookupAisle({ lait: 'fresh' }, 'Ketchup')).toBeUndefined();
    });

    it('matches the full normalized name only', () => {
      expect(lookupAisle({ 'lait demi-ecreme': 'fresh' }, 'Lait')).toBeUndefined();
    });

    it('resolves seeded catalog entries with accents', () => {
      expect(lookupAisle(DEFAULT_AISLE_DICTIONARY_SEED, 'Pomme')).toBe('produce');
      expect(lookupAisle(DEFAULT_AISLE_DICTIONARY_SEED, 'Pâtes')).toBe('grocery');
      expect(lookupAisle(DEFAULT_AISLE_DICTIONARY_SEED, 'Papier toilette')).toBe('hygiene');
      expect(lookupAisle(DEFAULT_AISLE_DICTIONARY_SEED, 'Poulet')).toBe('meat_fish');
    });
  });

  describe('upsertAisleEntry', () => {
    it('adds a new entry', () => {
      expect(upsertAisleEntry({}, 'Ketchup', 'grocery')).toEqual({
        ketchup: 'grocery',
      });
    });

    it('updates an existing entry', () => {
      expect(upsertAisleEntry({ ketchup: 'grocery' }, 'Ketchup', 'hygiene')).toEqual({
        ketchup: 'hygiene',
      });
    });

    it('returns the same reference when nothing changes', () => {
      const dictionary: AisleDictionary = { ketchup: 'grocery' };
      expect(upsertAisleEntry(dictionary, 'Ketchup', 'grocery')).toBe(dictionary);
    });

    it('ignores blank names', () => {
      const dictionary: AisleDictionary = { lait: 'fresh' };
      expect(upsertAisleEntry(dictionary, '   ', 'grocery')).toBe(dictionary);
    });
  });

  describe('addAisleEntryIfUnknown', () => {
    it('adds only when the key is missing', () => {
      expect(addAisleEntryIfUnknown({}, 'Ketchup', 'grocery')).toEqual({
        ketchup: 'grocery',
      });
    });

    it('does not overwrite an existing entry', () => {
      const dictionary: AisleDictionary = { pomme: 'produce' };
      expect(addAisleEntryIfUnknown(dictionary, 'Pomme', 'grocery')).toBe(dictionary);
    });

    it('ignores blank names', () => {
      const dictionary: AisleDictionary = { lait: 'fresh' };
      expect(addAisleEntryIfUnknown(dictionary, '   ', 'grocery')).toBe(dictionary);
    });
  });

  describe('resolveAisleLearning', () => {
    it('returns none when aisle is undefined', () => {
      expect(resolveAisleLearning({ pomme: 'produce' }, 'Pomme', undefined)).toEqual({
        type: 'none',
      });
    });

    it('returns learn for unknown names', () => {
      expect(resolveAisleLearning({}, 'Ketchup', 'grocery')).toEqual({
        type: 'learn',
        name: 'Ketchup',
        aisle: 'grocery',
      });
    });

    it('returns none when the aisle matches the known one', () => {
      expect(resolveAisleLearning({ pomme: 'produce' }, 'Pomme', 'produce')).toEqual({
        type: 'none',
      });
    });

    it('returns confirm when the aisle differs from the known one', () => {
      expect(resolveAisleLearning({ pomme: 'produce' }, 'Pomme', 'grocery')).toEqual({
        type: 'confirm',
        name: 'Pomme',
        previousAisle: 'produce',
        nextAisle: 'grocery',
      });
    });
  });

  describe('mergeSeedIntoDictionary', () => {
    it('adds missing seed entries without overwriting learned ones', () => {
      const dictionary: AisleDictionary = { nutella: 'grocery' };
      const merged = mergeSeedIntoDictionary(dictionary, DEFAULT_AISLE_DICTIONARY_SEED);

      expect(merged.nutella).toBe('grocery');
      expect(merged.lait).toBe('fresh');
      expect(merged).not.toBe(dictionary);
    });

    it('returns the same reference when every seed key already exists', () => {
      const dictionary = { ...DEFAULT_AISLE_DICTIONARY_SEED };
      expect(mergeSeedIntoDictionary(dictionary, DEFAULT_AISLE_DICTIONARY_SEED)).toBe(dictionary);
    });
  });
});
