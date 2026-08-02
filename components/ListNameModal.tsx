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

import { MAX_LIST_TITLE_LENGTH } from '../lib/listTitle';
import { makeStyles } from '../theme/makeStyles';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (name: string) => void;
};

export function ListNameModal({ visible, onCancel, onSubmit }: Props) {
  const [value, setValue] = useState('');
  const styles = useStyles();
  const { colors } = useTheme();

  useEffect(() => {
    if (visible) {
      setValue('');
    }
  }, [visible]);

  const canSubmit = value.trim().length > 0;
  const atLimit = value.length >= MAX_LIST_TITLE_LENGTH;

  function handleChangeText(text: string) {
    setValue(text.slice(0, MAX_LIST_TITLE_LENGTH));
  }

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }
    onSubmit(value.trim());
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <View style={styles.sheet}>
          <Text style={styles.title}>Nouvelle liste</Text>
          <Text style={styles.subtitle}>Donnez un titre à votre liste de courses.</Text>

          <View style={styles.inputGroup}>
            <TextInput
              value={value}
              onChangeText={handleChangeText}
              placeholder="Ex. : Courses du samedi"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              maxLength={MAX_LIST_TITLE_LENGTH}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            <Text style={[styles.counter, atLimit && styles.counterAtLimit]}>
              {value.length} / {MAX_LIST_TITLE_LENGTH}
            </Text>
          </View>

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
              <Text style={[styles.buttonText, styles.submitButtonText]}>Créer</Text>
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
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  inputGroup: {
    gap: 6,
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
  counter: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  counterAtLimit: {
    color: colors.danger,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
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
