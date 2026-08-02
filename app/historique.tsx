import { StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aucune liste sauvegardée</Text>
      <Text style={styles.text}>
        Les listes que vous archiverez depuis « Nouvelle liste » apparaîtront ici.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
  },
  text: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
