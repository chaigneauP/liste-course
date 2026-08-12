import { Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

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
  onSubmitEditing?: () => void;
};

export function TextField({
  value,
  onChangeText,
  placeholder,
  maxLength,
  showCounter = false,
  autoFocus = false,
  keyboardType,
  onSubmitEditing,
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
        onSubmitEditing={onSubmitEditing}
      />

      {counterVisible ? (
        <Text style={[styles.counter, value.length >= maxLength && styles.counterAtLimit]}>
          {value.length} / {maxLength}
        </Text>
      ) : null}
    </View>
  );
}
