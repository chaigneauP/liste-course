import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { createAppContainer } from '@/infrastructure/createAppContainer';
import { createRootStackOptions } from '@/presentation/navigation/rootStackOptions';
import { UseCasesProvider } from '@/presentation/providers/UseCasesProvider';
import { ThemeProvider, useTheme } from '@/presentation/theme';

const useCases = createAppContainer();

function RootNavigator() {
  const theme = useTheme();

  return (
    <>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={createRootStackOptions(theme)}>
        <Stack.Screen name="index" options={{ title: 'Accueil' }} />
        <Stack.Screen name="liste/[id]" options={{ title: 'Liste' }} />
        <Stack.Screen name="historique" options={{ title: 'Historique' }} />
        <Stack.Screen name="parametres" options={{ title: 'Paramètres' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <UseCasesProvider useCases={useCases}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </UseCasesProvider>
  );
}
