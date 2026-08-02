import { Tabs } from 'expo-router';

import { CustomTabBar } from '@/presentation/components/CustomTabBar';
import { useTheme } from '@/presentation/theme';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
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
