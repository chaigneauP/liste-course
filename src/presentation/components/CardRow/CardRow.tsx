import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type View as ViewType,
} from 'react-native';

import { truncateListTitle } from '@/domain/entities/listTitle';
import type { ListCompletion } from '@/domain/entities/shoppingList';
import { useTheme } from '@/presentation/theme';

import { cardRowMenuMetrics, useCardRowStyles } from './CardRow.styles';

const MENU_ANIMATION_DURATION = 180;

export type CardRowLongPressAction = {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
};

type Anchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  title: string;
  subtitle?: string;
  checked?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  right?: ReactNode;
  longPressAction?: CardRowLongPressAction;
  listCompletion?: ListCompletion;
};

export function CardRow({
  title,
  subtitle,
  checked = false,
  onPress,
  accessibilityLabel,
  right,
  longPressAction,
  listCompletion,
}: Props) {
  const styles = useCardRowStyles();
  const { colors } = useTheme();
  const rowRef = useRef<ViewType>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const menuTranslateY = useRef(new Animated.Value(-6)).current;
  const menuScale = useRef(new Animated.Value(0.96)).current;
  const displayTitle = truncateListTitle(title);

  useEffect(() => {
    if (!menuVisible || !anchor) {
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

    Animated.parallel([
      settle(menuOpacity, 1),
      settle(menuTranslateY, 0),
      settle(menuScale, 1),
    ]).start();
  }, [anchor, menuOpacity, menuScale, menuTranslateY, menuVisible]);

  function hideMenu() {
    setMenuVisible(false);
    setAnchor(null);
  }

  function showMenu() {
    rowRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setMenuVisible(true);
    });
  }

  function handleActionPress() {
    hideMenu();
    longPressAction?.onPress();
  }

  const completionIcon =
    listCompletion === 'complete' ? (
      <FontAwesome6
        name="circle-check"
        size={20}
        color={colors.success}
        accessibilityLabel="Tous les articles sont cochés"
      />
    ) : listCompletion === 'in-progress' ? (
      <FontAwesome6
        name="arrows-rotate"
        size={18}
        color={colors.accentBg}
        accessibilityLabel="Articles restants à acheter"
      />
    ) : null;

  const content = (
    <>
      <View style={styles.titleContainer}>
        <Text
          style={[styles.title, checked && styles.titleChecked]}
          numberOfLines={2}
          ellipsizeMode="tail">
          {displayTitle}
        </Text>
      </View>

      {(subtitle || right || completionIcon) && (
        <View style={styles.trailing}>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
          {right}
          {completionIcon}
        </View>
      )}
    </>
  );

  if (!onPress && !longPressAction) {
    return <View style={[styles.row, checked && styles.rowChecked]}>{content}</View>;
  }

  const menuTop = anchor != null ? anchor.y + anchor.height + cardRowMenuMetrics.gap : 0;

  return (
    <>
      <Pressable
        ref={rowRef}
        collapsable={false}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ checked }}
        onPress={onPress}
        onLongPress={longPressAction ? showMenu : undefined}
        delayLongPress={400}
        style={({ pressed }) => [
          styles.row,
          checked && styles.rowChecked,
          pressed && !checked && styles.rowPressed,
          pressed && checked && styles.rowCheckedPressed,
        ]}>
        {content}
      </Pressable>

      {longPressAction ? (
        <Modal
          visible={menuVisible}
          transparent
          animationType="none"
          onRequestClose={hideMenu}>
          <View style={styles.menuOverlay} pointerEvents="box-none">
            <Pressable style={StyleSheet.absoluteFill} onPress={hideMenu} />

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
                  accessibilityLabel={
                    longPressAction.accessibilityLabel ?? longPressAction.label
                  }
                  onPress={handleActionPress}
                  style={({ pressed }) => [
                    styles.menuAction,
                    pressed && styles.menuActionPressed,
                  ]}>
                  {longPressAction.icon}
                  <Text style={styles.menuActionLabel} numberOfLines={1}>
                    {longPressAction.label}
                  </Text>
                </Pressable>
              </Animated.View>
            ) : null}
          </View>
        </Modal>
      ) : null}
    </>
  );
}
