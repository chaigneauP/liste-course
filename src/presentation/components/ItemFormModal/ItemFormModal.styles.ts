import { makeStyles } from '@/presentation/theme';

export const useItemFormModalStyles = makeStyles(({ colors, spacing, radius, typography, shadow }) => ({
  qtyUnitRow: {
    flexDirection: 'row',
    gap: spacing[2.5],
    alignItems: 'flex-start',
  },
  qtyField: {
    flex: 1,
  },
  unitField: {
    width: 88,
  },
  unitTrigger: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[1],
  },
  unitTriggerPressed: {
    backgroundColor: colors.surfacePressed,
  },
  unitTriggerText: {
    ...typography.input,
    color: colors.textPrimary,
  },
  unitMenu: {
    marginTop: spacing[1],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadow.menu,
  },
  unitOption: {
    paddingHorizontal: spacing[3.5],
    paddingVertical: spacing[2.5],
  },
  unitOptionPressed: {
    backgroundColor: colors.surfacePressed,
  },
  unitOptionSelected: {
    backgroundColor: colors.surfacePressed,
  },
  unitOptionText: {
    ...typography.input,
    color: colors.textPrimary,
  },
  unitOptionTextSelected: {
    fontWeight: '600',
  },
}));
