import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ListNameModal } from '@/presentation/components/ListNameModal';
import { ShoppingListsSection } from '@/presentation/components/ShoppingListsSection';
import { useShoppingLists } from '@/presentation/hooks/useShoppingLists';
import { useTheme } from '@/presentation/theme';

import { HOME_MENU_ICON_SIZE, useHomeScreenStyles } from './HomeScreen.styles';

type MenuEntry = {
  title: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  backgroundColor: string;
  borderColor?: string;
  onPress?: () => void;
  href?: '/historique' | '/parametres';
};

export function HomeScreen() {
  const { lists, loading, createList, archiveList } = useShoppingLists('active');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const styles = useHomeScreenStyles();
  const { colors } = useTheme();

  function openCreateModal() {
    setCreateModalVisible(true);
  }

  function closeCreateModal() {
    setCreateModalVisible(false);
  }

  async function handleCreateList(name: string) {
    const list = await createList(name);
    closeCreateModal();
    router.push({ pathname: '/liste/[id]', params: { id: list.id } });
  }

  const menu: MenuEntry[] = [
    {
      title: 'Nouvelle liste',
      icon: 'add-circle',
      iconColor: colors.btnPrimaryIcon,
      backgroundColor: colors.btnPrimaryBg,
      onPress: openCreateModal,
    },
    {
      title: 'Historique',
      icon: 'time',
      iconColor: colors.accentIcon,
      backgroundColor: colors.accentBg,
      href: '/historique',
    },
    {
      title: 'Paramètres',
      icon: 'settings',
      iconColor: colors.btnSecondaryIcon,
      backgroundColor: colors.btnSecondaryBg,
      borderColor: colors.border,
      href: '/parametres',
    },
  ];

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Liste de courses</Text>
      <Text style={styles.subtitle}>Tout est stocké sur votre téléphone, sans connexion.</Text>

      <View style={styles.menu}>
        {menu.map((entry) => {
          const itemContent = (
            <>
              <View
                style={[
                  styles.menuTile,
                  {
                    backgroundColor: entry.backgroundColor,
                    borderColor: entry.borderColor ?? entry.backgroundColor,
                  },
                ]}>
                <Ionicons
                  name={entry.icon}
                  size={HOME_MENU_ICON_SIZE}
                  color={entry.iconColor}
                />
              </View>
              <Text style={styles.menuLabel}>{entry.title}</Text>
            </>
          );

          const pressableStyle = ({ pressed }: { pressed: boolean }) => [
            styles.menuItem,
            pressed && styles.menuItemPressed,
          ];

          if (entry.href) {
            return (
              <Link key={entry.title} href={entry.href} asChild>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={entry.title}
                  style={pressableStyle}>
                  {itemContent}
                </Pressable>
              </Link>
            );
          }

          return (
            <Pressable
              key={entry.title}
              accessibilityRole="button"
              accessibilityLabel={entry.title}
              onPress={entry.onPress}
              style={pressableStyle}>
              {itemContent}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.listsSection}>
        <ShoppingListsSection
          lists={lists}
          loading={loading}
          sectionTitle="Mes listes"
          emptyMessage="Aucune liste pour l’instant. Créez-en une avec le bouton ci-dessus."
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
