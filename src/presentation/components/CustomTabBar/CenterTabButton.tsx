import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text } from 'react-native';

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
  const morph = useRef(new Animated.Value(isHomeFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(morph, {
      toValue: isHomeFocused ? 1 : 0,
      duration: MORPH_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isHomeFocused, morph]);

  const width = morph.interpolate({
    inputRange: [0, 1],
    outputRange: [BUBBLE_SIZE, PILL_WIDTH],
  });

  const paddingHorizontal = morph.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CENTER_TAB_PILL_HORIZONTAL_PADDING],
  });

  const morphScale = morph.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.9, 1],
  });

  const labelOpacity = morph;
  const iconOpacity = morph.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

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
      <Animated.View
        style={[
          styles.centerButton,
          {
            width,
            paddingHorizontal,
            transform: [{ scale: morphScale }],
          },
        ]}>
        <Animated.View style={[styles.centerButtonLayer, { opacity: labelOpacity }]}>
          <Text style={styles.centerButtonLabel}>Nouvelle liste</Text>
        </Animated.View>

        <Animated.View style={[styles.centerButtonLayer, { opacity: iconOpacity }]}>
          <Ionicons name="home" size={HOME_ICON_SIZE} color={colors.btnPrimaryIcon} />
        </Animated.View>
      </Animated.View>
    </DepressiblePressable>
  );
}
