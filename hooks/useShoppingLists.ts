import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { archiveList, createList, loadLists } from '../lib/storage';
import type { ListStatus, ShoppingList } from '../types';

function sortLists(lists: ShoppingList[]): ShoppingList[] {
  return [...lists].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function useShoppingLists(status: ListStatus) {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const stored = await loadLists();
    setLists(sortLists(stored.filter((list) => list.status === status)));
    setLoading(false);
  }, [status]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const createNewList = useCallback(
    async (name: string) => {
      const list = await createList(name);
      await refresh();
      return list;
    },
    [refresh]
  );

  const archiveExistingList = useCallback(
    async (id: string) => {
      await archiveList(id);
      await refresh();
    },
    [refresh]
  );

  return { lists, loading, createNewList, archiveExistingList, refresh };
}
