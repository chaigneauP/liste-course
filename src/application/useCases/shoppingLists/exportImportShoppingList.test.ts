import type { ShoppingList } from '@/domain/entities/shoppingList';
import type { Clock } from '@/domain/ports/clock';
import type { IdGenerator } from '@/domain/ports/idGenerator';
import type { ListTransferGateway } from '@/domain/ports/listTransferGateway';
import type { ShoppingListRepository } from '@/domain/ports/shoppingListRepository';

import { makeExportShoppingList } from './exportShoppingList';
import { makeImportShoppingList } from './importShoppingList';

function createDeps(overrides: {
  findById?: jest.Mock;
  save?: jest.Mock;
  shareJsonFile?: jest.Mock;
  pickJsonFileContents?: jest.Mock;
} = {}) {
  const findById = overrides.findById ?? jest.fn();
  const save = overrides.save ?? jest.fn(async (_list: ShoppingList) => undefined);
  const shareJsonFile = overrides.shareJsonFile ?? jest.fn(async () => undefined);
  const pickJsonFileContents = overrides.pickJsonFileContents ?? jest.fn(async () => null);

  const repository: ShoppingListRepository = {
    findAll: jest.fn(),
    findById,
    save,
    replaceAll: jest.fn(),
  };
  const transfer: ListTransferGateway = {
    shareJsonFile,
    pickJsonFileContents,
  };
  const clock: Clock = { now: () => '2026-08-12T08:00:00.000Z' };
  let idCounter = 0;
  const idGenerator: IdGenerator = {
    generate: () => `id-${++idCounter}`,
  };

  return {
    repository,
    transfer,
    clock,
    idGenerator,
    findById,
    save,
    shareJsonFile,
    pickJsonFileContents,
  };
}

const sampleList: ShoppingList = {
  id: 'list-1',
  name: 'Courses',
  items: [{ id: 'item-1', name: 'Pain', quantity: 1, unit: 'piece' }],
  status: 'active',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('export/import shopping list use cases', () => {
  it('exports an existing list as a JSON file', async () => {
    const { repository, transfer, findById, shareJsonFile } = createDeps({
      findById: jest.fn(async () => sampleList),
    });
    const exportList = makeExportShoppingList(repository, transfer);

    await exportList('list-1');

    expect(findById).toHaveBeenCalledWith('list-1');
    expect(shareJsonFile).toHaveBeenCalledWith(
      'Courses.json',
      expect.stringContaining('"format": "liste-course"')
    );
  });

  it('rejects export when the list is missing', async () => {
    const { repository, transfer, shareJsonFile } = createDeps({
      findById: jest.fn(async () => null),
    });
    const exportList = makeExportShoppingList(repository, transfer);

    await expect(exportList('missing')).rejects.toThrow('Shopping list not found');
    expect(shareJsonFile).not.toHaveBeenCalled();
  });

  it('returns null when the user cancels the picker', async () => {
    const { repository, transfer, clock, idGenerator, save } = createDeps();
    const importList = makeImportShoppingList(repository, transfer, clock, idGenerator);

    await expect(importList()).resolves.toBeNull();
    expect(save).not.toHaveBeenCalled();
  });

  it('imports a valid export as a new active list', async () => {
    const raw = JSON.stringify({
      format: 'liste-course',
      version: 1,
      list: {
        name: 'Importée',
        items: [{ name: 'Lait', aisle: 'fresh' }],
      },
    });
    const { repository, transfer, clock, idGenerator, save, pickJsonFileContents } = createDeps({
      pickJsonFileContents: jest.fn(async () => raw),
    });
    const importList = makeImportShoppingList(repository, transfer, clock, idGenerator);

    const list = await importList();

    expect(list).toMatchObject({
      id: 'id-1',
      name: 'Importée',
      status: 'active',
      items: [{ id: 'id-2', name: 'Lait', aisle: 'fresh' }],
      createdAt: '2026-08-12T08:00:00.000Z',
      updatedAt: '2026-08-12T08:00:00.000Z',
    });
    expect(save).toHaveBeenCalledWith(list);
    expect(pickJsonFileContents).toHaveBeenCalled();
  });

  it('rejects an invalid export file', async () => {
    const { repository, transfer, clock, idGenerator, save } = createDeps({
      pickJsonFileContents: jest.fn(async () => '{"oops":true}'),
    });
    const importList = makeImportShoppingList(repository, transfer, clock, idGenerator);

    await expect(importList()).rejects.toThrow('Invalid list export file');
    expect(save).not.toHaveBeenCalled();
  });
});
