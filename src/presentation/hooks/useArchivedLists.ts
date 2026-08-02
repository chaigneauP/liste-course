import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { useShoppingListUseCases } from '@/presentation/providers/UseCasesProvider';

export function useArchivedLists() {
  const useCases = useShoppingListUseCases();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    setCount(await useCases.count('archived'));
  }, [useCases]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const deleteAll = useCallback(async () => {
    const deletedCount = await useCases.deleteArchived();
    await refresh();
    return deletedCount;
  }, [refresh, useCases]);

  return { count, refresh, deleteAll };
}
