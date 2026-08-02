import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type MenuEntry = {
  href: '/nouvelle-liste' | '/historique' | '/parametres';
  title: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  backgroundColor: string;
};

const MENU: MenuEntry[] = [
  {
    href: '/nouvelle-liste',
    title: 'Nouvelle liste',
    icon: 'add-circle',
    iconColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  {
    href: '/historique',
    title: 'Historique',
    icon: 'time',
    iconColor: '#0d9488',
    backgroundColor: '#ccfbf1',
  },
  {
    href: '/parametres',
    title: 'Paramètres',
    icon: 'settings',
    iconColor: '#64748b',
    backgroundColor: '#e2e8f0',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Liste de courses</Text>
      <Text style={styles.subtitle}>Tout est stocké sur votre téléphone, sans connexion.</Text>

      <View style={styles.menu}>
        {MENU.map((entry) => (
          <Link key={entry.href} href={entry.href} asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={entry.title}
              style={({ pressed }) => [styles.iconItem, pressed && styles.iconItemPressed]}>
              <View style={[styles.iconButton, { backgroundColor: entry.backgroundColor }]}>
                <Ionicons name={entry.icon} size={32} color={entry.iconColor} />
              </View>
              <Text style={styles.iconLabel}>{entry.title}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
