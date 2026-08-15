import { Ionicons } from '@expo/vector-icons';
import { memo, useRef, type ReactNode } from 'react';
import { Pressable, Text, View, type View as ViewType } from 'react-native';

import { truncateListTitle } from '@/domain/entities/listTitle';
import type { ListCompletion } from '@/domain/entities/shoppingList';
import type { ContextMenuAnchor } from '@/presentation/components/ContextMenu';
import { useTheme } from '@/presentation/theme';

import { useCardRowStyles } from './CardRow.styles';

type Props = {
  title: string;
  subtitle?: string;
  description?: string;
  checked?: boolean;
  onPress?: () => void;
  onLongPress?: (anchor: ContextMenuAnchor) => void;
  accessibilityLabel?: string;
  right?: ReactNode;
  listCompletion?: ListCompletion;
};

export const CardRow = memo(function CardRow({
  title,
  subtitle,
  description,
  checked = false,
  onPress,
  onLongPress,
  accessibilityLabel,
  right,
  listCompletion,
}: Props) {
  const styles = useCardRowStyles();
  const { colors } = useTheme();
  const rowRef = useRef<ViewType>(null);
  const displayTitle = truncateListTitle(title);

  function handleLongPress() {
    rowRef.current?.measureInWindow((x, y, width, height) => {
      onLongPress?.({ x, y, width, height });
    });
  }

  const completionIcon =
    listCompletion === 'complete' ? (
      <Ionicons
        name="checkmark-circle"
        size={20}
        color={colors.success}
        accessibilityLabel="Tous les articles sont cochés"
      />
    ) : listCompletion === 'in-progress' ? (
      <Ionicons
        name="sync"
        size={18}
        color={colors.iconAccent}
        accessibilityLabel="Articles restants à acheter"
      />
    ) : null;

  const content = (
    <>
      <View style={styles.titleContainer}>
        <Text
          style={[styles.title, checked && styles.titleChecked]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {displayTitle}
        </Text>
        {description ? (
          <Text
            style={[styles.description, checked && styles.descriptionChecked]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        ) : null}
      </View>

      {(subtitle || right || completionIcon) && (
        <View style={styles.trailing}>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
          {right}
          {completionIcon}
        </View>
      )}
    </>
  );

  if (!onPress && !onLongPress) {
    return <View style={[styles.row, checked && styles.rowChecked]}>{content}</View>;
  }

  return (
    <Pressable
      ref={rowRef}
      collapsable={false}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ checked }}
      onPress={onPress}
      onLongPress={onLongPress ? handleLongPress : undefined}
      delayLongPress={400}
      style={({ pressed }) => [
        styles.row,
        checked && styles.rowChecked,
        pressed && !checked && styles.rowPressed,
        pressed && checked && styles.rowCheckedPressed,
      ]}
    >
      {content}
    </Pressable>
  );
});
