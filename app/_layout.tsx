import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTitleStyle: { color: '#0f172a' },
          headerTintColor: '#2563eb',
          contentStyle: { backgroundColor: '#f1f5f9' },
        }}>
        <Stack.Screen name="index" options={{ title: 'Accueil' }} />
        <Stack.Screen name="liste/[id]" options={{ title: 'Liste' }} />
        <Stack.Screen name="historique" options={{ title: 'Historique' }} />
        <Stack.Screen name="parametres" options={{ title: 'Paramètres' }} />
      </Stack>
    </>
  );
}
