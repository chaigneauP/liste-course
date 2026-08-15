import { createAppUseCases, type AppUseCases } from '@/application/appUseCases';

import { createAsyncStorageAisleDictionaryRepository } from './storage/asyncStorageAisleDictionaryRepository';
import { createAsyncStorageShoppingListRepository } from './storage/asyncStorageShoppingListRepository';
import { createAsyncStorageThemePreferenceRepository } from './storage/asyncStorageThemePreferenceRepository';
import { createExpoListTransferGateway } from './system/expoListTransferGateway';
import { randomIdGenerator } from './system/randomIdGenerator';
import { systemClock } from './system/systemClock';

/**
 * Racine de composition : le seul endroit où les implémentations concrètes
 * rencontrent les cas d'usage.
 */
export function createAppContainer(): AppUseCases {
  return createAppUseCases({
    shoppingListRepository: createAsyncStorageShoppingListRepository(
      systemClock,
      randomIdGenerator
    ),
    themePreferenceRepository: createAsyncStorageThemePreferenceRepository(),
    aisleDictionaryRepository: createAsyncStorageAisleDictionaryRepository(),
    listTransferGateway: createExpoListTransferGateway(),
    clock: systemClock,
    idGenerator: randomIdGenerator,
  });
}
