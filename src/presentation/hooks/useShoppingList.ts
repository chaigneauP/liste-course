import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { createItem, type ItemDetails } from '@/domain/entities/item';
import {
  addItemToList,
  isListEditable,
  removeItemFromList,
  toggleItemInList,
  updateItemInList,
  type ShoppingList,
} from '@/domain/entities/shoppingList';
import { useShoppingListUseCases } from '@/presentation/providers/UseCasesProvider';

function showPersistError() {
  Alert.alert(
    'Enregistrement impossible',
    'La modification n’a pas pu être enregistrée. Réessayez.'
  );
}

function createOptimisticItemId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

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

  /**
   * Applique la mutation domaine tout de suite, puis persiste.
   * En cas d’échec (ou liste absente côté stockage), restaurer l’état précédent.
   */
  const mutateOptimistic = useCallback(
    async (
      applyLocal: (current: ShoppingList) => ShoppingList,
      persist: () => Promise<ShoppingList | null>
    ) => {
      let snapshot: ShoppingList | undefined;

      setList((current) => {
        if (!current) {
          return current;
        }
        const next = applyLocal(current);
        if (next === current) {
          return current;
        }
        snapshot = current;
        return next;
      });

      if (!snapshot) {
        return;
      }

      try {
        const saved = await persist();
        if (saved) {
          setList(saved);
        } else {
          setList(snapshot);
        }
      } catch {
        setList(snapshot);
        showPersistError();
      }
    },
    []
  );

  const addItem = useCallback(
    async (details: ItemDetails) => {
      await mutateOptimistic(
        (current) => addItemToList(current, createItem(createOptimisticItemId(), details)),
        () => useCases.addItem(listId, details)
      );
    },
    [listId, mutateOptimistic, useCases]
  );

  const updateItem = useCallback(
    async (itemId: string, details: ItemDetails) => {
      await mutateOptimistic(
        (current) => updateItemInList(current, itemId, details),
        () => useCases.updateItem(listId, itemId, details)
      );
    },
    [listId, mutateOptimistic, useCases]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      await mutateOptimistic(
        (current) => removeItemFromList(current, itemId),
        () => useCases.removeItem(listId, itemId)
      );
    },
    [listId, mutateOptimistic, useCases]
  );

  const toggleItem = useCallback(
    async (itemId: string) => {
      await mutateOptimistic(
        (current) => toggleItemInList(current, itemId),
        () => useCases.toggleItem(listId, itemId)
      );
    },
    [listId, mutateOptimistic, useCases]
  );

  return {
    list,
    items: list?.items ?? [],
    loading,
    readOnly: list ? !isListEditable(list) : false,
    addItem,
    updateItem,
    removeItem,
    toggleItem,
  };
}
