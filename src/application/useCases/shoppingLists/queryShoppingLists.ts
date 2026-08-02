import {
  filterListsByStatus,
  sortListsByRecentUpdate,
  type ListStatus,
  type ShoppingList,
} from '@/domain/entities/shoppingList';
import type { ShoppingListRepository } from '@/domain/ports/shoppingListRepository';

export type ListShoppingLists = (status: ListStatus) => Promise<ShoppingList[]>;

export type GetShoppingList = (id: string) => Promise<ShoppingList | null>;

export type CountShoppingLists = (status: ListStatus) => Promise<number>;

export function makeListShoppingLists(
  repository: ShoppingListRepository
): ListShoppingLists {
  return async (status) => {
    const lists = await repository.findAll();
    return sortListsByRecentUpdate(filterListsByStatus(lists, status));
  };
}

export function makeGetShoppingList(repository: ShoppingListRepository): GetShoppingList {
  return (id) => repository.findById(id);
}

export function makeCountShoppingLists(
  repository: ShoppingListRepository
): CountShoppingLists {
  return async (status) => {
    const lists = await repository.findAll();
    return filterListsByStatus(lists, status).length;
  };
}
