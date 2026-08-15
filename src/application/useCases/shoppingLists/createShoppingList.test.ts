import type { ShoppingList } from '@/domain/entities/shoppingList';
import type { Clock } from '@/domain/ports/clock';
import type { IdGenerator } from '@/domain/ports/idGenerator';
import type { ShoppingListRepository } from '@/domain/ports/shoppingListRepository';

import { makeCreateShoppingList } from './createShoppingList';

function createDeps(
  overrides: {
    save?: jest.Mock;
  } = {}
) {
  const save = overrides.save ?? jest.fn(async (_list: ShoppingList) => undefined);
  const repository: ShoppingListRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    save,
    replaceAll: jest.fn(),
  };
  const clock: Clock = { now: () => '2026-01-01T12:00:00.000Z' };
  const idGenerator: IdGenerator = { generate: () => 'id-1' };
  return { repository, clock, idGenerator, save };
}

describe('makeCreateShoppingList', () => {
  it('rejects an empty title before persisting', async () => {
    const { repository, clock, idGenerator, save } = createDeps();
    const create = makeCreateShoppingList(repository, clock, idGenerator);

    await expect(create('   ')).rejects.toThrow('List title must not be empty');
    expect(save).not.toHaveBeenCalled();
  });

  it('persists a normalized title', async () => {
    const { repository, clock, idGenerator, save } = createDeps();
    const create = makeCreateShoppingList(repository, clock, idGenerator);

    const list = await create('  Courses  ');

    expect(list).toMatchObject({
      id: 'id-1',
      name: 'Courses',
      items: [],
      status: 'active',
      createdAt: '2026-01-01T12:00:00.000Z',
      updatedAt: '2026-01-01T12:00:00.000Z',
    });
    expect(save).toHaveBeenCalledWith(list);
  });
});
