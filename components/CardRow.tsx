import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { truncateListTitle } from '../lib/listTitle';

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: ReactNode;
};

export function CardRow({ title, subtitle, onPress, right }: Props) {
  const displayTitle = truncateListTitle(title);

  const titleElement = (
    <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
      {displayTitle}
    </Text>
  );

  return (
    <View style={styles.row}>
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={({ pressed }) => [styles.titleContainer, pressed && styles.titlePressablePressed]}>
          {titleElement}
        </Pressable>
      ) : (
        <View style={styles.titleContainer}>{titleElement}</View>
      )}

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
    </View>
  );
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
  title: {
    fontSize: 16,
    color: '#0f172a',
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
  titlePressablePressed: {
    opacity: 0.7,
  },
});

const styles = cardRowStyles;
