import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Pressable, ScrollView, Text, View } from 'react-native';

import { getListCompletion, type ShoppingList } from '@/domain/entities/shoppingList';
import { CardRow } from '@/presentation/components/CardRow';
import { formatItemCount } from '@/presentation/formatters/shoppingListFormatters';
import { useTheme } from '@/presentation/theme';

import { useShoppingListsSectionStyles } from './ShoppingListsSection.styles';

const HINT_DURATION_MS = 3500;

type Props = {
  lists: ShoppingList[];
  loading: boolean;
  sectionTitle: string;
  sectionInfoMessage?: string;
  emptyMessage: string;
  onArchive?: (list: ShoppingList) => void;
};

export function ShoppingListsSection({
  lists,
  loading,
  sectionTitle,
  sectionInfoMessage,
  emptyMessage,
  onArchive,
}: Props) {
  const styles = useShoppingListsSectionStyles();
  const { colors } = useTheme();
  const [hintVisible, setHintVisible] = useState(false);
  const hintOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!hintVisible) {
      return;
    }

    hintOpacity.setValue(0);
    const fadeIn = Animated.timing(hintOpacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    });
    fadeIn.start();

    const hideTimer = setTimeout(() => {
      Animated.timing(hintOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setHintVisible(false);
        }
      });
    }, HINT_DURATION_MS);

    return () => {
      fadeIn.stop();
      clearTimeout(hideTimer);
    };
  }, [hintOpacity, hintVisible]);

  function showHint() {
    setHintVisible(true);
  }

  function confirmArchive(list: ShoppingList) {
    Alert.alert('Archiver la liste', `Voulez-vous archiver « ${list.name} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Archiver', style: 'destructive', onPress: () => onArchive?.(list) },
    ]);
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>

        {sectionInfoMessage ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Comment archiver une liste"
            hitSlop={8}
            onPress={showHint}
            style={({ pressed }) => [styles.infoButton, pressed && styles.infoButtonPressed]}>
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
          </Pressable>
        ) : null}

        {sectionInfoMessage && hintVisible ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.hintBubble, { opacity: hintOpacity }]}>
            <Text style={styles.hintText}>{sectionInfoMessage}</Text>
          </Animated.View>
        ) : null}
      </View>

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
