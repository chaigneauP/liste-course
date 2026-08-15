import { useEffect, type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const PRESS_SCALE = 0.92;
const PRESS_IN_MS = 70;

type Props = Omit<PressableProps, 'children' | 'style'> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  contentStyle?: StyleProp<ViewStyle>;
};

export function DepressiblePressable({
  children,
  style,
  contentStyle,
  onPressIn,
  onPressOut,
  ...pressableProps
}: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    return () => {
      cancelAnimation(scale);
    };
  }, [scale]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn(event: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) {
    scale.value = withTiming(PRESS_SCALE, {
      duration: PRESS_IN_MS,
      easing: Easing.out(Easing.quad),
    });
    onPressIn?.(event);
  }

  function handlePressOut(event: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) {
    scale.value = withSpring(1, {
      damping: 18,
      stiffness: 280,
      mass: 0.6,
    });
    onPressOut?.(event);
  }

  return (
    <Pressable
      {...pressableProps}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Animated.View style={[contentStyle, contentAnimatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
