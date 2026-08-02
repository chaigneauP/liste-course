import { View } from 'react-native';

import { ShoppingListsSection } from '@/presentation/components/ShoppingListsSection';
import { useShoppingLists } from '@/presentation/hooks/useShoppingLists';

import { useHistoryScreenStyles } from './HistoryScreen.styles';

export function HistoryScreen() {
  const { lists, loading } = useShoppingLists('archived');
  const styles = useHistoryScreenStyles();

  return (
    <View style={styles.screen}>
      <ShoppingListsSection
        lists={lists}
        loading={loading}
        sectionTitle="Listes archivées"
        emptyMessage="Aucune liste archivée pour l’instant. Archivez une liste depuis l’accueil pour la retrouver ici."
      />
    </View>
  );
}
