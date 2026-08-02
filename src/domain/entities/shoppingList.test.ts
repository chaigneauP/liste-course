import { createItem } from './item';
import {
  addItemToList,
  filterListsByStatus,
  getListCompletion,
  markListAsArchived,
  removeItemFromList,
  renameItemInList,
  sortListsByRecentUpdate,
  toggleItemInList,
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
    it('renameItemInList returns the same reference when the item is missing', () => {
      const list = makeList({ items: [createItem('a', 'Pain')] });
      expect(renameItemInList(list, 'missing', 'Lait')).toBe(list);
    });

    it('renameItemInList returns the same reference when the name is unchanged', () => {
      const list = makeList({ items: [createItem('a', 'Pain')] });
      expect(renameItemInList(list, 'a', 'Pain')).toBe(list);
      expect(renameItemInList(list, 'a', '  Pain  ')).toBe(list);
    });

    it('toggleItemInList returns the same reference when the item is missing', () => {
      const list = makeList({ items: [createItem('a', 'Pain')] });
      expect(toggleItemInList(list, 'missing')).toBe(list);
    });

    it('removeItemFromList returns the same reference when the item is missing', () => {
      const list = makeList({ items: [createItem('a', 'Pain')] });
      expect(removeItemFromList(list, 'missing')).toBe(list);
    });

    it('markListAsArchived returns the same reference when already archived', () => {
      const list = makeList({ status: 'archived' });
      expect(markListAsArchived(list)).toBe(list);
    });

    it('mutations on archived lists are no-ops by identity', () => {
      const list = makeList({
        status: 'archived',
        items: [createItem('a', 'Pain')],
      });
      expect(addItemToList(list, createItem('b', 'Lait'))).toBe(list);
      expect(toggleItemInList(list, 'a')).toBe(list);
      expect(renameItemInList(list, 'a', 'Eau')).toBe(list);
      expect(removeItemFromList(list, 'a')).toBe(list);
    });
  });

  describe('mutations', () => {
    it('toggles an item and returns a new list', () => {
      const list = makeList({ items: [createItem('a', 'Pain')] });
      const next = toggleItemInList(list, 'a');
      expect(next).not.toBe(list);
      expect(next.items[0]?.checked).toBe(true);
    });

    it('renames an item', () => {
      const list = makeList({ items: [createItem('a', 'Pain')] });
      const next = renameItemInList(list, 'a', '  Baguette  ');
      expect(next.items[0]?.name).toBe('Baguette');
    });
  });

  describe('completion & filters', () => {
    it('reports completion only when the list has items', () => {
      expect(getListCompletion(makeList())).toBeUndefined();
      expect(
        getListCompletion(makeList({ items: [createItem('a', 'Pain')] }))
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
