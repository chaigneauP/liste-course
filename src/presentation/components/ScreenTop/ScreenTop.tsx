import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/presentation/theme';

import {
  BACK_BUTTON_HIT_SLOP,
  SCREEN_TOP_EXTRA_PADDING,
  useScreenTopStyles,
} from './ScreenTop.styles';

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
};

export function ScreenTop({ title, subtitle, showBack = false, onBack }: Props) {
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
      <View style={[styles.row, showBack && styles.rowWithBack]}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retour"
            hitSlop={BACK_BUTTON_HIT_SLOP}
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
            <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
          </Pressable>
        ) : null}

        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}
