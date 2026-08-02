import { markListAsArchived, type ShoppingList } from '@/domain/entities/shoppingList';

import type { MutateShoppingList } from './mutateShoppingList';

export type ArchiveShoppingList = (listId: string) => Promise<ShoppingList | null>;

export function makeArchiveShoppingList(mutate: MutateShoppingList): ArchiveShoppingList {
  return (listId) => mutate(listId, markListAsArchived);
}
