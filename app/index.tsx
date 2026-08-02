import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { ComponentProps } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CardRow } from '../components/CardRow';
import { useShoppingLists } from '../hooks/useShoppingLists';
import type { ShoppingList } from '../types';

type MenuEntry = {
  title: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  backgroundColor: string;
  onPress?: () => void;
  href?: '/historique' | '/parametres';
};

export default function HomeScreen() {
  const { lists, loading, createNewList, removeList } = useShoppingLists();

  async function handleCreateList() {
    const list = await createNewList();
    router.push({ pathname: '/liste/[id]', params: { id: list.id } });
  }

  function confirmDeleteList(list: ShoppingList) {
    Alert.alert('Supprimer la liste', `Voulez-vous supprimer « ${list.name} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => void removeList(list.id),
      },
    ]);
  }

  const menu: MenuEntry[] = [
    {
      title: 'Nouvelle liste',
      icon: 'add-circle',
      iconColor: '#2563eb',
      backgroundColor: '#dbeafe',
      onPress: () => void handleCreateList(),
    },
    {
      title: 'Historique',
      icon: 'time',
      iconColor: '#0d9488',
      backgroundColor: '#ccfbf1',
      href: '/historique',
    },
    {
      title: 'Paramètres',
      icon: 'settings',
      iconColor: '#64748b',
      backgroundColor: '#e2e8f0',
      href: '/parametres',
    },
  ];

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Liste de courses</Text>
      <Text style={styles.subtitle}>Tout est stocké sur votre téléphone, sans connexion.</Text>

      <View style={styles.menu}>
        {menu.map((entry) => {
          const content = (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={entry.title}
              onPress={entry.onPress}
              style={({ pressed }) => [styles.iconItem, pressed && styles.iconItemPressed]}>
              <View style={[styles.iconButton, { backgroundColor: entry.backgroundColor }]}>
                <Ionicons name={entry.icon} size={32} color={entry.iconColor} />
              </View>
              <Text style={styles.iconLabel}>{entry.title}</Text>
            </Pressable>
          );

          if (entry.href) {
            return (
              <Link key={entry.title} href={entry.href} asChild>
                {content}
              </Link>
            );
          }

          return <View key={entry.title}>{content}</View>;
        })}
      </View>

      <View style={styles.listsSection}>
        <Text style={styles.sectionTitle}>Mes listes</Text>

        {loading ? (
          <ActivityIndicator color="#2563eb" style={styles.listsLoader} />
        ) : lists.length === 0 ? (
          <Text style={styles.listsEmpty}>
            Aucune liste pour l’instant. Créez-en une avec le bouton ci-dessus.
          </Text>
        ) : (
          <ScrollView
            style={styles.listsScroll}
            contentContainerStyle={styles.lists}
            showsVerticalScrollIndicator>
            {lists.map((list) => (
              <View key={list.id} style={styles.listPressable}>
                <CardRow
                  title={list.name}
                  onPress={() =>
                    router.push({ pathname: '/liste/[id]', params: { id: list.id } })
                  }
                  right={
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Supprimer ${list.name}`}
                      onPress={() => confirmDeleteList(list)}
                      hitSlop={6}
                      style={({ pressed }) => [
                        styles.deleteButton,
                        pressed && styles.deleteButtonPressed,
                      ]}>
                      <Ionicons name="trash-outline" size={20} color="#dc2626" />
                    </Pressable>
                  }
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
  },
  menu: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  iconItem: {
    alignItems: 'center',
    gap: 8,
    width: 96,
  },
  iconItemPressed: {
    opacity: 0.7,
  },
  iconButton: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0f172a',
    textAlign: 'center',
  },
  listsSection: {
    flex: 1,
    marginTop: 36,
    gap: 12,
    minHeight: 0,
  },
  listsScroll: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  listsLoader: {
    marginTop: 8,
  },
  listsEmpty: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  lists: {
    gap: 10,
  },
  listPressable: {
    alignSelf: 'stretch',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonPressed: {
    backgroundColor: '#fee2e2',
  },
});
