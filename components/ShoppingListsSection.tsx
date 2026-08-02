import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';

import { CardRow } from './CardRow';
import { makeStyles } from '../theme/makeStyles';
import { useTheme } from '../theme/ThemeProvider';
import type { ShoppingList } from '../types';

function formatItemCount(count: number): string {
  if (count === 0) {
    return 'Aucun article';
  }
  if (count === 1) {
    return '1 article';
  }
  return `${count} articles`;
}

function getListCompletion(list: ShoppingList): 'complete' | 'in-progress' | undefined {
  if (list.items.length === 0) {
    return undefined;
  }

  return list.items.every((item) => item.checked) ? 'complete' : 'in-progress';
}

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
  const styles = useStyles();
  const { colors } = useTheme();

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
        <ActivityIndicator color={colors.btnSecondaryIcon} style={styles.loader} />
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
                subtitle={formatItemCount(list.items.length)}
                listCompletion={getListCompletion(list)}
                onPress={() =>
                  router.push({ pathname: '/liste/[id]', params: { id: list.id } })
                }
                longPressAction={
                  onArchive
                    ? {
                        label: 'Archiver la liste',
                        icon: (
                          <Ionicons name="archive-outline" size={18} color={colors.danger} />
                        ),
                        accessibilityLabel: `Archiver ${list.name}`,
                        onPress: () => confirmArchive(list),
                      }
                    : undefined
                }
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
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
    color: colors.textPrimary,
  },
  loader: {
    marginTop: 8,
  },
  empty: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  lists: {
    gap: 10,
  },
  listRow: {
    alignSelf: 'stretch',
  },
}));
