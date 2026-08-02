import { makeStyles } from '@/presentation/theme';

const MENU_ITEM_WIDTH = 96;
const MENU_TILE_SIZE = 72;
const MENU_LABEL_LINE_HEIGHT = 18;

export const HOME_MENU_ICON_SIZE = 32;

export const useHomeScreenStyles = makeStyles(({ colors, spacing, radius, typography }) => ({
  screen: {
    flex: 1,
    padding: spacing[5],
    gap: spacing[2],
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.screenSubtitle,
    color: colors.textSecondary,
  },
  menu: {
    marginTop: spacing[8],
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  menuItem: {
    alignItems: 'center',
    width: MENU_ITEM_WIDTH,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuTile: {
    width: MENU_TILE_SIZE,
    height: MENU_TILE_SIZE,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    marginTop: spacing[2],
    ...typography.label,
    color: colors.textPrimary,
    textAlign: 'center',
    width: '100%',
    lineHeight: MENU_LABEL_LINE_HEIGHT,
    minHeight: MENU_LABEL_LINE_HEIGHT * 2,
  },
  listsSection: {
    flex: 1,
    marginTop: spacing[9],
    minHeight: 0,
  },
}));
