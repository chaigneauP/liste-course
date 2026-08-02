import type { ShoppingList } from '@/domain/entities/shoppingList';
import type { Clock } from '@/domain/ports/clock';
import type { ShoppingListRepository } from '@/domain/ports/shoppingListRepository';

export type ShoppingListMutation = (list: ShoppingList) => ShoppingList;

export type MutateShoppingList = (
  listId: string,
  mutation: ShoppingListMutation
) => Promise<ShoppingList | null>;

/**
 * Brique commune à toutes les modifications d'une liste : charge l'agrégat,
 * applique la règle métier, horodate puis persiste. Quand le domaine refuse la
 * modification il renvoie la liste inchangée, on évite alors toute écriture.
 */
export function makeMutateShoppingList(
  repository: ShoppingListRepository,
  clock: Clock
): MutateShoppingList {
  return async (listId, mutation) => {
    const list = await repository.findById(listId);
    if (!list) {
      return null;
    }

    const mutated = mutation(list);
    if (mutated === list) {
      return list;
    }

    const updated: ShoppingList = { ...mutated, updatedAt: clock.now() };
    await repository.save(updated);
    return updated;
  };
}
