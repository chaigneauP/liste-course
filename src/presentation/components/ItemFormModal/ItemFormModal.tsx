import { useEffect, useState } from 'react';

import { FormModal } from '@/presentation/components/FormModal';
import { TextField } from '@/presentation/components/TextField';

type Props = {
  visible: boolean;
  mode: 'create' | 'edit';
  initialValue: string;
  onCancel: () => void;
  onSubmit: (name: string) => void;
};

export function ItemFormModal({ visible, mode, initialValue, onCancel, onSubmit }: Props) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (visible) {
      setValue(initialValue);
    }
  }, [visible, initialValue]);

  const canSubmit = value.trim().length > 0;

  function handleSubmit() {
    if (canSubmit) {
      onSubmit(value);
    }
  }

  return (
    <FormModal
      visible={visible}
      title={mode === 'create' ? 'Nouvel article' : 'Modifier l’article'}
      submitLabel="Valider"
      submitDisabled={!canSubmit}
      onCancel={onCancel}
      onSubmit={handleSubmit}>
      <TextField
        value={value}
        onChangeText={setValue}
        placeholder="Ex. : Lait, pain, tomates…"
        autoFocus
        onSubmitEditing={handleSubmit}
      />
    </FormModal>
  );
}
