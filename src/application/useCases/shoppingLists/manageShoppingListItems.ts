import { createItem, type ItemDetails } from '@/domain/entities/item';
import {
  addItemToList,
  mergeItemIntoList,
  removeItemFromList,
  toggleItemInList,
  updateItemInList,
  type ShoppingList,
} from '@/domain/entities/shoppingList';
import type { IdGenerator } from '@/domain/ports/idGenerator';

import type { MutateShoppingList } from './mutateShoppingList';

export type AddShoppingListItem = (
  listId: string,
  details: ItemDetails
) => Promise<ShoppingList | null>;

export type UpdateShoppingListItem = (
  listId: string,
  itemId: string,
  details: ItemDetails
) => Promise<ShoppingList | null>;

export type RemoveShoppingListItem = (
  listId: string,
  itemId: string
) => Promise<ShoppingList | null>;

export type ToggleShoppingListItem = (
  listId: string,
  itemId: string
) => Promise<ShoppingList | null>;

export type MergeShoppingListItem = (
  listId: string,
  existingItemId: string,
  details: ItemDetails
) => Promise<ShoppingList | null>;

export function makeAddShoppingListItem(
  mutate: MutateShoppingList,
  idGenerator: IdGenerator
): AddShoppingListItem {
  return (listId, details) =>
    mutate(listId, (list) => addItemToList(list, createItem(idGenerator.generate(), details)));
}

export function makeUpdateShoppingListItem(mutate: MutateShoppingList): UpdateShoppingListItem {
  return (listId, itemId, details) =>
    mutate(listId, (list) => updateItemInList(list, itemId, details));
}

export function makeRemoveShoppingListItem(mutate: MutateShoppingList): RemoveShoppingListItem {
  return (listId, itemId) => mutate(listId, (list) => removeItemFromList(list, itemId));
}

export function makeToggleShoppingListItem(mutate: MutateShoppingList): ToggleShoppingListItem {
  return (listId, itemId) => mutate(listId, (list) => toggleItemInList(list, itemId));
}

export function makeMergeShoppingListItem(mutate: MutateShoppingList): MergeShoppingListItem {
  return (listId, existingItemId, details) =>
    mutate(listId, (list) => mergeItemIntoList(list, existingItemId, details));
}
