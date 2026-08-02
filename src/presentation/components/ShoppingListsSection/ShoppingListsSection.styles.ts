import { makeStyles } from '@/presentation/theme';

export const useShoppingListsSectionStyles = makeStyles(
  ({ colors, spacing, typography }) => ({
    section: {
      flex: 1,
      gap: spacing[3],
      minHeight: 0,
    },
    sectionTitle: {
      ...typography.sectionTitle,
      color: colors.textPrimary,
    },
    scroll: {
      flex: 1,
    },
    loader: {
      marginTop: spacing[2],
    },
    empty: {
      ...typography.bodyRelaxed,
      color: colors.textSecondary,
    },
    lists: {
      gap: spacing[2.5],
    },
    listRow: {
      alignSelf: 'stretch',
    },
  })
);
