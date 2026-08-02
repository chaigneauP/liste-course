import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import type { ThemePreference } from '@/domain/entities/themePreference';
import { ScreenTop } from '@/presentation/components/ScreenTop';
import { useTabBarBottomInset } from '@/presentation/components/CustomTabBar';
import {
  formatArchivedListCount,
  plural,
} from '@/presentation/formatters/shoppingListFormatters';
import { useArchivedLists } from '@/presentation/hooks/useArchivedLists';
import { useThemePreference } from '@/presentation/theme';

import { useSettingsScreenStyles } from './SettingsScreen.styles';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'system', label: 'Automatique' },
];

export function SettingsScreen() {
  const { count: archivedCount, deleteAll } = useArchivedLists();
  const { preference, setPreference } = useThemePreference();
  const styles = useSettingsScreenStyles();
  const tabBarInset = useTabBarBottomInset();

  async function handleDeleteHistory() {
    const deletedCount = await deleteAll();
    if (deletedCount === 0) {
      return;
    }

    Alert.alert(
      'Historique supprimé',
      `${deletedCount} liste${plural(deletedCount)} archivée${plural(deletedCount)} supprimée${plural(deletedCount)}.`
    );
  }

  function confirmDeleteHistory() {
    if (archivedCount === 0) {
      Alert.alert('Historique vide', 'Aucune liste archivée à supprimer.');
      return;
    }

    Alert.alert(
      'Supprimer l’historique',
      `Voulez-vous supprimer définitivement ${archivedCount} liste${plural(archivedCount)} archivée${plural(archivedCount)} ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => void handleDeleteHistory(),
        },
      ]
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenTop title="Paramètres" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset }]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Les données restent stockées uniquement sur cet appareil, aucune connexion n’est requise.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apparence</Text>
          <Text style={styles.sectionText}>
            Choisissez le thème de l’application ou suivez le réglage du système.
          </Text>

          <View style={styles.themeOptions}>
            {THEME_OPTIONS.map((option) => {
              const selected = preference === option.value;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityLabel={`Thème ${option.label.toLowerCase()}`}
                  accessibilityState={{ selected }}
                  onPress={() => setPreference(option.value)}
                  style={({ pressed }) => [
                    styles.themeOption,
                    selected && styles.themeOptionSelected,
                    pressed && !selected && styles.themeOptionPressed,
                  ]}>
                  <Text
                    style={[styles.themeOptionText, selected && styles.themeOptionTextSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historique</Text>
          <Text style={styles.sectionText}>{formatArchivedListCount(archivedCount)}</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Supprimer l’historique"
            accessibilityState={{ disabled: archivedCount === 0 }}
            onPress={confirmDeleteHistory}
            disabled={archivedCount === 0}
            style={({ pressed }) => [
              styles.deleteButton,
              archivedCount === 0 && styles.deleteButtonDisabled,
              pressed && archivedCount > 0 && styles.deleteButtonPressed,
            ]}>
            <Text
              style={[
                styles.deleteButtonText,
                archivedCount === 0 && styles.deleteButtonTextDisabled,
              ]}>
              Supprimer l’historique
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
