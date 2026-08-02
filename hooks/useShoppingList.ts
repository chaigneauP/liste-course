import { useCallback, useEffect, useRef, useState } from 'react';

import { loadItems, saveItems } from '../lib/storage';
import type { Item } from '../types';

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useShoppingList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;

    loadItems().then((stored) => {
      if (cancelled) {
        return;
      }
      setItems(stored);
      hasLoaded.current = true;
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) {
      return;
    }
    void saveItems(items);
  }, [items]);

  const addItem = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    setItems((current) => [...current, { id: createId(), name: trimmed }]);
  }, []);

  const updateItem = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, name: trimmed } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  return { items, loading, addItem, updateItem, removeItem };
}
