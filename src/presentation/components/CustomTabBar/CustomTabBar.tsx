import { Ionicons } from '@expo/vector-icons';
import type { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DepressiblePressable } from '@/presentation/components/DepressiblePressable';
import { useTheme } from '@/presentation/theme';

import { CenterTabButton } from './CenterTabButton';
import {
  CENTER_TAB_ROUTE,
  LEFT_TAB_ROUTE,
  RIGHT_TAB_ROUTE,
  useCustomTabBarStyles,
} from './CustomTabBar.styles';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];
type TabRouteName = typeof LEFT_TAB_ROUTE | typeof CENTER_TAB_ROUTE | typeof RIGHT_TAB_ROUTE;

function getRouteIndex(state: TabBarProps['state'], name: TabRouteName): number {
  return state.routes.findIndex((route) => route.name === name);
}

export function CustomTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const styles = useCustomTabBarStyles();
  const { colors } = useTheme();
  const historiqueIndex = getRouteIndex(state, LEFT_TAB_ROUTE);
  const homeIndex = getRouteIndex(state, CENTER_TAB_ROUTE);
  const parametresIndex = getRouteIndex(state, RIGHT_TAB_ROUTE);
  const isHomeFocused = state.index === homeIndex;

  function navigateTo(routeName: TabRouteName) {
    const routeIndex = getRouteIndex(state, routeName);
    if (routeIndex === -1) {
      return;
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[routeIndex].key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented && state.index !== routeIndex) {
      navigation.navigate(routeName);
    }
  }

  function handleNavigateHome() {
    navigateTo(CENTER_TAB_ROUTE);
  }

  return (
    <View style={styles.bar}>
      <View style={styles.barRow}>
        <DepressiblePressable
          accessibilityRole="button"
          accessibilityLabel="Historique"
          accessibilityState={{ selected: state.index === historiqueIndex }}
          onPress={() => navigateTo(LEFT_TAB_ROUTE)}
          style={[styles.sideTab, state.index === historiqueIndex && styles.sideTabActive]}
          contentStyle={styles.sideTabContent}>
          <Ionicons
            name="time-outline"
            size={24}
            color={state.index === historiqueIndex ? colors.btnSecondaryIcon : colors.textSecondary}
          />
          <Text
            style={[
              styles.sideTabLabel,
              state.index === historiqueIndex && styles.sideTabLabelActive,
            ]}>
            Historique
          </Text>
        </DepressiblePressable>

        <View style={styles.centerSpacer} />

        <DepressiblePressable
          accessibilityRole="button"
          accessibilityLabel="Paramètres"
          accessibilityState={{ selected: state.index === parametresIndex }}
          onPress={() => navigateTo(RIGHT_TAB_ROUTE)}
          style={[styles.sideTab, state.index === parametresIndex && styles.sideTabActive]}
          contentStyle={styles.sideTabContent}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={state.index === parametresIndex ? colors.btnSecondaryIcon : colors.textSecondary}
          />
          <Text
            style={[
              styles.sideTabLabel,
              state.index === parametresIndex && styles.sideTabLabelActive,
            ]}>
            Paramètres
          </Text>
        </DepressiblePressable>
      </View>

      <View style={styles.centerButtonAnchor} pointerEvents="box-none">
        <CenterTabButton isHomeFocused={isHomeFocused} onNavigateHome={handleNavigateHome} />
      </View>

      {insets.bottom > 0 ? <View style={{ height: insets.bottom }} /> : null}
    </View>
  );
}
