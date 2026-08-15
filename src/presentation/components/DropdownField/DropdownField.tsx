import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { ContextMenuAnchor } from '@/presentation/components/ContextMenu';
import { useTheme } from '@/presentation/theme';

import { dropdownFieldMetrics, useDropdownFieldStyles } from './DropdownField.styles';

export type DropdownOption<T> = {
  value: T;
  label: string;
};

type Props<T> = {
  accessibilityLabel: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  parentVisible?: boolean;
  fullWidth?: boolean;
  scrollable?: boolean;
};

function isSameValue<T>(left: T, right: T): boolean {
  return left === right;
}

export function DropdownField<T>({
  accessibilityLabel,
  value,
  options,
  onChange,
  parentVisible = true,
  fullWidth = false,
  scrollable = false,
}: Props<T>) {
  const styles = useDropdownFieldStyles();
  const { colors } = useTheme();
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<ContextMenuAnchor | null>(null);

  useEffect(() => {
    if (!parentVisible) {
      setOpen(false);
    }
  }, [parentVisible]);

  const selectedLabel =
    options.find((option) => isSameValue(option.value, value))?.label ?? options[0]?.label ?? '';

  function closeMenu() {
    setOpen(false);
  }

  function openMenu() {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  }

  function handleSelect(nextValue: T) {
    onChange(nextValue);
    closeMenu();
  }

  const menuTop = anchor != null ? anchor.y + anchor.height + dropdownFieldMetrics.gap : 0;

  function renderOptions() {
    return options.map((option) => {
      const selected = isSameValue(option.value, value);
      return (
        <Pressable
          key={option.label}
          accessibilityRole="button"
          accessibilityState={{ selected }}
          onPress={() => handleSelect(option.value)}
          style={({ pressed }) => [
            styles.option,
            selected && styles.optionSelected,
            pressed && styles.optionPressed,
          ]}
        >
          <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
            {option.label}
          </Text>
        </Pressable>
      );
    });
  }

  return (
    <>
      <View ref={triggerRef} style={[styles.field, fullWidth && styles.fieldFullWidth]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ expanded: open }}
          onPress={openMenu}
          style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
        >
          <Text style={styles.triggerText}>{selectedLabel}</Text>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.icon} />
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="none" onRequestClose={closeMenu}>
        <View style={styles.overlay} pointerEvents="box-none">
          <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />

          {anchor ? (
            <View
              style={[
                styles.menu,
                {
                  top: menuTop,
                  left: anchor.x,
                  width: anchor.width,
                },
              ]}
            >
              {scrollable ? (
                <ScrollView
                  style={styles.menuScroll}
                  showsVerticalScrollIndicator
                  keyboardShouldPersistTaps="handled"
                  bounces={false}
                >
                  {renderOptions()}
                </ScrollView>
              ) : (
                renderOptions()
              )}
            </View>
          ) : null}
        </View>
      </Modal>
    </>
  );
}
