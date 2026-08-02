import { makeStyles } from '@/presentation/theme';
import { spacing } from '@/presentation/theme/tokens';

const FAB_SIZE = 60;

/** Marge basse du contenu, ajoutée aux safe area insets par l'écran. */
export const LIST_CONTENT_BOTTOM_INSET = {
  withFab: 96,
  readOnly: spacing[6],
} as const;

export const FAB_BOTTOM_INSET = spacing[6];

export const useListScreenStyles = makeStyles(
  ({ colors, spacing: space, radius, typography, shadow }) => ({
    container: {
      flex: 1,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: space[2],
      paddingHorizontal: space[6],
    },
    missingTitle: {
      ...typography.emptyTitle,
      color: colors.textPrimary,
    },
    missingText: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    readOnlyBanner: {
      backgroundColor: colors.accentBg,
      paddingVertical: space[2.5],
      paddingHorizontal: space[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    readOnlyText: {
      ...typography.label,
      color: colors.accentIcon,
      textAlign: 'center',
    },
    listContent: {
      padding: space[4],
      gap: space[2.5],
    },
    listContentEmpty: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    empty: {
      alignItems: 'center',
      gap: space[2],
      paddingHorizontal: space[6],
    },
    emptyTitle: {
      ...typography.emptyTitle,
      color: colors.textPrimary,
    },
    emptyText: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    fab: {
      position: 'absolute',
      right: space[6],
      width: FAB_SIZE,
      height: FAB_SIZE,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.btnPrimaryBg,
      ...shadow.floating,
    },
    fabPressed: {
      backgroundColor: colors.btnPrimaryBgHover,
    },
    fabText: {
      ...typography.fabGlyph,
      color: colors.btnPrimaryIcon,
    },
  })
);
