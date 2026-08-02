import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  right?: ReactNode;
};

export function CardRow({ title, onPress, right }: Props) {
  return (
    <View style={styles.row}>
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={({ pressed }) => [styles.titleContainer, pressed && styles.titlePressablePressed]}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>
      )}
      {right}
    </View>
  );
}

export const cardRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    textAlign: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titlePressablePressed: {
    opacity: 0.7,
  },
});

const styles = cardRowStyles;
