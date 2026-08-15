import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { DismissKeyboardView } from '@/presentation/components/DismissKeyboardView';

import { useFormModalStyles } from './FormModal.styles';
import { useKeyboardHeight } from './useKeyboardHeight';

type Props = {
  visible: boolean;
  title: string;
  subtitle?: string;
  /** `compact` resserre la feuille quand elle contient un sous-titre. */
  density?: 'regular' | 'compact';
  /** Remonte la feuille au-dessus du clavier lorsqu'il est ouvert. */
  avoidKeyboard?: boolean;
  submitLabel: string;
  cancelLabel?: string;
  submitDisabled?: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  children: ReactNode;
};

export function FormModal({
  visible,
  title,
  subtitle,
  density = 'regular',
  avoidKeyboard = false,
  submitLabel,
  cancelLabel = 'Annuler',
  submitDisabled = false,
  onCancel,
  onSubmit,
  children,
}: Props) {
  const styles = useFormModalStyles();
  const compact = density === 'compact';
  const keyboardHeight = useKeyboardHeight(avoidKeyboard);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <DismissKeyboardView
        style={[styles.backdrop, keyboardHeight > 0 && { paddingBottom: keyboardHeight }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <View style={[styles.sheet, compact ? styles.sheetCompact : styles.sheetRegular]}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

          {children}

          <View style={[styles.actions, compact && styles.actionsCompact]}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              <Text style={styles.buttonText}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={submitDisabled}
              onPress={onSubmit}
              style={({ pressed }) => [
                styles.button,
                styles.submitButton,
                pressed && styles.submitButtonPressed,
                submitDisabled && styles.submitButtonDisabled,
              ]}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>{submitLabel}</Text>
            </Pressable>
          </View>
        </View>
      </DismissKeyboardView>
    </Modal>
  );
}
