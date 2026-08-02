import { makeStyles } from '@/presentation/theme';

export const useShoppingListsSectionStyles = makeStyles(
  ({ colors, spacing, radius, typography, shadow, opacity }) => ({
    section: {
      flex: 1,
      gap: spacing[3],
      minHeight: 0,
    },
    sectionHeader: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[2],
      zIndex: 1,
    },
    sectionTitle: {
      ...typography.sectionTitle,
      color: colors.textPrimary,
      flex: 1,
    },
    infoButton: {
      padding: spacing[1],
      borderRadius: radius.full,
    },
    infoButtonPressed: {
      opacity: opacity.pressed,
    },
    hintBubble: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: spacing[1.5],
      width: 200,
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[2.5],
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.hint,
    },
    hintText: {
      ...typography.caption,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    scrollWrap: {
      flex: 1,
      minHeight: 0,
      position: 'relative',
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
