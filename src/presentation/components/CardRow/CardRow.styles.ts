import { makeStyles } from '@/presentation/theme';

export const useCardRowStyles = makeStyles(
  ({ colors, spacing: space, radius, typography }) => ({
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
  })
);
