import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { contextMenuMetrics, useContextMenuStyles } from './ContextMenu.styles';

const MENU_ANIMATION_DURATION = 180;

export type ContextMenuAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ContextMenuAction = {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
};

type Props = {
  visible: boolean;
  anchor: ContextMenuAnchor | null;
  action: ContextMenuAction;
  onClose: () => void;
};

export function ContextMenu({ visible, anchor, action, onClose }: Props) {
  const styles = useContextMenuStyles();
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const menuTranslateY = useRef(new Animated.Value(-6)).current;
  const menuScale = useRef(new Animated.Value(0.96)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!visible || !anchor) {
      return;
    }

    menuOpacity.setValue(0);
    menuTranslateY.setValue(-6);
    menuScale.setValue(0.96);

    const settle = (value: Animated.Value, toValue: number) =>
      Animated.timing(value, {
        toValue,
        duration: MENU_ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

    animationRef.current = Animated.parallel([
      settle(menuOpacity, 1),
      settle(menuTranslateY, 0),
      settle(menuScale, 1),
    ]);
    animationRef.current.start();

    return () => {
      animationRef.current?.stop();
    };
  }, [anchor, menuOpacity, menuScale, menuTranslateY, visible]);

  function handleActionPress() {
    onClose();
    action.onPress();
  }

  const menuTop = anchor != null ? anchor.y + anchor.height + contextMenuMetrics.gap : 0;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay} pointerEvents="box-none">
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {anchor ? (
          <Animated.View
            style={[
              styles.menu,
              {
                top: menuTop,
                opacity: menuOpacity,
                transform: [{ translateY: menuTranslateY }, { scale: menuScale }],
              },
            ]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={action.accessibilityLabel ?? action.label}
              onPress={handleActionPress}
              style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
              {action.icon}
              <Text style={styles.actionLabel} numberOfLines={1}>
                {action.label}
              </Text>
            </Pressable>
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}
