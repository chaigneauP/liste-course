import { makeStyles } from '@/presentation/theme';

export const LEFT_TAB_ROUTE = 'historique';
export const CENTER_TAB_ROUTE = 'index';
export const RIGHT_TAB_ROUTE = 'parametres';

/** Hauteur totale de la barre d’onglets (hors safe area). */
export const TAB_BAR_CONTENT_HEIGHT = 68;
/** Partie du bouton central au-dessus du bord haut de la barre. */
export const CENTER_BUTTON_OVERHANG = 24;
export const CENTER_BUTTON_HEIGHT = 60;

export const useCustomTabBarStyles = makeStyles(({ colors, spacing, typography }) => ({
    bar: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      overflow: 'visible',
    },
    barRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: TAB_BAR_CONTENT_HEIGHT,
      paddingTop: spacing[3],
      paddingHorizontal: spacing[2],
    },
    sideTab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sideTabContent: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[1],
    },
    sideTabActive: {},
    sideTabLabel: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    sideTabLabelActive: {
      color: colors.iconActive,
      fontWeight: '600',
    },
    centerSpacer: {
      flex: 1,
    },
  centerButtonAnchor: {
    position: 'absolute',
    top: -CENTER_BUTTON_OVERHANG,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
}));
