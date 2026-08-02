import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, View } from 'react-native';

import { CardRow } from './CardRow';
import { makeStyles } from '../theme/makeStyles';
import { useTheme } from '../theme/ThemeProvider';
import type { Item } from '../types';

type Props = {
  item: Item;
  readOnly?: boolean;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
  onToggleChecked?: (id: string) => void;
};

export function ItemRow({ item, readOnly = false, onEdit, onDelete, onToggleChecked }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

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
            accessibilityState={{ disabled: checked }}
            disabled={checked}
            onPress={() => onEdit?.(item)}
            hitSlop={6}
            style={({ pressed }) => [
              styles.action,
              checked ? styles.actionDisabled : styles.actionDefault,
              pressed && !checked && styles.actionDefaultPressed,
            ]}>
            <Ionicons
              name="pencil"
              size={18}
              color={checked ? colors.textSecondary : colors.btnSecondaryIcon}
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
              size={18}
              color={checked ? colors.textSecondary : colors.danger}
            />
          </Pressable>
        </View>
      }
    />
  );
}
const useStyles = makeStyles((colors) => ({
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
    backgroundColor: colors.btnSecondaryBgHover,
  },
  actionDefaultPressed: {
    backgroundColor: colors.border,
  },
  actionDisabled: {
    backgroundColor: colors.btnSecondaryBgHover,
    opacity: 0.7,
  },
  deleteActionDefault: {
    backgroundColor: colors.dangerSurface,
  },
  deleteActionDefaultPressed: {
    backgroundColor: colors.dangerSurfacePressed,
  },
}));
