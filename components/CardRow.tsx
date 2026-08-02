import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { truncateListTitle } from '../lib/listTitle';

type Props = {
  title: string;
  subtitle?: string;
  checked?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  right?: ReactNode;
};

export function CardRow({
  title,
  subtitle,
  checked = false,
  onPress,
  accessibilityLabel,
  right,
}: Props) {
  const displayTitle = truncateListTitle(title);

  const titleElement = (
    <Text
      style={[styles.title, checked && styles.titleChecked]}
      numberOfLines={2}
      ellipsizeMode="tail">
      {displayTitle}
    </Text>
  );

  const content = (
    <>
      <View style={styles.titleContainer}>{titleElement}</View>

      {(subtitle || right) && (
        <View style={styles.trailing}>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
          {right}
        </View>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ checked }}
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          checked && styles.rowChecked,
          pressed && !checked && styles.rowPressed,
          pressed && checked && styles.rowCheckedPressed,
        ]}>
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.row, checked && styles.rowChecked]}>{content}</View>;
}

export const cardRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rowChecked: {
    backgroundColor: '#ecfdf5',
    borderColor: '#bbf7d0',
  },
  rowPressed: {
    backgroundColor: '#f8fafc',
  },
  rowCheckedPressed: {
    backgroundColor: '#d1fae5',
  },
  title: {
    fontSize: 16,
    color: '#0f172a',
  },
  titleChecked: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
    justifyContent: 'center',
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
  },
});

const styles = cardRowStyles;
