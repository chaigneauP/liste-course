import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_CONTENT_HEIGHT, CENTER_BUTTON_OVERHANG } from './CustomTabBar.styles';

export function useTabBarBottomInset(): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_CONTENT_HEIGHT + CENTER_BUTTON_OVERHANG + insets.bottom;
}
