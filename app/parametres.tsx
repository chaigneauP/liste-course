import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { deleteArchivedLists, loadLists } from '../lib/storage';
import { makeStyles } from '../theme/makeStyles';
import { useTheme, type ThemePreference } from '../theme/ThemeProvider';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'system', label: 'Automatique' },
];

export default function SettingsScreen() {
  const [archivedCount, setArchivedCount] = useState(0);
  const styles = useStyles();
  const { preference, setPreference } = useTheme();

  const refreshCount = useCallback(async () => {
    const lists = await loadLists();
    setArchivedCount(lists.filter((list) => list.status === 'archived').length);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshCount();
    }, [refreshCount])
  );

  function confirmDeleteHistory() {
    if (archivedCount === 0) {
      Alert.alert('Historique vide', 'Aucune liste archivée à supprimer.');
      return;
    }

    Alert.alert(
      'Supprimer l’historique',
      `Voulez-vous supprimer définitivement ${archivedCount} liste${archivedCount > 1 ? 's' : ''} archivée${archivedCount > 1 ? 's' : ''} ? Cette action est irréversible.`,
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

  async function handleDeleteHistory() {
    const deletedCount = await deleteArchivedLists();
    await refreshCount();

    if (deletedCount > 0) {
      Alert.alert(
        'Historique supprimé',
        `${deletedCount} liste${deletedCount > 1 ? 's' : ''} archivée${deletedCount > 1 ? 's' : ''} supprimée${deletedCount > 1 ? 's' : ''}.`
      );
    }
  }

  return (
    <View style={styles.screen}>
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
        <Text style={styles.sectionText}>
          {archivedCount === 0
            ? 'Aucune liste archivée.'
            : `${archivedCount} liste${archivedCount > 1 ? 's' : ''} archivée${archivedCount > 1 ? 's' : ''}.`}
        </Text>

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
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  screen: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.btnSecondaryBg,
    alignItems: 'center',
  },
  themeOptionPressed: {
    backgroundColor: colors.btnSecondaryBgHover,
  },
  themeOptionSelected: {
    backgroundColor: colors.btnPrimaryBg,
    borderColor: colors.btnPrimaryBg,
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.btnSecondaryIcon,
  },
  themeOptionTextSelected: {
    color: colors.btnPrimaryIcon,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.dangerSurface,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  deleteButtonDisabled: {
    backgroundColor: colors.btnSecondaryBgHover,
    borderColor: colors.border,
  },
  deleteButtonPressed: {
    backgroundColor: colors.dangerSurfacePressed,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.danger,
  },
  deleteButtonTextDisabled: {
    color: colors.textSecondary,
  },
}));
