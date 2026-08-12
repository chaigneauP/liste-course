import { makeStyles } from '@/presentation/theme';

export const useSettingsScreenStyles = makeStyles(
  ({ colors, spacing, radius, typography }) => ({
    screen: {
      flex: 1,
    },
    content: {
      paddingHorizontal: spacing[5],
      gap: spacing[6],
    },
    description: {
      ...typography.bodyRelaxed,
      color: colors.textSecondary,
    },
    section: {
      gap: spacing[3],
    },
    sectionTitle: {
      ...typography.sectionTitle,
      color: colors.textPrimary,
    },
    sectionText: {
      ...typography.body,
      color: colors.textSecondary,
    },
    themeOptions: {
      flexDirection: 'row',
      gap: spacing[2],
    },
    themeOption: {
      flex: 1,
      paddingVertical: spacing[2.5],
      paddingHorizontal: spacing[3],
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.btnSecondaryBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeOptionPressed: {
      backgroundColor: colors.surfacePressed,
    },
    themeOptionSelected: {
      backgroundColor: colors.btnPrimaryBg,
      borderColor: colors.btnPrimaryBg,
    },
    themeOptionText: {
      ...typography.buttonSmall,
      fontSize: 13,
      color: colors.btnSecondaryIcon,
      width: '100%',
      textAlign: 'center',
    },
    themeOptionTextSelected: {
      color: colors.btnPrimaryIcon,
    },
    actionButton: {
      alignSelf: 'flex-start',
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      borderRadius: radius.md,
      backgroundColor: colors.btnSecondaryBg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionButtonDisabled: {
      backgroundColor: colors.surfaceMuted,
    },
    actionButtonPressed: {
      backgroundColor: colors.surfacePressed,
    },
    actionButtonText: {
      ...typography.button,
      color: colors.btnSecondaryIcon,
    },
    actionButtonTextDisabled: {
      color: colors.textSecondary,
    },
    deleteButton: {
      alignSelf: 'flex-start',
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      borderRadius: radius.md,
      backgroundColor: colors.dangerSurface,
      borderWidth: 1,
      borderColor: colors.danger,
    },
    deleteButtonDisabled: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
    },
    deleteButtonPressed: {
      backgroundColor: colors.dangerSurfacePressed,
    },
    deleteButtonText: {
      ...typography.button,
      color: colors.danger,
    },
    deleteButtonTextDisabled: {
      color: colors.textSecondary,
    },
  })
);
