import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import type { ShoppingList } from '@/domain/entities/shoppingList';
import { useTabBarBottomInset } from '@/presentation/components/CustomTabBar';
import { HomeTaglineCarousel } from '@/presentation/components/HomeTaglineCarousel';
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

  const closeCreateModal = useCallback(() => {
    setCreateModalVisible(false);
  }, []);

  const handleCreateList = useCallback(
    async (name: string) => {
      const list = await createList(name);
      closeCreateModal();
      router.push({ pathname: '/liste/[id]', params: { id: list.id } });
    },
    [closeCreateModal, createList]
  );

  const handleArchive = useCallback(
    (list: ShoppingList) => {
      void archiveList(list.id);
    },
    [archiveList]
  );

  return (
    <View style={[styles.screen, { paddingBottom: tabBarInset }]}>
      <ScreenTop title="Ma liste de courses" />

      <View style={styles.tagline}>
        <HomeTaglineCarousel />
      </View>

      <View style={styles.listsSection}>
        <ShoppingListsSection
          lists={lists}
          loading={loading}
          sectionTitle="Mes listes"
          sectionInfoMessage="Maintenez appuyé sur une liste pour l’archiver."
          emptyMessage="Aucune liste pour l’instant. Appuyez sur « Nouvelle liste » en bas pour en créer une."
          onArchive={handleArchive}
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
