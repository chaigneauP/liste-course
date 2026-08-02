import type { Clock } from '@/domain/ports/clock';
import type { IdGenerator } from '@/domain/ports/idGenerator';
import type { ShoppingListRepository } from '@/domain/ports/shoppingListRepository';
import type { ThemePreferenceRepository } from '@/domain/ports/themePreferenceRepository';

import {
  makeArchiveShoppingList,
  type ArchiveShoppingList,
} from './useCases/shoppingLists/archiveShoppingList';
import {
  makeCreateShoppingList,
  type CreateShoppingList,
} from './useCases/shoppingLists/createShoppingList';
import {
  makeDeleteArchivedShoppingLists,
  type DeleteArchivedShoppingLists,
} from './useCases/shoppingLists/deleteArchivedShoppingLists';
import {
  makeAddShoppingListItem,
  makeRemoveShoppingListItem,
  makeRenameShoppingListItem,
  makeToggleShoppingListItem,
  type AddShoppingListItem,
  type RemoveShoppingListItem,
  type RenameShoppingListItem,
  type ToggleShoppingListItem,
} from './useCases/shoppingLists/manageShoppingListItems';
import { makeMutateShoppingList } from './useCases/shoppingLists/mutateShoppingList';
import {
  makeCountShoppingLists,
  makeGetShoppingList,
  makeListShoppingLists,
  type CountShoppingLists,
  type GetShoppingList,
  type ListShoppingLists,
} from './useCases/shoppingLists/queryShoppingLists';
import {
  makeGetThemePreference,
  makeSaveThemePreference,
  type GetThemePreference,
  type SaveThemePreference,
} from './useCases/theme/themePreference';

export type AppDependencies = {
  shoppingListRepository: ShoppingListRepository;
  themePreferenceRepository: ThemePreferenceRepository;
  clock: Clock;
  idGenerator: IdGenerator;
};

export type ShoppingListUseCases = {
  list: ListShoppingLists;
  count: CountShoppingLists;
  getById: GetShoppingList;
  create: CreateShoppingList;
  archive: ArchiveShoppingList;
  deleteArchived: DeleteArchivedShoppingLists;
  addItem: AddShoppingListItem;
  renameItem: RenameShoppingListItem;
  removeItem: RemoveShoppingListItem;
  toggleItem: ToggleShoppingListItem;
};

export type ThemeUseCases = {
  getPreference: GetThemePreference;
  savePreference: SaveThemePreference;
};

export type AppUseCases = {
  shoppingLists: ShoppingListUseCases;
  theme: ThemeUseCases;
};

/**
 * Assemble les cas d'usage à partir des seules abstractions du domaine. C'est
 * l'infrastructure qui décide des implémentations concrètes injectées ici.
 */
export function createAppUseCases({
  shoppingListRepository,
  themePreferenceRepository,
  clock,
  idGenerator,
}: AppDependencies): AppUseCases {
  const mutate = makeMutateShoppingList(shoppingListRepository, clock);

  return {
    shoppingLists: {
      list: makeListShoppingLists(shoppingListRepository),
      count: makeCountShoppingLists(shoppingListRepository),
      getById: makeGetShoppingList(shoppingListRepository),
      create: makeCreateShoppingList(shoppingListRepository, clock, idGenerator),
      archive: makeArchiveShoppingList(mutate),
      deleteArchived: makeDeleteArchivedShoppingLists(shoppingListRepository),
      addItem: makeAddShoppingListItem(mutate, idGenerator),
      renameItem: makeRenameShoppingListItem(mutate),
      removeItem: makeRemoveShoppingListItem(mutate),
      toggleItem: makeToggleShoppingListItem(mutate),
    },
    theme: {
      getPreference: makeGetThemePreference(themePreferenceRepository),
      savePreference: makeSaveThemePreference(themePreferenceRepository),
    },
  };
}
