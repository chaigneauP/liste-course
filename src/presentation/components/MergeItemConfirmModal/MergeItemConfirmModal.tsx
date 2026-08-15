import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useFormModalStyles } from '@/presentation/components/FormModal/FormModal.styles';

type Props = {
  visible: boolean;
  itemName: string;
  itemQuantityLabel?: string;
  onCancel: () => void;
  onMerge: () => void;
  onDeclineMerge: () => void;
};

export function MergeItemConfirmModal({
  visible,
  itemName,
  itemQuantityLabel,
  onCancel,
  onMerge,
  onDeclineMerge,
}: Props) {
  const styles = useFormModalStyles();

  const description = itemQuantityLabel
    ? `« ${itemName} — ${itemQuantityLabel} » est déjà dans la liste. Fusionner les quantités ?`
    : `« ${itemName} » est déjà dans la liste. Fusionner ?`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <View style={[styles.sheet, styles.sheetCompact]}>
          <Text style={styles.title}>Article déjà présent</Text>
          <Text style={styles.subtitle}>{description}</Text>

          <View style={[styles.actions, styles.actionsCompact]}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onDeclineMerge}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              <Text style={styles.buttonText}>Ne pas fusionner</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onMerge}
              style={({ pressed }) => [
                styles.button,
                styles.submitButton,
                pressed && styles.submitButtonPressed,
              ]}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>Fusionner</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
