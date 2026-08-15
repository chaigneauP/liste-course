import type { AisleDictionary } from '../entities/aisleDictionary';

export interface AisleDictionaryRepository {
  read(): Promise<AisleDictionary | null>;
  write(dictionary: AisleDictionary): Promise<void>;
}
