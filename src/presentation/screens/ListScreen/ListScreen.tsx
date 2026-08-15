import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SectionList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { groupItemsByAisle, formatItemQuantity, type Item, type ItemDetails } from '@/domain/entities/item';
import { ItemFormModal, type ItemFormSubmitOptions } from '@/presentation/components/ItemFormModal';
import { ItemRow } from '@/presentation/components/ItemRow';
import { MergeItemConfirmModal } from '@/presentation/components/MergeItemConfirmModal';
import { ScreenTop } from '@/presentation/components/ScreenTop';
import { useShoppingList } from '@/presentation/hooks/useShoppingList';
import { useAisleDictionaryUseCases, useShoppingListUseCases } from '@/presentation/providers/UseCasesProvider';
import { useTheme } from '@/presentation/theme';

import {
  FAB_BOTTOM_INSET,
  LIST_CONTENT_BOTTOM_INSET,
  useListScreenStyles,
} from './ListScreen.styles';

export function ListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listId = typeof id === 'string' ? id : '';
  const { list, items, loading, readOnly, addItem, mergeItem, getMergeCandidate, updateItem, removeItem, toggleItem } =
    useShoppingList(listId);
  const shoppingLists = useShoppingListUseCases();
  const aisleDictionary = useAisleDictionaryUseCases();
  const insets = useSafeAreaInsets();
  const styles = useListScreenStyles();
  const { colors } = useTheme();
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [mergePrompt, setMergePrompt] = useState<{
    candidate: Item;
    details: ItemDetails;
    overwriteAisle: boolean;
  } | null>(null);

  async function handleSharePress() {
    if (!list || sharing) {
      return;
    }

    setSharing(true);
    try {
      await shoppingLists.exportList(list.id);
    } catch {
      Alert.alert(
        'Partage impossible',
        'La liste n’a pas pu être partagée. Réessayez.'
      );
    } finally {
      setSharing(false);
    }
  }

  const openCreate = useCallback(() => {
    setEditingItem(null);
    setModalVisible(true);
  }, []);

  const openEdit = useCallback((item: Item) => {
    setEditingItem(item);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingItem(null);
  }, []);

  const persistAisleLearning = useCallback(
    (details: ItemDetails, options: ItemFormSubmitOptions) => {
      if (details.aisle === undefined) {
        return;
      }
      if (options.overwriteAisle) {
        void aisleDictionary.overwriteAisle(details.name, details.aisle);
      } else {
        void aisleDictionary.learnAisle(details.name, details.aisle);
      }
    },
    [aisleDictionary]
  );

  const suggestAisle = useCallback(
    (name: string) => aisleDictionary.suggestAisle(name),
    [aisleDictionary]
  );

  const evaluateAisleLearning = useCallback(
    (name: string, aisle: ItemDetails['aisle']) =>
      aisleDictionary.evaluateAisleLearning(name, aisle),
    [aisleDictionary]
  );

  const handleSubmit = useCallback(
    (details: ItemDetails, options: ItemFormSubmitOptions) => {
      if (editingItem) {
        void updateItem(editingItem.id, details);
        persistAisleLearning(details, options);
        closeModal();
        return;
      }

      const candidate = getMergeCandidate(details);
      if (candidate) {
        closeModal();
        setMergePrompt({ candidate, details, overwriteAisle: options.overwriteAisle });
        return;
      }

      void addItem(details);
      persistAisleLearning(details, options);
      closeModal();
    },
    [addItem, closeModal, editingItem, getMergeCandidate, persistAisleLearning, updateItem]
  );

  const closeMergePrompt = useCallback(() => {
    setMergePrompt(null);
  }, []);

  const handleMergeConfirm = useCallback(() => {
    if (!mergePrompt) {
      return;
    }
    void mergeItem(mergePrompt.candidate.id, mergePrompt.details);
    persistAisleLearning(mergePrompt.details, {
      overwriteAisle: mergePrompt.overwriteAisle,
    });
    setMergePrompt(null);
  }, [mergeItem, mergePrompt, persistAisleLearning]);

  const handleMergeDecline = useCallback(() => {
    if (!mergePrompt) {
      return;
    }
    void addItem(mergePrompt.details);
    persistAisleLearning(mergePrompt.details, {
      overwriteAisle: mergePrompt.overwriteAisle,
    });
    setMergePrompt(null);
  }, [addItem, mergePrompt, persistAisleLearning]);

  const handleDelete = useCallback(
    (itemId: string) => {
      void removeItem(itemId);
    },
    [removeItem]
  );

  const handleToggle = useCallback(
    (itemId: string) => {
      void toggleItem(itemId);
    },
    [toggleItem]
  );

  const renderItem = useCallback(
    ({ item }: { item: Item }) => (
      <ItemRow
        item={item}
        readOnly={readOnly}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggleChecked={handleToggle}
      />
    ),
    [handleDelete, handleToggle, openEdit, readOnly]
  );

  const keyExtractor = useCallback((item: Item) => item.id, []);

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <View style={styles.aisleSectionHeader}>
        <Text style={styles.aisleSectionTitle}>{section.title}</Text>
      </View>
    ),
    [styles.aisleSectionHeader, styles.aisleSectionTitle]
  );

  const sections = groupItemsByAisle(items).map((section) => ({
    title: section.title,
    data: section.items,
  }));

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.icon} />
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
      <ScreenTop
        title={list.name}
        showBack
        rightAction={{
          icon: 'share-social-outline',
          accessibilityLabel: 'Partager la liste',
          onPress: () => void handleSharePress(),
        }}
      />

      {readOnly ? (
        <View style={styles.readOnlyBannerWrap}>
          <View style={styles.readOnlyBanner}>
            <Text style={styles.readOnlyText}>Liste archivée — consultation seule</Text>
          </View>
        </View>
      ) : null}

      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
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
            initialDetails={
              editingItem
                ? {
                    name: editingItem.name,
                    quantity: editingItem.quantity,
                    unit: editingItem.unit,
                    note: editingItem.note,
                    aisle: editingItem.aisle,
                  }
                : { name: '' }
            }
            onCancel={closeModal}
            onSubmit={handleSubmit}
            onSuggestAisle={suggestAisle}
            onEvaluateAisleLearning={evaluateAisleLearning}
          />

          <MergeItemConfirmModal
            visible={mergePrompt !== null}
            itemName={mergePrompt?.candidate.name ?? ''}
            itemQuantityLabel={
              mergePrompt ? formatItemQuantity(mergePrompt.candidate) : undefined
            }
            onCancel={closeMergePrompt}
            onMerge={handleMergeConfirm}
            onDeclineMerge={handleMergeDecline}
          />
        </>
      ) : null}
    </View>
  );
}
