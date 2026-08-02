import { useEffect, useState } from 'react';

import { MAX_LIST_TITLE_LENGTH } from '@/domain/entities/listTitle';
import { FormModal } from '@/presentation/components/FormModal';
import { TextField } from '@/presentation/components/TextField';

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

  function handleSubmit() {
    if (canSubmit) {
      onSubmit(value.trim());
    }
  }

  return (
    <FormModal
      visible={visible}
      title="Nouvelle liste"
      subtitle="Donnez un titre à votre liste de courses."
      density="compact"
      submitLabel="Créer"
      submitDisabled={!canSubmit}
      onCancel={onCancel}
      onSubmit={handleSubmit}>
      <TextField
        value={value}
        onChangeText={setValue}
        placeholder="Ex. : Courses du samedi"
        maxLength={MAX_LIST_TITLE_LENGTH}
        showCounter
        autoFocus
        onSubmitEditing={handleSubmit}
      />
    </FormModal>
  );
}
