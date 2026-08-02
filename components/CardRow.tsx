import { ReactNode, useEffect, useRef, useState } from 'react';
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
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { truncateListTitle } from '../lib/listTitle';

const MENU_GAP = 6;
const MENU_EDGE_INSET = 20;
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
  listCompletion?: 'complete' | 'in-progress';
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

    Animated.parallel([
      Animated.timing(menuOpacity, {
        toValue: 1,
        duration: MENU_ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(menuTranslateY, {
        toValue: 0,
        duration: MENU_ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(menuScale, {
        toValue: 1,
        duration: MENU_ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
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

  const titleElement = (
    <Text
      style={[styles.title, checked && styles.titleChecked]}
      numberOfLines={2}
      ellipsizeMode="tail">
      {displayTitle}
    </Text>
  );

  const completionIcon =
    listCompletion === 'complete' ? (
      <FontAwesome6
        name="circle-check"
        size={20}
        color="#16a34a"
        accessibilityLabel="Tous les articles sont cochés"
      />
    ) : listCompletion === 'in-progress' ? (
      <FontAwesome6
        name="arrows-rotate"
        size={18}
        color="#7c3aed"
        accessibilityLabel="Articles restants à acheter"
      />
    ) : null;

  const content = (
    <>
      <View style={styles.titleContainer}>{titleElement}</View>

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

  const menuTop = anchor != null ? anchor.y + anchor.height + MENU_GAP : 0;

  if (onPress || longPressAction) {
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
                      right: MENU_EDGE_INSET,
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

  return (
    <View style={[styles.row, checked && styles.rowChecked]}>{content}</View>
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
  rowChecked: {
    backgroundColor: '#ecfdf5',
    borderColor: '#bbf7d0',
  },
  rowPressed: {
    backgroundColor: '#f8fafc',
  },
  rowCheckedPressed: {
    backgroundColor: '#d1fae5',
  },
  title: {
    fontSize: 16,
    color: '#0f172a',
  },
  titleChecked: {
    textDecorationLine: 'line-through',
    color: '#64748b',
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
    fontWeight: '500',
    color: '#64748b',
  },
  menuOverlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    alignSelf: 'flex-end',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  menuAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  menuActionPressed: {
    backgroundColor: '#fef2f2',
  },
  menuActionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#dc2626',
    flexShrink: 0,
  },
});

const styles = cardRowStyles;
