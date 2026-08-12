import {
  createItem,
  formatItemQuantity,
  isItemUnit,
} from './item';

describe('item entity', () => {
  describe('createItem', () => {
    it('trims the name and omits invalid quantity', () => {
      expect(createItem('a', { name: '  Lait  ', quantity: 0, unit: 'l' })).toEqual({
        id: 'a',
        name: 'Lait',
      });
    });

    it('stores quantity with default unit piece', () => {
      expect(createItem('a', { name: 'Oeufs', quantity: 2 })).toEqual({
        id: 'a',
        name: 'Oeufs',
        quantity: 2,
        unit: 'piece',
      });
    });

    it('stores quantity with explicit unit', () => {
      expect(createItem('a', { name: 'Farine', quantity: 500, unit: 'g' })).toEqual({
        id: 'a',
        name: 'Farine',
        quantity: 500,
        unit: 'g',
      });
    });

    it('omits unit when quantity is absent', () => {
      expect(createItem('a', { name: 'Pain' })).toEqual({
        id: 'a',
        name: 'Pain',
      });
    });
  });

  describe('formatItemQuantity', () => {
    it('returns undefined without quantity', () => {
      expect(formatItemQuantity({ quantity: undefined })).toBeUndefined();
    });

    it('formats known units', () => {
      expect(formatItemQuantity({ quantity: 2, unit: 'piece' })).toBe('2 u');
      expect(formatItemQuantity({ quantity: 500, unit: 'g' })).toBe('500 g');
      expect(formatItemQuantity({ quantity: 1.5, unit: 'kg' })).toBe('1.5 kg');
      expect(formatItemQuantity({ quantity: 250, unit: 'ml' })).toBe('250 mL');
      expect(formatItemQuantity({ quantity: 1, unit: 'l' })).toBe('1 L');
    });
  });

  describe('isItemUnit', () => {
    it('accepts only known units', () => {
      expect(isItemUnit('g')).toBe(true);
      expect(isItemUnit('piece')).toBe(true);
      expect(isItemUnit('oz')).toBe(false);
      expect(isItemUnit(null)).toBe(false);
    });
  });
});
