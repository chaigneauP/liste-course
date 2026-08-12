import { makeStyles } from '@/presentation/theme';
import { spacing } from '@/presentation/theme/tokens';

export const ACTION_BUTTON_HIT_SLOP = 8;
/** Marge sous la safe area, avant le titre. */
export const SCREEN_TOP_EXTRA_PADDING = spacing[4];
const SIDE_BUTTON_SIZE = 44;

export const useScreenTopStyles = makeStyles(({ colors, spacing, typography, opacity }) => ({
  container: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[5],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowWithActions: {
    alignItems: 'center',
  },
  sideButton: {
    width: SIDE_BUTTON_SIZE,
    height: SIDE_BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginLeft: -spacing[2],
  },
  rightButton: {
    marginRight: -spacing[2],
  },
  sideButtonPressed: {
    opacity: opacity.pressed,
  },
  textBlock: {
    flex: 1,
    gap: spacing[1],
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.screenSubtitle,
    color: colors.textSecondary,
  },
}));
