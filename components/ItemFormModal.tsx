import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { makeStyles } from '../theme/makeStyles';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
  visible: boolean;
  mode: 'create' | 'edit';
  initialValue: string;
  onCancel: () => void;
  onSubmit: (name: string) => void;
};

export function ItemFormModal({ visible, mode, initialValue, onCancel, onSubmit }: Props) {
  const [value, setValue] = useState(initialValue);
  const styles = useStyles();
  const { colors } = useTheme();

  useEffect(() => {
    if (visible) {
      setValue(initialValue);
    }
  }, [visible, initialValue]);

  const canSubmit = value.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }
    onSubmit(value);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <View style={styles.sheet}>
          <Text style={styles.title}>
            {mode === 'create' ? 'Nouvel article' : 'Modifier l’article'}
          </Text>

          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="Ex. : Lait, pain, tomates…"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
              <Text style={styles.buttonText}>Annuler</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={!canSubmit}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.button,
                styles.submitButton,
                pressed && styles.submitButtonPressed,
                !canSubmit && styles.submitButtonDisabled,
              ]}>
              <Text style={[styles.buttonText, styles.submitButtonText]}>Valider</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const useStyles = makeStyles((colors) => ({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.btnSecondaryBg,
  },
  buttonPressed: {
    backgroundColor: colors.btnSecondaryBgHover,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.btnSecondaryIcon,
  },
  submitButton: {
    backgroundColor: colors.btnPrimaryBg,
    borderColor: colors.btnPrimaryBg,
  },
  submitButtonPressed: {
    backgroundColor: colors.btnPrimaryBgHover,
    borderColor: colors.btnPrimaryBgHover,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: colors.btnPrimaryIcon,
  },
}));
