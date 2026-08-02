import { normalizeListTitle } from '@/domain/entities/listTitle';
import type { ShoppingList } from '@/domain/entities/shoppingList';
import type { Clock } from '@/domain/ports/clock';
import type { IdGenerator } from '@/domain/ports/idGenerator';
import type { ShoppingListRepository } from '@/domain/ports/shoppingListRepository';

export type CreateShoppingList = (name: string) => Promise<ShoppingList>;

export function makeCreateShoppingList(
  repository: ShoppingListRepository,
  clock: Clock,
  idGenerator: IdGenerator
): CreateShoppingList {
  return async (name) => {
    const now = clock.now();
    const list: ShoppingList = {
      id: idGenerator.generate(),
      name: normalizeListTitle(name),
      items: [],
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    await repository.save(list);
    return list;
  };
}
