import { makeStyles } from '@/presentation/theme';
import { spacing } from '@/presentation/theme/tokens';

/** Métriques partagées entre la feuille de styles et le calcul d'ancrage du menu. */
export const cardRowMenuMetrics = {
  gap: spacing[1.5],
  edgeInset: spacing[5],
} as const;

export const useCardRowStyles = makeStyles(
  ({ colors, spacing: space, radius, typography, shadow }) => ({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space[2],
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      paddingVertical: space[3.5],
      paddingHorizontal: space[4],
      borderWidth: 1,
      borderColor: colors.border,
    },
    rowChecked: {
      backgroundColor: colors.successSurface,
      borderColor: colors.border,
    },
    rowPressed: {
      backgroundColor: colors.btnSecondaryBgHover,
    },
    rowCheckedPressed: {
      backgroundColor: colors.successSurfacePressed,
    },
    titleContainer: {
      flex: 1,
      minWidth: 0,
      paddingRight: space[3],
      justifyContent: 'center',
    },
    title: {
      ...typography.cardTitle,
      color: colors.textPrimary,
    },
    titleChecked: {
      textDecorationLine: 'line-through',
      color: colors.textSecondary,
    },
    trailing: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space[2],
      flexShrink: 0,
    },
    subtitle: {
      ...typography.label,
      color: colors.textSecondary,
    },
    menuOverlay: {
      flex: 1,
    },
    menu: {
      position: 'absolute',
      alignSelf: 'flex-end',
      right: cardRowMenuMetrics.edgeInset,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      ...shadow.menu,
    },
    menuAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space[1.5],
      paddingVertical: space[2],
      paddingHorizontal: space[2.5],
    },
    menuActionPressed: {
      backgroundColor: colors.dangerSurface,
    },
    menuActionLabel: {
      ...typography.label,
      color: colors.danger,
      flexShrink: 0,
    },
  })
);
