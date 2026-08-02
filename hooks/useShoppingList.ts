import { useCallback, useEffect, useState } from 'react';

import { createId, getListById, updateList } from '../lib/storage';
import type { ShoppingList } from '../types';

export function useShoppingList(listId: string) {
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getListById(listId).then((stored) => {
      if (cancelled) {
        return;
      }
      setList(stored);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [listId]);

  const addItem = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) {
        return;
      }

      setList((current) => {
        if (!current) {
          return current;
        }

        const nextList = {
          ...current,
          items: [...current.items, { id: createId(), name: trimmed }],
        };
        void updateList(nextList);
        return nextList;
      });
    },
    []
  );

  const updateItem = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) {
        return;
      }

      setList((current) => {
        if (!current) {
          return current;
        }

        const nextList = {
          ...current,
          items: current.items.map((item) =>
            item.id === id ? { ...item, name: trimmed } : item
          ),
        };
        void updateList(nextList);
        return nextList;
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setList((current) => {
      if (!current) {
        return current;
      }

      const nextList = {
        ...current,
        items: current.items.filter((item) => item.id !== id),
      };
      void updateList(nextList);
      return nextList;
    });
  }, []);

  return {
    list,
    items: list?.items ?? [],
    loading,
    addItem,
    updateItem,
    removeItem,
  };
}
