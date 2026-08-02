import { makeStyles } from '@/presentation/theme';

export const useItemRowStyles = makeStyles(({ colors, spacing, radius }) => ({
  actions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  action: {
    padding: spacing[2],
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDefault: {
    backgroundColor: colors.btnSecondaryBgHover,
  },
  actionDefaultPressed: {
    backgroundColor: colors.border,
  },
  actionDisabled: {
    backgroundColor: colors.btnSecondaryBgHover,
    opacity: 0.7,
  },
  deleteActionDefault: {
    backgroundColor: colors.dangerSurface,
  },
  deleteActionDefaultPressed: {
    backgroundColor: colors.dangerSurfacePressed,
  },
}));
