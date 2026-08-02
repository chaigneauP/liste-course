import type { Stack } from 'expo-router';
import type { ComponentProps } from 'react';

import type { Theme } from '@/presentation/theme';

type StackScreenOptions = NonNullable<ComponentProps<typeof Stack>['screenOptions']>;

export function createRootStackOptions({ colors }: Theme): StackScreenOptions {
  return {
    headerStyle: { backgroundColor: colors.surface },
    headerTitleStyle: { color: colors.textPrimary },
    headerTintColor: colors.btnSecondaryIcon,
    contentStyle: { backgroundColor: colors.bg },
  };
}
