import {
  addAisleEntryIfUnknown,
  DEFAULT_AISLE_DICTIONARY_SEED,
  lookupAisle,
  mergeSeedIntoDictionary,
  resolveAisleLearning,
  upsertAisleEntry,
  type AisleDictionary,
  type AisleLearningDecision,
} from '@/domain/entities/aisleDictionary';
import type { ItemAisle } from '@/domain/entities/item';
import type { AisleDictionaryRepository } from '@/domain/ports/aisleDictionaryRepository';

export type SuggestAisle = (name: string) => Promise<ItemAisle | undefined>;

export type LearnAisle = (name: string, aisle: ItemAisle) => Promise<void>;

export type EvaluateAisleLearning = (
  name: string,
  aisle: ItemAisle | undefined
) => Promise<AisleLearningDecision>;

export type OverwriteAisle = (name: string, aisle: ItemAisle) => Promise<void>;

async function readDictionaryWithSeed(
  repository: AisleDictionaryRepository
): Promise<AisleDictionary> {
  const stored = await repository.read();
  if (stored === null) {
    await repository.write(DEFAULT_AISLE_DICTIONARY_SEED);
    return DEFAULT_AISLE_DICTIONARY_SEED;
  }

  const seeded = mergeSeedIntoDictionary(stored, DEFAULT_AISLE_DICTIONARY_SEED);
  if (seeded !== stored) {
    await repository.write(seeded);
  }

  return seeded;
}

export function makeSuggestAisle(repository: AisleDictionaryRepository): SuggestAisle {
  return async (name) => {
    const dictionary = await readDictionaryWithSeed(repository);
    return lookupAisle(dictionary, name);
  };
}

export function makeEvaluateAisleLearning(
  repository: AisleDictionaryRepository
): EvaluateAisleLearning {
  return async (name, aisle) => {
    const dictionary = await readDictionaryWithSeed(repository);
    return resolveAisleLearning(dictionary, name, aisle);
  };
}

export function makeLearnAisle(repository: AisleDictionaryRepository): LearnAisle {
  return async (name, aisle) => {
    const dictionary = await readDictionaryWithSeed(repository);
    const next = addAisleEntryIfUnknown(dictionary, name, aisle);
    if (next !== dictionary) {
      await repository.write(next);
    }
  };
}

export function makeOverwriteAisle(repository: AisleDictionaryRepository): OverwriteAisle {
  return async (name, aisle) => {
    const dictionary = await readDictionaryWithSeed(repository);
    const next = upsertAisleEntry(dictionary, name, aisle);
    if (next !== dictionary) {
      await repository.write(next);
    }
  };
}
