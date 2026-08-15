import { makeStyles } from '@/presentation/theme';

export const useMoveAisleConfirmModalStyles = makeStyles(({ colors, spacing, typography }) => ({
  attentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing[1.5],
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2.5],
    borderRadius: spacing[2],
    backgroundColor: colors.dangerSurface,
  },
  attentionLabel: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '600',
  },
}));
