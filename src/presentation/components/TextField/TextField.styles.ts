import { makeStyles } from '@/presentation/theme';

export const useTextFieldStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  group: {
    gap: spacing[1.5],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[3.5],
    paddingVertical: spacing[3],
    ...typography.input,
    color: colors.textPrimary,
  },
  counter: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  counterAtLimit: {
    color: colors.danger,
    fontWeight: '600',
  },
}));
