import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useTabBarBottomInset } from '@/presentation/components/CustomTabBar';
import { ListNameModal } from '@/presentation/components/ListNameModal';
import { ScreenTop } from '@/presentation/components/ScreenTop';
import { ShoppingListsSection } from '@/presentation/components/ShoppingListsSection';
import { useShoppingLists } from '@/presentation/hooks/useShoppingLists';

import { useHomeScreenStyles } from './HomeScreen.styles';

export function HomeScreen() {
  const { lists, loading, createList, archiveList } = useShoppingLists('active');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const styles = useHomeScreenStyles();
  const tabBarInset = useTabBarBottomInset();
  const { create } = useLocalSearchParams<{ create?: string }>();

  useEffect(() => {
    if (create === '1') {
      setCreateModalVisible(true);
      router.setParams({ create: undefined });
    }
  }, [create]);

  function closeCreateModal() {
    setCreateModalVisible(false);
  }

  async function handleCreateList(name: string) {
    const list = await createList(name);
    closeCreateModal();
    router.push({ pathname: '/liste/[id]', params: { id: list.id } });
  }

  return (
    <View style={[styles.screen, { paddingBottom: tabBarInset }]}>
      <ScreenTop
        title="Liste de courses"
        subtitle="Tout est stocké sur votre téléphone, sans connexion."
      />

      <View style={styles.listsSection}>
        <ShoppingListsSection
          lists={lists}
          loading={loading}
          sectionTitle="Mes listes"
          emptyMessage="Aucune liste pour l’instant. Appuyez sur « Nouvelle liste » en bas pour en créer une."
          onArchive={(list) => void archiveList(list.id)}
        />
      </View>

      <ListNameModal
        visible={createModalVisible}
        onCancel={closeCreateModal}
        onSubmit={(name) => void handleCreateList(name)}
      />
    </View>
  );
}
