import { useRef, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

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
  const scale = useRef(new Animated.Value(1)).current;

  function animateTo(value: number, duration?: number) {
    Animated.timing(scale, {
      toValue: value,
      duration: duration ?? PRESS_IN_MS,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }

  function handlePressIn(event: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) {
    animateTo(PRESS_SCALE);
    onPressIn?.(event);
  }

  function handlePressOut(event: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) {
    Animated.spring(scale, {
      toValue: 1,
      speed: 24,
      bounciness: 3,
      useNativeDriver: true,
    }).start();
    onPressOut?.(event);
  }

  return (
    <Pressable
      {...pressableProps}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}>
      <Animated.View style={[contentStyle, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
