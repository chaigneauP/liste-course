import { useEffect, useState } from 'react';
import { View } from 'react-native';

import type { AisleLearningDecision } from '@/domain/entities/aisleDictionary';
import {
  AUTO_AISLE_LABEL,
  ITEM_AISLE_LABELS,
  ITEM_AISLE_ORDER,
  type ItemAisle,
  type ItemDetails,
  type ItemUnit,
} from '@/domain/entities/item';
import { DropdownField } from '@/presentation/components/DropdownField';
import { FormModal } from '@/presentation/components/FormModal';
import { MoveAisleConfirmModal } from '@/presentation/components/MoveAisleConfirmModal';
import { TextField } from '@/presentation/components/TextField';

import { useItemFormModalStyles } from './ItemFormModal.styles';

const UNIT_OPTIONS: { value: ItemUnit; label: string }[] = [
  { value: 'piece', label: 'unité' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'ml', label: 'mL' },
  { value: 'l', label: 'L' },
];

const AISLE_OPTIONS: { value: ItemAisle | undefined; label: string }[] = ITEM_AISLE_ORDER.map(
  (key) =>
    key === 'auto'
      ? { value: undefined, label: AUTO_AISLE_LABEL }
      : { value: key, label: ITEM_AISLE_LABELS[key] }
);

const DEFAULT_UNIT: ItemUnit = 'piece';

export type ItemFormSubmitOptions = {
  overwriteAisle: boolean;
};

type MovePrompt = {
  itemName: string;
  previousAisle: ItemAisle;
  nextAisle: ItemAisle;
};

type Props = {
  visible: boolean;
  mode: 'create' | 'edit';
  initialDetails: ItemDetails;
  onCancel: () => void;
  onSubmit: (details: ItemDetails, options: ItemFormSubmitOptions) => void;
  onSuggestAisle?: (name: string) => Promise<ItemAisle | undefined>;
  onEvaluateAisleLearning?: (
    name: string,
    aisle: ItemAisle | undefined
  ) => Promise<AisleLearningDecision>;
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
  aisle: ItemAisle | undefined,
  quantityText: string,
  unit: ItemUnit,
  note: string
): ItemDetails {
  const details: ItemDetails = { name: name.trim() };
  const quantity = parseQuantityField(quantityText);

  if (aisle !== undefined) {
    details.aisle = aisle;
  }

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
  onSuggestAisle,
  onEvaluateAisleLearning,
}: Props) {
  const styles = useItemFormModalStyles();
  const [aisle, setAisle] = useState<ItemAisle | undefined>(initialDetails.aisle);
  const [aisleLocked, setAisleLocked] = useState(false);
  const [consentOverwrite, setConsentOverwrite] = useState(false);
  const [movePrompt, setMovePrompt] = useState<MovePrompt | null>(null);
  const [name, setName] = useState(initialDetails.name);
  const [quantityText, setQuantityText] = useState(quantityToFieldValue(initialDetails.quantity));
  const [unit, setUnit] = useState<ItemUnit>(initialDetails.unit ?? DEFAULT_UNIT);
  const [note, setNote] = useState(initialDetails.note ?? '');

  useEffect(() => {
    if (visible) {
      setAisle(initialDetails.aisle);
      setAisleLocked(mode === 'edit' && initialDetails.aisle !== undefined);
      setConsentOverwrite(false);
      setMovePrompt(null);
      setName(initialDetails.name);
      setQuantityText(quantityToFieldValue(initialDetails.quantity));
      setUnit(initialDetails.unit ?? DEFAULT_UNIT);
      setNote(initialDetails.note ?? '');
    }
  }, [visible, initialDetails, mode]);

  useEffect(() => {
    if (!visible || !onSuggestAisle || aisleLocked) {
      return;
    }

    const trimmed = name.trim();
    if (!trimmed) {
      setAisle(undefined);
      setConsentOverwrite(false);
      return;
    }

    let cancelled = false;
    void onSuggestAisle(trimmed).then((suggested) => {
      if (!cancelled) {
        setAisle(suggested);
        setConsentOverwrite(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [visible, name, onSuggestAisle, aisleLocked]);

  const canSubmit = name.trim().length > 0;

  function applyAisle(value: ItemAisle | undefined, overwrite: boolean) {
    setAisle(value);
    setAisleLocked(true);
    setConsentOverwrite(overwrite);
  }

  async function handleAisleChange(value: ItemAisle | undefined) {
    const trimmed = name.trim();

    if (!trimmed || value === undefined) {
      applyAisle(value, false);
      return;
    }

    if (!onEvaluateAisleLearning) {
      applyAisle(value, false);
      return;
    }

    const decision = await onEvaluateAisleLearning(trimmed, value);

    if (decision.type === 'confirm') {
      setMovePrompt({
        itemName: trimmed,
        previousAisle: decision.previousAisle,
        nextAisle: decision.nextAisle,
      });
      return;
    }

    applyAisle(value, false);
  }

  function handleMoveConfirm() {
    if (!movePrompt) {
      return;
    }
    applyAisle(movePrompt.nextAisle, true);
    setMovePrompt(null);
  }

  function handleMoveCancel() {
    setMovePrompt(null);
  }

  function handleSubmit() {
    if (canSubmit) {
      onSubmit(buildDetails(name, aisle, quantityText, unit, note), {
        overwriteAisle: consentOverwrite,
      });
    }
  }

  return (
    <>
      <FormModal
        visible={visible}
        title={mode === 'create' ? 'Nouvel article' : 'Modifier l’article'}
        submitLabel="Valider"
        submitDisabled={!canSubmit}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      >
        <DropdownField
          accessibilityLabel="Choisir le rayon"
          value={aisle}
          options={AISLE_OPTIONS}
          onChange={(value) => void handleAisleChange(value)}
          parentVisible={visible}
          fullWidth
          scrollable
        />
        <TextField
          value={name}
          onChangeText={setName}
          placeholder="Ex. : Lait, pain, tomates…"
          autoFocus
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
            <DropdownField
              accessibilityLabel="Choisir l’unité"
              value={unit}
              options={UNIT_OPTIONS}
              onChange={setUnit}
              parentVisible={visible}
            />
          </View>
        </View>

        <TextField value={note} onChangeText={setNote} placeholder="Précision : bio, marque…" />
      </FormModal>

      <MoveAisleConfirmModal
        visible={movePrompt !== null}
        itemName={movePrompt?.itemName ?? ''}
        previousAisle={movePrompt?.previousAisle ?? 'produce'}
        nextAisle={movePrompt?.nextAisle ?? 'produce'}
        onCancel={handleMoveCancel}
        onConfirm={handleMoveConfirm}
      />
    </>
  );
}
