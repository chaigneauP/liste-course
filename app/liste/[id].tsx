import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ItemFormModal } from '../../components/ItemFormModal';
import { ItemRow } from '../../components/ItemRow';
import { useShoppingList } from '../../hooks/useShoppingList';
import { makeStyles } from '../../theme/makeStyles';
import { useTheme } from '../../theme/ThemeProvider';
import type { Item } from '../../types';

export default function ListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listId = typeof id === 'string' ? id : '';
  const { list, items, loading, addItem, updateItem, removeItem, toggleItemChecked } =
    useShoppingList(listId);
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { colors } = useTheme();
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const readOnly = list?.status === 'archived';

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
        <ActivityIndicator color={colors.btnSecondaryIcon} />
      </View>
    );
  }

  if (!list) {
    return (
      <View style={styles.centered}>
        <Text style={styles.missingTitle}>Liste introuvable</Text>
        <Text style={styles.missingText}>Cette liste n’existe plus ou a été supprimée.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: list.name }} />
      <View style={styles.container}>
        {readOnly ? (
          <View style={styles.readOnlyBanner}>
            <Text style={styles.readOnlyText}>Liste archivée — consultation seule</Text>
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
              onDelete={removeItem}
              onToggleChecked={toggleItemChecked}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            items.length === 0 && styles.listContentEmpty,
            { paddingBottom: insets.bottom + (readOnly ? 24 : 96) },
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
          </>
        ) : null}
      </View>
    </>
  );
}

const useStyles = makeStyles((colors) => ({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  missingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  missingText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  readOnlyBanner: {
    backgroundColor: colors.accentBg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  readOnlyText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.accentIcon,
    textAlign: 'center',
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
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
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
    backgroundColor: colors.btnPrimaryBg,
    elevation: 6,
    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabPressed: {
    backgroundColor: colors.btnPrimaryBgHover,
  },
  fabText: {
    color: colors.btnPrimaryIcon,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '300',
  },
}));
