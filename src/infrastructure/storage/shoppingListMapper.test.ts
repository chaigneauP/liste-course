import { parseItem, parseItems, parseShoppingList, parseShoppingLists } from './shoppingListMapper';

describe('shoppingListMapper', () => {
  describe('parseItem', () => {
    it('accepts a valid item and defaults checked', () => {
      expect(parseItem({ id: 'a', name: 'Pain' })).toEqual({
        id: 'a',
        name: 'Pain',
        checked: undefined,
        quantity: undefined,
        unit: undefined,
        note: undefined,
        aisle: undefined,
      });
      expect(parseItem({ id: 'a', name: 'Pain', checked: true })).toEqual({
        id: 'a',
        name: 'Pain',
        checked: true,
        quantity: undefined,
        unit: undefined,
        note: undefined,
        aisle: undefined,
      });
    });

    it('accepts quantity and unit with validation', () => {
      expect(parseItem({ id: 'a', name: 'Farine', quantity: 500, unit: 'g' })).toEqual({
        id: 'a',
        name: 'Farine',
        checked: undefined,
        quantity: 500,
        unit: 'g',
        note: undefined,
        aisle: undefined,
      });
      expect(parseItem({ id: 'a', name: 'Oeufs', quantity: 2 })).toEqual({
        id: 'a',
        name: 'Oeufs',
        checked: undefined,
        quantity: 2,
        unit: 'piece',
        note: undefined,
        aisle: undefined,
      });
      expect(parseItem({ id: 'a', name: 'Pain', quantity: 0, unit: 'kg' })).toEqual({
        id: 'a',
        name: 'Pain',
        checked: undefined,
        quantity: undefined,
        unit: undefined,
        note: undefined,
        aisle: undefined,
      });
      expect(parseItem({ id: 'a', name: 'Pain', quantity: 1, unit: 'invalid' })).toEqual({
        id: 'a',
        name: 'Pain',
        checked: undefined,
        quantity: 1,
        unit: 'piece',
        note: undefined,
        aisle: undefined,
      });
    });

    it('accepts and normalizes note', () => {
      expect(parseItem({ id: 'a', name: 'Lait', note: '  bio  ' })).toEqual({
        id: 'a',
        name: 'Lait',
        checked: undefined,
        quantity: undefined,
        unit: undefined,
        note: 'bio',
        aisle: undefined,
      });
      expect(parseItem({ id: 'a', name: 'Lait', note: '   ' })).toEqual({
        id: 'a',
        name: 'Lait',
        checked: undefined,
        quantity: undefined,
        unit: undefined,
        note: undefined,
        aisle: undefined,
      });
      expect(parseItem({ id: 'a', name: 'Lait', note: 123 })).toEqual({
        id: 'a',
        name: 'Lait',
        checked: undefined,
        quantity: undefined,
        unit: undefined,
        note: undefined,
        aisle: undefined,
      });
    });

    it('accepts aisle with validation', () => {
      expect(parseItem({ id: 'a', name: 'Tomates', aisle: 'produce' })).toEqual({
        id: 'a',
        name: 'Tomates',
        checked: undefined,
        quantity: undefined,
        unit: undefined,
        note: undefined,
        aisle: 'produce',
      });
      expect(parseItem({ id: 'a', name: 'Tomates', aisle: 'invalid' })).toEqual({
        id: 'a',
        name: 'Tomates',
        checked: undefined,
        quantity: undefined,
        unit: undefined,
        note: undefined,
        aisle: undefined,
      });
    });

    it('rejects invalid payloads', () => {
      expect(parseItem(null)).toBeNull();
      expect(parseItem({ id: 1, name: 'Pain' })).toBeNull();
      expect(parseItem({ id: 'a' })).toBeNull();
    });
  });

  describe('parseItems', () => {
    it('filters out invalid entries', () => {
      expect(parseItems([{ id: 'a', name: 'Pain' }, { id: 2 }, null])).toEqual([
        {
          id: 'a',
          name: 'Pain',
          checked: undefined,
          quantity: undefined,
          unit: undefined,
          note: undefined,
          aisle: undefined,
        },
      ]);
      expect(parseItems('nope')).toEqual([]);
    });
  });

  describe('parseShoppingList', () => {
    const valid = {
      id: 'list-1',
      name: 'Courses',
      items: [{ id: 'a', name: 'Pain', checked: false }],
      status: 'active',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    };

    it('parses a valid list', () => {
      expect(parseShoppingList(valid)).toEqual({
        id: 'list-1',
        name: 'Courses',
        items: [
          {
            id: 'a',
            name: 'Pain',
            checked: false,
            quantity: undefined,
            unit: undefined,
            note: undefined,
            aisle: undefined,
          },
        ],
        status: 'active',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      });
    });

    it('defaults unknown status to active', () => {
      expect(parseShoppingList({ ...valid, status: 'weird' })?.status).toBe('active');
    });

    it('rejects incomplete payloads', () => {
      expect(parseShoppingList({ id: 'list-1', name: 'Courses' })).toBeNull();
      expect(parseShoppingList(null)).toBeNull();
    });
  });

  describe('parseShoppingLists', () => {
    it('keeps only valid lists', () => {
      const lists = parseShoppingLists([
        {
          id: 'ok',
          name: 'A',
          items: [],
          status: 'archived',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
        { id: 'bad' },
      ]);
      expect(lists).toHaveLength(1);
      expect(lists[0]?.id).toBe('ok');
      expect(parseShoppingLists(null)).toEqual([]);
    });
  });
});
