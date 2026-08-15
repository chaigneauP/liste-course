import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ITEM_AISLE_LABELS, type ItemAisle } from '@/domain/entities/item';
import { useFormModalStyles } from '@/presentation/components/FormModal/FormModal.styles';
import { useTheme } from '@/presentation/theme';

import { useMoveAisleConfirmModalStyles } from './MoveAisleConfirmModal.styles';

type Props = {
  visible: boolean;
  itemName: string;
  previousAisle: ItemAisle;
  nextAisle: ItemAisle;
  onCancel: () => void;
  onConfirm: () => void;
};

export function MoveAisleConfirmModal({
  visible,
  itemName,
  previousAisle,
  nextAisle,
  onCancel,
  onConfirm,
}: Props) {
  const formStyles = useFormModalStyles();
  const alertStyles = useMoveAisleConfirmModalStyles();
  const { colors } = useTheme();

  const previousLabel = ITEM_AISLE_LABELS[previousAisle];
  const nextLabel = ITEM_AISLE_LABELS[nextAisle];
  const description = `L’article « ${itemName} » est déjà présent dans la catégorie « ${previousLabel} ». Souhaitez-vous le déplacer vers « ${nextLabel} » pour les prochaines saisies ?`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={formStyles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <View style={[formStyles.sheet, formStyles.sheetCompact]}>
          <View style={alertStyles.attentionRow}>
            <Ionicons name="warning" size={18} color={colors.danger} />
            <Text style={alertStyles.attentionLabel}>Attention</Text>
          </View>

          <Text style={formStyles.title}>Déplacer l’article ?</Text>
          <Text style={formStyles.subtitle}>{description}</Text>

          <View style={[formStyles.actions, formStyles.actionsCompact]}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [formStyles.button, pressed && formStyles.buttonPressed]}
            >
              <Text style={formStyles.buttonText}>Annuler</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [
                formStyles.button,
                formStyles.submitButton,
                pressed && formStyles.submitButtonPressed,
              ]}
            >
              <Text style={[formStyles.buttonText, formStyles.submitButtonText]}>Valider</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
