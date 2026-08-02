import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Item } from '@/domain/entities/item';
import { ItemFormModal } from '@/presentation/components/ItemFormModal';
import { ItemRow } from '@/presentation/components/ItemRow';
import { ScreenTop } from '@/presentation/components/ScreenTop';
import { useShoppingList } from '@/presentation/hooks/useShoppingList';
import { useTheme } from '@/presentation/theme';

import {
  FAB_BOTTOM_INSET,
  LIST_CONTENT_BOTTOM_INSET,
  useListScreenStyles,
} from './ListScreen.styles';

export function ListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listId = typeof id === 'string' ? id : '';
  const { list, items, loading, readOnly, addItem, renameItem, removeItem, toggleItem } =
    useShoppingList(listId);
  const insets = useSafeAreaInsets();
  const styles = useListScreenStyles();
  const { colors } = useTheme();
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
      void renameItem(editingItem.id, name);
    } else {
      void addItem(name);
    }
    closeModal();
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.btnSecondaryIcon} />
      </View>
    );
  }

  if (!list) {
    return (
      <View style={styles.container}>
        <ScreenTop title="Liste introuvable" showBack />
        <View style={styles.centered}>
          <Text style={styles.missingText}>Cette liste n’existe plus ou a été supprimée.</Text>
        </View>
      </View>
    );
  }

  const bottomInset =
    insets.bottom +
    (readOnly ? LIST_CONTENT_BOTTOM_INSET.readOnly : LIST_CONTENT_BOTTOM_INSET.withFab);

  return (
    <View style={styles.container}>
      <ScreenTop title={list.name} showBack />

      {readOnly ? (
        <View style={styles.readOnlyBannerWrap}>
          <View style={styles.readOnlyBanner}>
            <Text style={styles.readOnlyText}>Liste archivée — consultation seule</Text>
          </View>
        </View>
      ) : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemRow
            item={item}
            readOnly={readOnly}
            onEdit={openEdit}
            onDelete={(itemId) => void removeItem(itemId)}
            onToggleChecked={(itemId) => void toggleItem(itemId)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          items.length === 0 && styles.listContentEmpty,
          { paddingBottom: bottomInset },
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aucun article pour l’instant</Text>
            <Text style={styles.emptyText}>
              {readOnly
                ? 'Cette liste archivée ne contient aucun article.'
                : 'Appuyez sur le bouton + en bas à droite pour ajouter votre premier article.'}
            </Text>
          </View>
        }
      />

      {!readOnly ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajouter un article"
            onPress={openCreate}
            style={({ pressed }) => [
              styles.fab,
              { bottom: insets.bottom + FAB_BOTTOM_INSET },
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
        </>
      ) : null}
    </View>
  );
}
