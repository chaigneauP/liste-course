import { parseListTitle } from '@/domain/entities/listTitle';
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
    const parsedName = parseListTitle(name);
    if (parsedName === null) {
      throw new Error('List title must not be empty');
    }

    const now = clock.now();
    const list: ShoppingList = {
      id: idGenerator.generate(),
      name: parsedName,
      items: [],
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    await repository.save(list);
    return list;
  };
}
