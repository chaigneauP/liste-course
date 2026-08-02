import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ItemFormModal } from '../components/ItemFormModal';
import { ItemRow } from '../components/ItemRow';
import { useShoppingList } from '../hooks/useShoppingList';
import type { Item } from '../types';

export default function NewListScreen() {
  const { items, loading, addItem, updateItem, removeItem } = useShoppingList();
  const insets = useSafeAreaInsets();
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  function openCreate() {
    setEditingItem(null);
    setModalVisible(true);
  }

  function openEdit(item: Item) {
    setEditingItem(item);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setEditingItem(null);
  }

  function handleSubmit(name: string) {
    if (editingItem) {
      updateItem(editingItem.id, name);
    } else {
      addItem(name);
    }
    closeModal();
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemRow item={item} onEdit={openEdit} onDelete={removeItem} />
        )}
        contentContainerStyle={[
          styles.listContent,
          items.length === 0 && styles.listContentEmpty,
          { paddingBottom: insets.bottom + 96 },
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aucun article pour l’instant</Text>
            <Text style={styles.emptyText}>
              Appuyez sur le bouton + en bas à droite pour ajouter votre premier article.
            </Text>
          </View>
        }
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ajouter un article"
        onPress={openCreate}
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + 24 },
          pressed && styles.fabPressed,
        ]}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <ItemFormModal
        visible={modalVisible}
        mode={editingItem ? 'edit' : 'create'}
        initialValue={editingItem?.name ?? ''}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    elevation: 6,
    shadowColor: '#0f172a',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabPressed: {
    backgroundColor: '#1d4ed8',
  },
  fabText: {
    color: '#ffffff',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '300',
  },
});
