import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

import { CustomTabBar } from '@/presentation/components/CustomTabBar';
import { useTheme } from '@/presentation/theme';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

function renderTabBar(props: TabBarProps) {
  return <CustomTabBar {...props} />;
}

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
      }}>
      <Tabs.Screen
        name="historique"
        options={{
          title: 'Historique',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
        }}
      />
      <Tabs.Screen
        name="parametres"
        options={{
          title: 'Paramètres',
        }}
      />
    </Tabs>
  );
}
