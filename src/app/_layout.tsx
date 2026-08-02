import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { createAppContainer } from '@/infrastructure/createAppContainer';
import { createRootStackOptions } from '@/presentation/navigation/rootStackOptions';
import { UseCasesProvider } from '@/presentation/providers/UseCasesProvider';
import { ThemeProvider, useTheme } from '@/presentation/theme';

void SplashScreen.preventAutoHideAsync();

const useCases = createAppContainer();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function SplashScreenController() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return null;
}

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
        <SplashScreenController />
        <RootNavigator />
      </ThemeProvider>
    </UseCasesProvider>
  );
}
