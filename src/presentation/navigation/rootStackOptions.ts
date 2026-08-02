import type { Stack } from 'expo-router';
import type { ComponentProps } from 'react';

import type { Theme } from '@/presentation/theme';

type StackScreenOptions = NonNullable<ComponentProps<typeof Stack>['screenOptions']>;

export function createRootStackOptions({ colors }: Theme): StackScreenOptions {
  return {
    headerShown: false,
    contentStyle: { backgroundColor: colors.bg },
  };
}
