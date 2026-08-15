import { Keyboard, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { useTheme } from '@/presentation/theme';

import { useTextFieldStyles } from './TextField.styles';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  maxLength?: number;
  /** Affiche un compteur « saisi / maximum », nécessite `maxLength`. */
  showCounter?: boolean;
  autoFocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

export function TextField({
  value,
  onChangeText,
  placeholder,
  maxLength,
  showCounter = false,
  autoFocus = false,
  keyboardType,
}: Props) {
  const styles = useTextFieldStyles();
  const { colors } = useTheme();
  const counterVisible = showCounter && maxLength !== undefined;

  return (
    <View style={styles.group}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        maxLength={maxLength}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />

      {counterVisible ? (
        <Text style={[styles.counter, value.length >= maxLength && styles.counterAtLimit]}>
          {value.length} / {maxLength}
        </Text>
      ) : null}
    </View>
  );
}
