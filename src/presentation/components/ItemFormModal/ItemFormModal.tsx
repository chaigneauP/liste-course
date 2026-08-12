import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { ItemDetails, ItemUnit } from '@/domain/entities/item';
import { FormModal } from '@/presentation/components/FormModal';
import { TextField } from '@/presentation/components/TextField';
import { useTheme } from '@/presentation/theme';

import { useItemFormModalStyles } from './ItemFormModal.styles';

const UNIT_OPTIONS: { value: ItemUnit; label: string }[] = [
  { value: 'piece', label: 'unité' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'ml', label: 'mL' },
  { value: 'l', label: 'L' },
];

const DEFAULT_UNIT: ItemUnit = 'piece';

type Props = {
  visible: boolean;
  mode: 'create' | 'edit';
  initialDetails: ItemDetails;
  onCancel: () => void;
  onSubmit: (details: ItemDetails) => void;
};

function quantityToFieldValue(quantity: number | undefined): string {
  return quantity === undefined ? '' : String(quantity);
}

function parseQuantityField(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed.replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function buildDetails(
  name: string,
  quantityText: string,
  unit: ItemUnit,
  note: string
): ItemDetails {
  const details: ItemDetails = { name: name.trim() };
  const quantity = parseQuantityField(quantityText);

  if (quantity !== undefined) {
    details.quantity = quantity;
    details.unit = unit;
  }

  if (note.trim()) {
    details.note = note;
  }

  return details;
}

export function ItemFormModal({
  visible,
  mode,
  initialDetails,
  onCancel,
  onSubmit,
}: Props) {
  const styles = useItemFormModalStyles();
  const { colors } = useTheme();
  const [name, setName] = useState(initialDetails.name);
  const [quantityText, setQuantityText] = useState(quantityToFieldValue(initialDetails.quantity));
  const [unit, setUnit] = useState<ItemUnit>(initialDetails.unit ?? DEFAULT_UNIT);
  const [note, setNote] = useState(initialDetails.note ?? '');
  const [unitMenuOpen, setUnitMenuOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(initialDetails.name);
      setQuantityText(quantityToFieldValue(initialDetails.quantity));
      setUnit(initialDetails.unit ?? DEFAULT_UNIT);
      setNote(initialDetails.note ?? '');
      setUnitMenuOpen(false);
    }
  }, [visible, initialDetails]);

  const canSubmit = name.trim().length > 0;

  function handleSubmit() {
    if (canSubmit) {
      onSubmit(buildDetails(name, quantityText, unit, note));
    }
  }

  function handleSelectUnit(nextUnit: ItemUnit) {
    setUnit(nextUnit);
    setUnitMenuOpen(false);
  }

  const selectedUnitLabel =
    UNIT_OPTIONS.find((option) => option.value === unit)?.label ?? UNIT_OPTIONS[0].label;

  return (
    <FormModal
      visible={visible}
      title={mode === 'create' ? 'Nouvel article' : 'Modifier l’article'}
      submitLabel="Valider"
      submitDisabled={!canSubmit}
      onCancel={onCancel}
      onSubmit={handleSubmit}>
      <TextField
        value={name}
        onChangeText={setName}
        placeholder="Ex. : Lait, pain, tomates…"
        autoFocus
        onSubmitEditing={handleSubmit}
      />

      <View style={styles.qtyUnitRow}>
        <View style={styles.qtyField}>
          <TextField
            value={quantityText}
            onChangeText={setQuantityText}
            placeholder="Qté"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.unitField}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choisir l’unité"
            accessibilityState={{ expanded: unitMenuOpen }}
            onPress={() => setUnitMenuOpen((open) => !open)}
            style={({ pressed }) => [styles.unitTrigger, pressed && styles.unitTriggerPressed]}>
            <Text style={styles.unitTriggerText}>{selectedUnitLabel}</Text>
            <Ionicons
              name={unitMenuOpen ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.icon}
            />
          </Pressable>

          {unitMenuOpen ? (
            <View style={styles.unitMenu}>
              {UNIT_OPTIONS.map((option) => {
                const selected = option.value === unit;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => handleSelectUnit(option.value)}
                    style={({ pressed }) => [
                      styles.unitOption,
                      selected && styles.unitOptionSelected,
                      pressed && styles.unitOptionPressed,
                    ]}>
                    <Text
                      style={[
                        styles.unitOptionText,
                        selected && styles.unitOptionTextSelected,
                      ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>
      </View>

      <TextField
        value={note}
        onChangeText={setNote}
        placeholder="Précision : bio, marque…"
      />
    </FormModal>
  );
}
