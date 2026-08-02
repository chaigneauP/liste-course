import type { ShoppingList } from '../entities/shoppingList';

/**
 * Port de persistance des listes. Le domaine ignore totalement la technologie
 * de stockage : seule l'infrastructure fournit une implémentation.
 */
export interface ShoppingListRepository {
  findAll(): Promise<ShoppingList[]>;
  findById(id: string): Promise<ShoppingList | null>;
  /** Insère la liste si elle n'existe pas encore, la remplace sinon. */
  save(list: ShoppingList): Promise<void>;
  replaceAll(lists: ShoppingList[]): Promise<void>;
}
