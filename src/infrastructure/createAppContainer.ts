import { createAppUseCases, type AppUseCases } from '@/application/appUseCases';

import { createAsyncStorageShoppingListRepository } from './storage/asyncStorageShoppingListRepository';
import { createAsyncStorageThemePreferenceRepository } from './storage/asyncStorageThemePreferenceRepository';
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
    clock: systemClock,
    idGenerator: randomIdGenerator,
  });
}
