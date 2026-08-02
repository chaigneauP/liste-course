import { View } from 'react-native';

import { ScreenTop } from '@/presentation/components/ScreenTop';
import { ShoppingListsSection } from '@/presentation/components/ShoppingListsSection';
import { useTabBarBottomInset } from '@/presentation/components/CustomTabBar';
import { useShoppingLists } from '@/presentation/hooks/useShoppingLists';

import { useHistoryScreenStyles } from './HistoryScreen.styles';

export function HistoryScreen() {
  const { lists, loading } = useShoppingLists('archived');
  const styles = useHistoryScreenStyles();
  const tabBarInset = useTabBarBottomInset();

  return (
    <View style={[styles.screen, { paddingBottom: tabBarInset }]}>
      <ScreenTop title="Historique" />

      <View style={styles.content}>
        <ShoppingListsSection
          lists={lists}
          loading={loading}
          sectionTitle="Listes archivées"
          emptyMessage="Aucune liste archivée pour l’instant. Archivez une liste depuis l’accueil pour la retrouver ici."
        />
      </View>
    </View>
  );
}
