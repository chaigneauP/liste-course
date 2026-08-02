import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { DepressiblePressable } from '@/presentation/components/DepressiblePressable';
import { useTheme } from '@/presentation/theme';

import {
  CENTER_TAB_PILL_HORIZONTAL_PADDING,
  useCenterTabButtonStyles,
} from './CenterTabButton.styles';
import { CENTER_BUTTON_HEIGHT } from './CustomTabBar.styles';

const MORPH_MS = 220;
const BUBBLE_SIZE = CENTER_BUTTON_HEIGHT;
const PILL_WIDTH = 156;
const HOME_ICON_SIZE = 26;

type Props = {
  isHomeFocused: boolean;
  onNavigateHome: () => void;
};

export function CenterTabButton({ isHomeFocused, onNavigateHome }: Props) {
  const styles = useCenterTabButtonStyles();
  const { colors } = useTheme();
  const morph = useSharedValue(isHomeFocused ? 1 : 0);

  useEffect(() => {
    morph.value = withTiming(isHomeFocused ? 1 : 0, {
      duration: MORPH_MS,
      easing: Easing.out(Easing.cubic),
    });

    return () => {
      cancelAnimation(morph);
    };
  }, [isHomeFocused, morph]);

  const buttonStyle = useAnimatedStyle(() => ({
    width: interpolate(morph.value, [0, 1], [BUBBLE_SIZE, PILL_WIDTH]),
    paddingHorizontal: interpolate(morph.value, [0, 1], [
      0,
      CENTER_TAB_PILL_HORIZONTAL_PADDING,
    ]),
    transform: [
      {
        scale: interpolate(morph.value, [0, 0.5, 1], [1, 0.9, 1]),
      },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: morph.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(morph.value, [0, 1], [1, 0]),
  }));

  function handlePress() {
    if (isHomeFocused) {
      router.setParams({ create: '1' });
      return;
    }

    onNavigateHome();
  }

  return (
    <DepressiblePressable
      accessibilityRole="button"
      accessibilityLabel={isHomeFocused ? 'Nouvelle liste' : 'Accueil'}
      accessibilityState={{ selected: isHomeFocused }}
      onPress={handlePress}
      style={({ pressed }) => [pressed && styles.centerButtonPressed]}>
      <Animated.View style={[styles.centerButton, buttonStyle]}>
        <Animated.View style={[styles.centerButtonLayer, labelStyle]}>
          <Text style={styles.centerButtonLabel}>Nouvelle liste</Text>
        </Animated.View>

        <Animated.View style={[styles.centerButtonLayer, iconStyle]}>
          <Ionicons name="home" size={HOME_ICON_SIZE} color={colors.btnPrimaryIcon} />
        </Animated.View>
      </Animated.View>
    </DepressiblePressable>
  );
}
