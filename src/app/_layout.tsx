import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { createAppContainer } from '@/infrastructure/createAppContainer';
import { createRootStackOptions } from '@/presentation/navigation/rootStackOptions';
import { UseCasesProvider } from '@/presentation/providers/UseCasesProvider';
import { ThemeProvider, useTheme } from '@/presentation/theme';

const useCases = createAppContainer();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function RootNavigator() {
  const theme = useTheme();

  return (
    <>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={createRootStackOptions(theme)}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="liste/[id]" />
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
