import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { CardRow } from './CardRow';
import type { Item } from '../types';

type Props = {
  item: Item;
  readOnly?: boolean;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
};

export function ItemRow({ item, readOnly = false, onEdit, onDelete }: Props) {
  function confirmDelete() {
    Alert.alert('Supprimer l’article', `Voulez-vous supprimer « ${item.name} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => onDelete?.(item.id) },
    ]);
  }

  if (readOnly) {
    return <CardRow title={item.name} />;
  }

  return (
    <CardRow
      title={item.name}
      right={
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Modifier ${item.name}`}
            onPress={() => onEdit?.(item)}
            hitSlop={6}
            style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
            <Text style={styles.actionText}>Modifier</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Supprimer ${item.name}`}
            onPress={confirmDelete}
            hitSlop={6}
            style={({ pressed }) => [
              styles.action,
              styles.deleteAction,
              pressed && styles.deleteActionPressed,
            ]}>
            <Text style={[styles.actionText, styles.deleteActionText]}>Supprimer</Text>
          </Pressable>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  actionPressed: {
    backgroundColor: '#dbeafe',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  deleteAction: {
    backgroundColor: '#fef2f2',
  },
  deleteActionPressed: {
    backgroundColor: '#fee2e2',
  },
  deleteActionText: {
    color: '#dc2626',
  },
});
