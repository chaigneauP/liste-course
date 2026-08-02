import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { deleteArchivedLists, loadLists } from '../lib/storage';

export default function SettingsScreen() {
  const [archivedCount, setArchivedCount] = useState(0);

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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  sectionText: {
    fontSize: 14,
    color: '#64748b',
  },
  deleteButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  deleteButtonDisabled: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  deleteButtonPressed: {
    backgroundColor: '#fee2e2',
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
  },
  deleteButtonTextDisabled: {
    color: '#94a3b8',
  },
});
