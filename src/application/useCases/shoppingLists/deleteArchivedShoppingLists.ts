import { filterListsByStatus } from '@/domain/entities/shoppingList';
import type { ShoppingListRepository } from '@/domain/ports/shoppingListRepository';

/** Renvoie le nombre de listes effectivement supprimées. */
export type DeleteArchivedShoppingLists = () => Promise<number>;

export function makeDeleteArchivedShoppingLists(
  repository: ShoppingListRepository
): DeleteArchivedShoppingLists {
  return async () => {
    const lists = await repository.findAll();
    const remaining = filterListsByStatus(lists, 'active');
    const deletedCount = lists.length - remaining.length;

    if (deletedCount === 0) {
      return 0;
    }

    await repository.replaceAll(remaining);
    return deletedCount;
  };
}
