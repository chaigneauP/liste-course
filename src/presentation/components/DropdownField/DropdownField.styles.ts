import { makeStyles } from '@/presentation/theme';
import { spacing } from '@/presentation/theme/tokens';

export const dropdownFieldMetrics = {
  gap: spacing[1],
  maxMenuHeight: 240,
} as const;

export const useDropdownFieldStyles = makeStyles(
  ({ colors, spacing: space, radius, typography, shadow }) => ({
    field: {
      position: 'relative',
    },
    fieldFullWidth: {
      alignSelf: 'stretch',
    },
    trigger: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      paddingHorizontal: space[3],
      paddingVertical: space[3],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: space[1],
    },
    triggerPressed: {
      backgroundColor: colors.surfacePressed,
    },
    triggerText: {
      ...typography.input,
      color: colors.textPrimary,
      flex: 1,
    },
    overlay: {
      flex: 1,
    },
    menu: {
      position: 'absolute',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      overflow: 'hidden',
      ...shadow.menu,
    },
    menuScroll: {
      maxHeight: dropdownFieldMetrics.maxMenuHeight,
    },
    option: {
      paddingHorizontal: space[3.5],
      paddingVertical: space[2.5],
    },
    optionPressed: {
      backgroundColor: colors.surfacePressed,
    },
    optionSelected: {
      backgroundColor: colors.surfacePressed,
    },
    optionText: {
      ...typography.input,
      color: colors.textPrimary,
    },
    optionTextSelected: {
      fontWeight: '600',
    },
  })
);
