import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/presentation/theme';

import {
  ACTION_BUTTON_HIT_SLOP,
  SCREEN_TOP_EXTRA_PADDING,
  useScreenTopStyles,
} from './ScreenTop.styles';

type IconName = ComponentProps<typeof Ionicons>['name'];

type RightAction = {
  icon: IconName;
  accessibilityLabel: string;
  onPress: () => void;
};

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: RightAction;
};

export function ScreenTop({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}: Props) {
  const insets = useSafeAreaInsets();
  const styles = useScreenTopStyles();
  const { colors } = useTheme();

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    router.back();
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + SCREEN_TOP_EXTRA_PADDING }]}>
      <View style={[styles.row, (showBack || rightAction) && styles.rowWithActions]}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retour"
            hitSlop={ACTION_BUTTON_HIT_SLOP}
            onPress={handleBack}
            style={({ pressed }) => [styles.sideButton, styles.backButton, pressed && styles.sideButtonPressed]}>
            <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
          </Pressable>
        ) : null}

        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {rightAction ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={rightAction.accessibilityLabel}
            hitSlop={ACTION_BUTTON_HIT_SLOP}
            onPress={rightAction.onPress}
            style={({ pressed }) => [
              styles.sideButton,
              styles.rightButton,
              pressed && styles.sideButtonPressed,
            ]}>
            <Ionicons name={rightAction.icon} size={24} color={colors.icon} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
