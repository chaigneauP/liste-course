import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { ComponentProps, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ListNameModal } from '../components/ListNameModal';
import { ShoppingListsSection } from '../components/ShoppingListsSection';
import { useShoppingLists } from '../hooks/useShoppingLists';
import { makeStyles } from '../theme/makeStyles';
import { useTheme } from '../theme/ThemeProvider';

type MenuEntry = {
  title: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  backgroundColor: string;
  borderColor?: string;
  onPress?: () => void;
  href?: '/historique' | '/parametres';
};

export default function HomeScreen() {
  const { lists, loading, createNewList, archiveExistingList } = useShoppingLists('active');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const styles = useStyles();
  const { colors } = useTheme();

  function openCreateModal() {
    setCreateModalVisible(true);
  }

  function closeCreateModal() {
    setCreateModalVisible(false);
  }

  async function handleCreateList(name: string) {
    const list = await createNewList(name);
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
                  styles.iconButton,
                  {
                    backgroundColor: entry.backgroundColor,
                    borderColor: entry.borderColor ?? entry.backgroundColor,
                  },
                ]}>
                <Ionicons name={entry.icon} size={32} color={entry.iconColor} />
              </View>
              <Text style={styles.iconLabel}>{entry.title}</Text>
            </>
          );

          if (entry.href) {
            return (
              <Link key={entry.title} href={entry.href} asChild>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={entry.title}
                  style={({ pressed }) => [styles.iconItem, pressed && styles.iconItemPressed]}>
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
              style={({ pressed }) => [styles.iconItem, pressed && styles.iconItemPressed]}>
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
          onArchive={(list) => void archiveExistingList(list.id)}
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

const useStyles = makeStyles((colors) => ({
  screen: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  menu: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  iconItem: {
    alignItems: 'center',
    width: 96,
  },
  iconItemPressed: {
    opacity: 0.7,
  },
  iconButton: {
    width: 72,
    height: 72,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
    width: '100%',
    lineHeight: 18,
    minHeight: 36,
  },
  listsSection: {
    flex: 1,
    marginTop: 36,
    minHeight: 0,
  },
}));
