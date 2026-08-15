import { buildExportFilename, serializeListExport } from '@/domain/entities/listExport';
import type { ListTransferGateway } from '@/domain/ports/listTransferGateway';
import type { ShoppingListRepository } from '@/domain/ports/shoppingListRepository';

export type ExportShoppingList = (listId: string) => Promise<void>;

export function makeExportShoppingList(
  repository: ShoppingListRepository,
  transfer: ListTransferGateway
): ExportShoppingList {
  return async (listId) => {
    const list = await repository.findById(listId);
    if (!list) {
      throw new Error('Shopping list not found');
    }

    await transfer.shareJsonFile(buildExportFilename(list.name), serializeListExport(list));
  };
}
