import {
  buildExportFilename,
  serializeListExport,
} from '@/domain/entities/listExport';
import type { ListTransferGateway } from '@/domain/ports/listTransferGateway';
import type { ShoppingListRepository } from '@/domain/ports/shoppingListRepository';

export type DownloadShoppingList = (listId: string) => Promise<'saved' | 'cancelled'>;

export function makeDownloadShoppingList(
  repository: ShoppingListRepository,
  transfer: ListTransferGateway
): DownloadShoppingList {
  return async (listId) => {
    const list = await repository.findById(listId);
    if (!list) {
      throw new Error('Shopping list not found');
    }

    return transfer.saveJsonFile(buildExportFilename(list.name), serializeListExport(list));
  };
}
