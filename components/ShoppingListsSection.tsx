import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CardRow } from './CardRow';
import type { ShoppingList } from '../types';

type Props = {
  lists: ShoppingList[];
  loading: boolean;
  sectionTitle: string;
  emptyMessage: string;
  onArchive?: (list: ShoppingList) => void;
};

export function ShoppingListsSection({
  lists,
  loading,
  sectionTitle,
  emptyMessage,
  onArchive,
}: Props) {
  function confirmArchive(list: ShoppingList) {
    Alert.alert('Archiver la liste', `Voulez-vous archiver « ${list.name} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Archiver',
        style: 'destructive',
        onPress: () => onArchive?.(list),
      },
    ]);
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>

      {loading ? (
        <ActivityIndicator color="#2563eb" style={styles.loader} />
      ) : lists.length === 0 ? (
        <Text style={styles.empty}>{emptyMessage}</Text>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.lists}
          showsVerticalScrollIndicator>
          {lists.map((list) => (
            <View key={list.id} style={styles.listRow}>
              <CardRow
                title={list.name}
                onPress={() =>
                  router.push({ pathname: '/liste/[id]', params: { id: list.id } })
                }
                right={
                  onArchive ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Archiver ${list.name}`}
                      onPress={() => confirmArchive(list)}
                      hitSlop={6}
                      style={({ pressed }) => [
                        styles.archiveButton,
                        pressed && styles.archiveButtonPressed,
                      ]}>
                      <Ionicons name="archive-outline" size={20} color="#dc2626" />
                    </Pressable>
                  ) : undefined
                }
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    gap: 12,
    minHeight: 0,
  },
  scroll: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  loader: {
    marginTop: 8,
  },
  empty: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  lists: {
    gap: 10,
  },
  listRow: {
    alignSelf: 'stretch',
  },
  archiveButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  archiveButtonPressed: {
    backgroundColor: '#fee2e2',
  },
});
