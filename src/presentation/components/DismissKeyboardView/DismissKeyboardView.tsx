import type { ReactNode } from 'react';
import { Keyboard, View, type StyleProp, type ViewStyle } from 'react-native';

import { useDismissKeyboardViewStyles } from './DismissKeyboardView.styles';

type Props = {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function DismissKeyboardView({ style, children }: Props) {
  const styles = useDismissKeyboardViewStyles();

  function handleTouchOutside() {
    Keyboard.dismiss();
    return false;
  }

  return (
    <View style={[styles.root, style]} onStartShouldSetResponder={handleTouchOutside}>
      {children}
    </View>
  );
}
