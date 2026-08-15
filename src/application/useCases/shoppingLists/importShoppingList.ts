import { buildShoppingListFromExport, parseListExport } from '@/domain/entities/listExport';
import type { ShoppingList } from '@/domain/entities/shoppingList';
import type { Clock } from '@/domain/ports/clock';
import type { IdGenerator } from '@/domain/ports/idGenerator';
import type { ListTransferGateway } from '@/domain/ports/listTransferGateway';
import type { ShoppingListRepository } from '@/domain/ports/shoppingListRepository';

export type ImportShoppingList = () => Promise<ShoppingList | null>;

export function makeImportShoppingList(
  repository: ShoppingListRepository,
  transfer: ListTransferGateway,
  clock: Clock,
  idGenerator: IdGenerator
): ImportShoppingList {
  return async () => {
    const contents = await transfer.pickJsonFileContents();
    if (contents === null) {
      return null;
    }

    const payload = parseListExport(contents);
    if (payload === null) {
      throw new Error('Invalid list export file');
    }

    const now = clock.now();
    const list = buildShoppingListFromExport(
      payload,
      {
        listId: idGenerator.generate(),
        nextItemId: () => idGenerator.generate(),
      },
      now
    );

    await repository.save(list);
    return list;
  };
}
