import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { getListCompletion, type ShoppingList } from '@/domain/entities/shoppingList';
import { CardRow } from '@/presentation/components/CardRow';
import { ContextMenu, type ContextMenuAnchor } from '@/presentation/components/ContextMenu';
import { ScrollEdgeFade } from '@/presentation/components/ScrollEdgeFade';
import { formatItemCount } from '@/presentation/formatters/shoppingListFormatters';
import { useTheme } from '@/presentation/theme';

import { useShoppingListsSectionStyles } from './ShoppingListsSection.styles';

const HINT_DURATION_MS = 3500;
/** Marge (px) sous laquelle on considère qu’il reste du contenu à scroller. */
const SCROLL_MORE_THRESHOLD_PX = 8;

type Props = {
  lists: ShoppingList[];
  loading: boolean;
  sectionTitle: string;
  sectionInfoMessage?: string;
  emptyMessage: string;
  onArchive?: (list: ShoppingList) => void;
};

type ListRowProps = {
  list: ShoppingList;
  onOpen: (list: ShoppingList) => void;
  onLongPress?: (list: ShoppingList, anchor: ContextMenuAnchor) => void;
};

const ShoppingListRow = memo(function ShoppingListRow({ list, onOpen, onLongPress }: ListRowProps) {
  const styles = useShoppingListsSectionStyles();

  const handlePress = useCallback(() => {
    onOpen(list);
  }, [list, onOpen]);

  const handleLongPress = useCallback(
    (anchor: ContextMenuAnchor) => {
      onLongPress?.(list, anchor);
    },
    [list, onLongPress]
  );

  return (
    <View style={styles.listRow}>
      <CardRow
        title={list.name}
        subtitle={formatItemCount(list.items.length)}
        listCompletion={getListCompletion(list)}
        onPress={handlePress}
        onLongPress={onLongPress ? handleLongPress : undefined}
      />
    </View>
  );
});

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
  const [menuTarget, setMenuTarget] = useState<{
    list: ShoppingList;
    anchor: ContextMenuAnchor;
  } | null>(null);
  const [canScrollMore, setCanScrollMore] = useState(false);
  const contentHeightRef = useRef(0);
  const layoutHeightRef = useRef(0);
  const scrollOffsetRef = useRef(0);

  const archiveIcon = useMemo(
    () => <Ionicons name="archive-outline" size={18} color={colors.danger} />,
    [colors.danger]
  );

  const updateCanScrollMore = useCallback(() => {
    const remaining = contentHeightRef.current - layoutHeightRef.current - scrollOffsetRef.current;
    setCanScrollMore(remaining > SCROLL_MORE_THRESHOLD_PX);
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
      updateCanScrollMore();
    },
    [updateCanScrollMore]
  );

  const handleContentSizeChange = useCallback(
    (_width: number, height: number) => {
      contentHeightRef.current = height;
      updateCanScrollMore();
    },
    [updateCanScrollMore]
  );

  const handleScrollLayout = useCallback(
    (event: LayoutChangeEvent) => {
      layoutHeightRef.current = event.nativeEvent.layout.height;
      updateCanScrollMore();
    },
    [updateCanScrollMore]
  );

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
    let fadeOut: Animated.CompositeAnimation | undefined;
    fadeIn.start();

    const hideTimer = setTimeout(() => {
      fadeOut = Animated.timing(hintOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      });
      fadeOut.start(({ finished }) => {
        if (finished) {
          setHintVisible(false);
        }
      });
    }, HINT_DURATION_MS);

    return () => {
      fadeIn.stop();
      fadeOut?.stop();
      clearTimeout(hideTimer);
    };
  }, [hintOpacity, hintVisible]);

  const showHint = useCallback(() => {
    setHintVisible(true);
  }, []);

  const confirmArchive = useCallback(
    (list: ShoppingList) => {
      Alert.alert('Archiver la liste', `Voulez-vous archiver « ${list.name} » ?`, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Archiver', style: 'destructive', onPress: () => onArchive?.(list) },
      ]);
    },
    [onArchive]
  );

  const handleOpenList = useCallback((list: ShoppingList) => {
    router.push({ pathname: '/liste/[id]', params: { id: list.id } });
  }, []);

  const handleLongPress = useCallback((list: ShoppingList, anchor: ContextMenuAnchor) => {
    setMenuTarget({ list, anchor });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuTarget(null);
  }, []);

  const menuAction = useMemo(() => {
    if (!menuTarget) {
      return null;
    }

    return {
      label: 'Archiver la liste',
      icon: archiveIcon,
      accessibilityLabel: `Archiver ${menuTarget.list.name}`,
      onPress: () => confirmArchive(menuTarget.list),
    };
  }, [archiveIcon, confirmArchive, menuTarget]);

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
            style={({ pressed }) => [styles.infoButton, pressed && styles.infoButtonPressed]}
          >
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
          </Pressable>
        ) : null}

        {sectionInfoMessage && hintVisible ? (
          <Animated.View pointerEvents="none" style={[styles.hintBubble, { opacity: hintOpacity }]}>
            <Text style={styles.hintText}>{sectionInfoMessage}</Text>
          </Animated.View>
        ) : null}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.icon} style={styles.loader} />
      ) : lists.length === 0 ? (
        <Text style={styles.empty}>{emptyMessage}</Text>
      ) : (
        // ScrollView + map : OK sous ~40 listes. Passer en FlatList au-delà (virtualisation).
        <View style={styles.scrollWrap}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.lists}
            showsVerticalScrollIndicator
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleScrollLayout}
          >
            {lists.map((list) => (
              <ShoppingListRow
                key={list.id}
                list={list}
                onOpen={handleOpenList}
                onLongPress={onArchive ? handleLongPress : undefined}
              />
            ))}
          </ScrollView>

          <ScrollEdgeFade visible={canScrollMore} color={colors.bg} />
        </View>
      )}

      {menuAction ? (
        <ContextMenu
          visible={menuTarget != null}
          anchor={menuTarget?.anchor ?? null}
          action={menuAction}
          onClose={closeMenu}
        />
      ) : null}
    </View>
  );
}
