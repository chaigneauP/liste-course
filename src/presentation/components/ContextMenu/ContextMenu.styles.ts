import { makeStyles } from '@/presentation/theme';
import { spacing } from '@/presentation/theme/tokens';

/** Métriques partagées entre la feuille de styles et le calcul d'ancrage du menu. */
export const contextMenuMetrics = {
  gap: spacing[1.5],
  edgeInset: spacing[5],
} as const;

export const useContextMenuStyles = makeStyles(
  ({ colors, spacing: space, radius, typography, shadow }) => ({
    overlay: {
      flex: 1,
    },
    menu: {
      position: 'absolute',
      alignSelf: 'flex-end',
      right: contextMenuMetrics.edgeInset,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      ...shadow.menu,
    },
    action: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space[1.5],
      paddingVertical: space[2],
      paddingHorizontal: space[2.5],
    },
    actionPressed: {
      backgroundColor: colors.dangerSurface,
    },
    actionLabel: {
      ...typography.label,
      color: colors.danger,
      flexShrink: 0,
    },
  })
);
