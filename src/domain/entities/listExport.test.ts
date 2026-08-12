import {
  buildExportFilename,
  buildListExportPayload,
  buildShoppingListFromExport,
  parseListExport,
  serializeListExport,
} from './listExport';
import type { ShoppingList } from './shoppingList';

const sampleList: ShoppingList = {
  id: 'list-1',
  name: 'Courses weekend',
  items: [
    {
      id: 'item-1',
      name: 'Pain',
      checked: true,
      quantity: 2,
      unit: 'piece',
      aisle: 'bakery',
    },
    {
      id: 'item-2',
      name: 'Lait',
      note: 'demi-écrémé',
      aisle: 'dairy',
    },
  ],
  status: 'archived',
  createdAt: '2026-01-01T10:00:00.000Z',
  updatedAt: '2026-01-02T10:00:00.000Z',
};

describe('listExport', () => {
  it('serializes a versioned payload without internal ids', () => {
    const payload = buildListExportPayload(sampleList);

    expect(payload).toEqual({
      format: 'liste-course',
      version: 1,
      list: {
        name: 'Courses weekend',
        items: [
          {
            name: 'Pain',
            checked: true,
            quantity: 2,
            unit: 'piece',
            aisle: 'bakery',
          },
          {
            name: 'Lait',
            note: 'demi-écrémé',
            aisle: 'dairy',
          },
        ],
      },
    });
    expect(serializeListExport(sampleList)).toContain('"format": "liste-course"');
  });

  it('parses a valid export and rejects invalid ones', () => {
    const raw = serializeListExport(sampleList);
    expect(parseListExport(raw)?.list.name).toBe('Courses weekend');
    expect(parseListExport('{')).toBeNull();
    expect(parseListExport('{"format":"other","version":1,"list":{"name":"A","items":[]}}')).toBeNull();
    expect(parseListExport('{"format":"liste-course","version":2,"list":{"name":"A","items":[]}}')).toBeNull();
    expect(parseListExport('{"format":"liste-course","version":1,"list":{"name":"   ","items":[]}}')).toBeNull();
  });

  it('rebuilds an active list with fresh ids', () => {
    const payload = buildListExportPayload(sampleList);
    let counter = 0;
    const list = buildShoppingListFromExport(
      payload,
      {
        listId: 'new-list',
        nextItemId: () => `new-item-${++counter}`,
      },
      '2026-08-12T08:00:00.000Z'
    );

    expect(list).toEqual({
      id: 'new-list',
      name: 'Courses weekend',
      status: 'active',
      createdAt: '2026-08-12T08:00:00.000Z',
      updatedAt: '2026-08-12T08:00:00.000Z',
      items: [
        {
          id: 'new-item-1',
          name: 'Pain',
          checked: true,
          quantity: 2,
          unit: 'piece',
          aisle: 'bakery',
        },
        {
          id: 'new-item-2',
          name: 'Lait',
          note: 'demi-écrémé',
          aisle: 'dairy',
        },
      ],
    });
  });

  it('builds a safe export filename', () => {
    expect(buildExportFilename('Courses / week:end')).toBe('Courses _ week_end.json');
    expect(buildExportFilename('   ')).toBe('liste.json');
  });
});
