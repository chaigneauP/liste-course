import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { formatItemQuantity, type Item } from '@/domain/entities/item';
import { CardRow } from '@/presentation/components/CardRow';
import { useTheme } from '@/presentation/theme';

import { useItemRowStyles } from './ItemRow.styles';

type Props = {
  item: Item;
  readOnly?: boolean;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
  onToggleChecked?: (id: string) => void;
};

export const ItemRow = memo(function ItemRow({
  item,
  readOnly = false,
  onEdit,
  onDelete,
  onToggleChecked,
}: Props) {
  const styles = useItemRowStyles();
  const { colors } = useTheme();

  const confirmDelete = useCallback(() => {
    Alert.alert('Supprimer l’article', `Voulez-vous supprimer « ${item.name} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => onDelete?.(item.id) },
    ]);
  }, [item.id, item.name, onDelete]);

  const handleToggle = useCallback(() => {
    onToggleChecked?.(item.id);
  }, [item.id, onToggleChecked]);

  const handleEdit = useCallback(() => {
    onEdit?.(item);
  }, [item, onEdit]);

  if (readOnly) {
    return (
      <CardRow title={item.name} subtitle={formatItemQuantity(item)} checked={item.checked} />
    );
  }

  const checked = item.checked ?? false;
  const quantityLabel = formatItemQuantity(item);

  return (
    <CardRow
      title={item.name}
      subtitle={quantityLabel}
      checked={checked}
      accessibilityLabel={
        checked ? `Marquer ${item.name} comme non acheté` : `Marquer ${item.name} comme acheté`
      }
      onPress={handleToggle}
      right={
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Modifier ${item.name}`}
            accessibilityState={{ disabled: checked }}
            disabled={checked}
            onPress={handleEdit}
            hitSlop={6}
            style={({ pressed }) => [
              styles.action,
              checked ? styles.actionDisabled : styles.actionDefault,
              pressed && !checked && styles.actionDefaultPressed,
            ]}>
            <Ionicons
              name="pencil"
              size={16}
              color={checked ? colors.textSecondary : colors.icon}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Supprimer ${item.name}`}
            accessibilityState={{ disabled: checked }}
            disabled={checked}
            onPress={confirmDelete}
            hitSlop={6}
            style={({ pressed }) => [
              styles.action,
              checked ? styles.actionDisabled : styles.deleteActionDefault,
              pressed && !checked && styles.deleteActionDefaultPressed,
            ]}>
            <Ionicons
              name="trash-outline"
              size={16}
              color={checked ? colors.textSecondary : colors.danger}
            />
          </Pressable>
        </View>
      }
    />
  );
});
