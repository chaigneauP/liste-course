import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';

import { getListCompletion, type ShoppingList } from '@/domain/entities/shoppingList';
import { CardRow } from '@/presentation/components/CardRow';
import { formatItemCount } from '@/presentation/formatters/shoppingListFormatters';
import { useTheme } from '@/presentation/theme';

import { useShoppingListsSectionStyles } from './ShoppingListsSection.styles';

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
  const styles = useShoppingListsSectionStyles();
  const { colors } = useTheme();

  function confirmArchive(list: ShoppingList) {
    Alert.alert('Archiver la liste', `Voulez-vous archiver « ${list.name} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Archiver', style: 'destructive', onPress: () => onArchive?.(list) },
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
                        icon: <Ionicons name="archive-outline" size={18} color={colors.danger} />,
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
