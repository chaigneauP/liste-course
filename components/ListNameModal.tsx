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

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (name: string) => void;
};

export function ListNameModal({ visible, onCancel, onSubmit }: Props) {
  const [value, setValue] = useState('');

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
              placeholderTextColor="#94a3b8"
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  inputGroup: {
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  counter: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
  },
  counterAtLimit: {
    color: '#dc2626',
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
    backgroundColor: '#f1f5f9',
  },
  buttonPressed: {
    backgroundColor: '#e2e8f0',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  submitButton: {
    backgroundColor: '#2563eb',
  },
  submitButtonPressed: {
    backgroundColor: '#1d4ed8',
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    color: '#ffffff',
  },
});
