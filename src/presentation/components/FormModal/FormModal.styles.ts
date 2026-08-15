import { makeStyles } from '@/presentation/theme';

export const useFormModalStyles = makeStyles(
  ({ colors, spacing, radius, typography, opacity }) => ({
    backdrop: {
      flex: 1,
      justifyContent: 'center',
      padding: spacing[6],
      backgroundColor: colors.overlay,
    },
    sheet: {
      backgroundColor: colors.surface,
      borderRadius: radius['2xl'],
      padding: spacing[5],
    },
    sheetRegular: {
      gap: spacing[4],
    },
    sheetCompact: {
      gap: spacing[3],
    },
    title: {
      ...typography.modalTitle,
      color: colors.textPrimary,
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing[2.5],
    },
    actionsCompact: {
      marginTop: spacing[1],
    },
    button: {
      paddingVertical: spacing[2.5],
      paddingHorizontal: spacing[4.5],
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.btnSecondaryBg,
    },
    buttonPressed: {
      backgroundColor: colors.surfacePressed,
    },
    buttonText: {
      ...typography.button,
      color: colors.btnSecondaryIcon,
    },
    submitButton: {
      backgroundColor: colors.btnPrimaryBg,
      borderColor: colors.btnPrimaryBg,
    },
    submitButtonPressed: {
      backgroundColor: colors.btnPrimaryBgHover,
      borderColor: colors.btnPrimaryBgHover,
    },
    submitButtonDisabled: {
      opacity: opacity.disabled,
    },
    submitButtonText: {
      color: colors.btnPrimaryIcon,
    },
  })
);
