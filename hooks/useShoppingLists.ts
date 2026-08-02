import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { createList, deleteList, loadLists } from '../lib/storage';
import type { ShoppingList } from '../types';

function sortLists(lists: ShoppingList[]): ShoppingList[] {
  return [...lists].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function useShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const stored = await loadLists();
    setLists(sortLists(stored));
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const createNewList = useCallback(async () => {
    const list = await createList();
    await refresh();
    return list;
  }, [refresh]);

  const removeList = useCallback(
    async (id: string) => {
      await deleteList(id);
      await refresh();
    },
    [refresh]
  );

  return { lists, loading, createNewList, removeList, refresh };
}
