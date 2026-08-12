import { makeStyles } from '@/presentation/theme';

export const useItemFormModalStyles = makeStyles(({ spacing }) => ({
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
}));
