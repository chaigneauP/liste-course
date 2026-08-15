import { createItem } from '@/domain/entities/item';
import { toggleItemInList, type ShoppingList } from '@/domain/entities/shoppingList';
import type { Clock } from '@/domain/ports/clock';
import type { ShoppingListRepository } from '@/domain/ports/shoppingListRepository';

import { makeMutateShoppingList } from './mutateShoppingList';

function makeList(overrides: Partial<ShoppingList> = {}): ShoppingList {
  return {
    id: 'list-1',
    name: 'Courses',
    items: [createItem('a', { name: 'Pain' })],
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('makeMutateShoppingList', () => {
  it('returns null when the list is missing', async () => {
    const repository: ShoppingListRepository = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
      replaceAll: jest.fn(),
    };
    const clock: Clock = { now: () => '2026-02-01T00:00:00.000Z' };
    const mutate = makeMutateShoppingList(repository, clock);

    await expect(mutate('missing', (list) => list)).resolves.toBeNull();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('skips save on domain identity no-op', async () => {
    const list = makeList();
    const repository: ShoppingListRepository = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue(list),
      save: jest.fn(),
      replaceAll: jest.fn(),
    };
    const clock: Clock = { now: () => '2026-02-01T00:00:00.000Z' };
    const mutate = makeMutateShoppingList(repository, clock);

    const result = await mutate(list.id, (current) => toggleItemInList(current, 'missing'));

    expect(result).toBe(list);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('persists with a fresh updatedAt when the domain mutates', async () => {
    const list = makeList();
    const save = jest.fn(async (_updated: ShoppingList) => undefined);
    const repository: ShoppingListRepository = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue(list),
      save,
      replaceAll: jest.fn(),
    };
    const clock: Clock = { now: () => '2026-02-01T00:00:00.000Z' };
    const mutate = makeMutateShoppingList(repository, clock);

    const result = await mutate(list.id, (current) => toggleItemInList(current, 'a'));

    expect(result).not.toBeNull();
    expect(result?.items[0]?.checked).toBe(true);
    expect(result?.updatedAt).toBe('2026-02-01T00:00:00.000Z');
    expect(save).toHaveBeenCalledWith(result);
  });
});
