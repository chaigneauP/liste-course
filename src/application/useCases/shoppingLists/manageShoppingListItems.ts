import { createItem } from '@/domain/entities/item';
import {
  addItemToList,
  removeItemFromList,
  renameItemInList,
  toggleItemInList,
  type ShoppingList,
} from '@/domain/entities/shoppingList';
import type { IdGenerator } from '@/domain/ports/idGenerator';

import type { MutateShoppingList } from './mutateShoppingList';

export type AddShoppingListItem = (
  listId: string,
  name: string
) => Promise<ShoppingList | null>;

export type RenameShoppingListItem = (
  listId: string,
  itemId: string,
  name: string
) => Promise<ShoppingList | null>;

export type RemoveShoppingListItem = (
  listId: string,
  itemId: string
) => Promise<ShoppingList | null>;

export type ToggleShoppingListItem = (
  listId: string,
  itemId: string
) => Promise<ShoppingList | null>;

export function makeAddShoppingListItem(
  mutate: MutateShoppingList,
  idGenerator: IdGenerator
): AddShoppingListItem {
  return (listId, name) =>
    mutate(listId, (list) => addItemToList(list, createItem(idGenerator.generate(), name)));
}

export function makeRenameShoppingListItem(
  mutate: MutateShoppingList
): RenameShoppingListItem {
  return (listId, itemId, name) =>
    mutate(listId, (list) => renameItemInList(list, itemId, name));
}

export function makeRemoveShoppingListItem(
  mutate: MutateShoppingList
): RemoveShoppingListItem {
  return (listId, itemId) => mutate(listId, (list) => removeItemFromList(list, itemId));
}

export function makeToggleShoppingListItem(
  mutate: MutateShoppingList
): ToggleShoppingListItem {
  return (listId, itemId) => mutate(listId, (list) => toggleItemInList(list, itemId));
}
