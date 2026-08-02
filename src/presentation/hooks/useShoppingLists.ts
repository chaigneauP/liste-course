import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { ListStatus, ShoppingList } from '@/domain/entities/shoppingList';
import { useShoppingListUseCases } from '@/presentation/providers/UseCasesProvider';

export function useShoppingLists(status: ListStatus) {
  const useCases = useShoppingListUseCases();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLists(await useCases.list(status));
    setLoading(false);
  }, [status, useCases]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const createList = useCallback(
    async (name: string) => {
      const list = await useCases.create(name);
      await refresh();
      return list;
    },
    [refresh, useCases]
  );

  const archiveList = useCallback(
    async (id: string) => {
      await useCases.archive(id);
      await refresh();
    },
    [refresh, useCases]
  );

  return { lists, loading, refresh, createList, archiveList };
}
