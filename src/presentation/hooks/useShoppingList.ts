import { useCallback, useEffect, useState } from 'react';

import { isListEditable, type ShoppingList } from '@/domain/entities/shoppingList';
import { useShoppingListUseCases } from '@/presentation/providers/UseCasesProvider';

export function useShoppingList(listId: string) {
  const useCases = useShoppingListUseCases();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    useCases.getById(listId).then((stored) => {
      if (cancelled) {
        return;
      }
      setList(stored);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [listId, useCases]);

  // Un cas d'usage renvoie null quand la liste a disparu du stockage.
  const apply = useCallback((updated: ShoppingList | null) => {
    if (updated) {
      setList(updated);
    }
  }, []);

  const addItem = useCallback(
    async (name: string) => {
      apply(await useCases.addItem(listId, name));
    },
    [apply, listId, useCases]
  );

  const renameItem = useCallback(
    async (itemId: string, name: string) => {
      apply(await useCases.renameItem(listId, itemId, name));
    },
    [apply, listId, useCases]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      apply(await useCases.removeItem(listId, itemId));
    },
    [apply, listId, useCases]
  );

  const toggleItem = useCallback(
    async (itemId: string) => {
      apply(await useCases.toggleItem(listId, itemId));
    },
    [apply, listId, useCases]
  );

  return {
    list,
    items: list?.items ?? [],
    loading,
    readOnly: list ? !isListEditable(list) : false,
    addItem,
    renameItem,
    removeItem,
    toggleItem,
  };
}
