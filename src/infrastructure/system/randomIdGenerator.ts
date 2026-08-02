import type { IdGenerator } from '@/domain/ports/idGenerator';

export const randomIdGenerator: IdGenerator = {
  generate: () => `${Date.now()}-${Math.random().toString(36).slice(2)}`,
};
