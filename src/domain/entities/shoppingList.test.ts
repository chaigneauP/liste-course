import { createItem } from './item';
import {
  addItemToList,
  filterListsByStatus,
  getListCompletion,
  markListAsArchived,
  removeItemFromList,
  sortListsByRecentUpdate,
  toggleItemInList,
  updateItemInList,
  type ShoppingList,
} from './shoppingList';

function makeList(overrides: Partial<ShoppingList> = {}): ShoppingList {
  return {
    id: 'list-1',
    name: 'Courses',
    items: [],
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('shoppingList entity', () => {
  describe('identity no-ops', () => {
    it('updateItemInList returns the same reference when the item is missing', () => {
      const list = makeList({ items: [createItem('a', { name: 'Pain' })] });
      expect(updateItemInList(list, 'missing', { name: 'Lait' })).toBe(list);
    });

    it('updateItemInList returns the same reference when details are unchanged', () => {
      const list = makeList({ items: [createItem('a', { name: 'Pain' })] });
      expect(updateItemInList(list, 'a', { name: 'Pain' })).toBe(list);
      expect(updateItemInList(list, 'a', { name: '  Pain  ' })).toBe(list);
    });

    it('toggleItemInList returns the same reference when the item is missing', () => {
      const list = makeList({ items: [createItem('a', { name: 'Pain' })] });
      expect(toggleItemInList(list, 'missing')).toBe(list);
    });

    it('removeItemFromList returns the same reference when the item is missing', () => {
      const list = makeList({ items: [createItem('a', { name: 'Pain' })] });
      expect(removeItemFromList(list, 'missing')).toBe(list);
    });

    it('markListAsArchived returns the same reference when already archived', () => {
      const list = makeList({ status: 'archived' });
      expect(markListAsArchived(list)).toBe(list);
    });

    it('mutations on archived lists are no-ops by identity', () => {
      const list = makeList({
        status: 'archived',
        items: [createItem('a', { name: 'Pain' })],
      });
      expect(addItemToList(list, createItem('b', { name: 'Lait' }))).toBe(list);
      expect(toggleItemInList(list, 'a')).toBe(list);
      expect(updateItemInList(list, 'a', { name: 'Eau' })).toBe(list);
      expect(removeItemFromList(list, 'a')).toBe(list);
    });
  });

  describe('mutations', () => {
    it('toggles an item and returns a new list', () => {
      const list = makeList({ items: [createItem('a', { name: 'Pain' })] });
      const next = toggleItemInList(list, 'a');
      expect(next).not.toBe(list);
      expect(next.items[0]?.checked).toBe(true);
    });

    it('updates item details', () => {
      const list = makeList({ items: [createItem('a', { name: 'Pain' })] });
      const next = updateItemInList(list, 'a', {
        name: '  Baguette  ',
        quantity: 2,
        unit: 'piece',
      });
      expect(next.items[0]).toEqual({
        id: 'a',
        name: 'Baguette',
        quantity: 2,
        unit: 'piece',
      });
    });

    it('clears quantity and unit when omitted', () => {
      const list = makeList({
        items: [createItem('a', { name: 'Lait', quantity: 1, unit: 'l' })],
      });
      const next = updateItemInList(list, 'a', { name: 'Lait' });
      expect(next.items[0]).toEqual({ id: 'a', name: 'Lait' });
    });
  });

  describe('completion & filters', () => {
    it('reports completion only when the list has items', () => {
      expect(getListCompletion(makeList())).toBeUndefined();
      expect(
        getListCompletion(makeList({ items: [createItem('a', { name: 'Pain' })] }))
      ).toBe('in-progress');
      expect(
        getListCompletion(
          makeList({ items: [{ id: 'a', name: 'Pain', checked: true }] })
        )
      ).toBe('complete');
    });

    it('filters by status', () => {
      const lists = [
        makeList({ id: '1', status: 'active' }),
        makeList({ id: '2', status: 'archived' }),
      ];
      expect(filterListsByStatus(lists, 'archived').map((l) => l.id)).toEqual(['2']);
    });

    it('sorts by updatedAt descending without Date parsing', () => {
      const lists = [
        makeList({ id: 'old', updatedAt: '2026-01-01T00:00:00.000Z' }),
        makeList({ id: 'new', updatedAt: '2026-02-01T00:00:00.000Z' }),
      ];
      expect(sortListsByRecentUpdate(lists).map((l) => l.id)).toEqual(['new', 'old']);
    });
  });
});
