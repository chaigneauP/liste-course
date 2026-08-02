import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { CardRow } from './CardRow';
import type { Item } from '../types';

type Props = {
  item: Item;
  readOnly?: boolean;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
  onToggleChecked?: (id: string) => void;
};

export function ItemRow({ item, readOnly = false, onEdit, onDelete, onToggleChecked }: Props) {
  function confirmDelete() {
    Alert.alert('Supprimer l’article', `Voulez-vous supprimer « ${item.name} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => onDelete?.(item.id) },
    ]);
  }

  if (readOnly) {
    return <CardRow title={item.name} checked={item.checked} />;
  }

  const checked = item.checked ?? false;

  return (
    <CardRow
      title={item.name}
      checked={checked}
      accessibilityLabel={
        checked ? `Marquer ${item.name} comme non acheté` : `Marquer ${item.name} comme acheté`
      }
      onPress={() => onToggleChecked?.(item.id)}
      right={
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Modifier ${item.name}`}
            onPress={() => onEdit?.(item)}
            hitSlop={6}
            style={({ pressed }) => [
              styles.action,
              checked ? styles.actionChecked : styles.actionDefault,
              pressed && (checked ? styles.actionCheckedPressed : styles.actionDefaultPressed),
            ]}>
            <Ionicons name="pencil" size={18} color={checked ? '#059669' : '#2563eb'} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Supprimer ${item.name}`}
            onPress={confirmDelete}
            hitSlop={6}
            style={({ pressed }) => [
              styles.action,
              checked ? styles.deleteActionChecked : styles.deleteActionDefault,
              pressed &&
                (checked ? styles.deleteActionCheckedPressed : styles.deleteActionDefaultPressed),
            ]}>
            <Ionicons name="trash-outline" size={18} color={checked ? '#047857' : '#dc2626'} />
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
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDefault: {
    backgroundColor: '#eff6ff',
  },
  actionDefaultPressed: {
    backgroundColor: '#dbeafe',
  },
  actionChecked: {
    backgroundColor: '#d1fae5',
  },
  actionCheckedPressed: {
    backgroundColor: '#a7f3d0',
  },
  deleteActionDefault: {
    backgroundColor: '#fef2f2',
  },
  deleteActionDefaultPressed: {
    backgroundColor: '#fee2e2',
  },
  deleteActionChecked: {
    backgroundColor: '#bbf7d0',
  },
  deleteActionCheckedPressed: {
    backgroundColor: '#86efac',
  },
});
