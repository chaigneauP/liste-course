import { StyleSheet, View } from 'react-native';

import { ShoppingListsSection } from '../components/ShoppingListsSection';
import { useShoppingLists } from '../hooks/useShoppingLists';

export default function HistoryScreen() {
  const { lists, loading } = useShoppingLists('archived');

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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
  },
});
