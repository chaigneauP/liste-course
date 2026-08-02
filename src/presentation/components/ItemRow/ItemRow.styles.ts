import { makeStyles } from '@/presentation/theme';

export const useItemRowStyles = makeStyles(({ colors, spacing, radius, opacity }) => ({
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
    backgroundColor: colors.surfaceMuted,
  },
  actionDefaultPressed: {
    backgroundColor: colors.surfacePressed,
  },
  actionDisabled: {
    backgroundColor: colors.surfaceMuted,
    opacity: opacity.disabled,
  },
  deleteActionDefault: {
    backgroundColor: colors.dangerSurface,
  },
  deleteActionDefaultPressed: {
    backgroundColor: colors.dangerSurfacePressed,
  },
}));
