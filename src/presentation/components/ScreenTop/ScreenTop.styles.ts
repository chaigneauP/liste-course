import { makeStyles } from '@/presentation/theme';
import { spacing } from '@/presentation/theme/tokens';

export const BACK_BUTTON_HIT_SLOP = 8;
/** Marge sous la safe area, avant le titre. */
export const SCREEN_TOP_EXTRA_PADDING = spacing[4];
const BACK_BUTTON_SIZE = 44;

export const useScreenTopStyles = makeStyles(({ colors, spacing, typography }) => ({
  container: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[5],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backButton: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing[2],
    marginTop: -spacing[1],
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  textBlock: {
    flex: 1,
    gap: spacing[1],
  },
  textBlockWithBack: {
    paddingTop: spacing[1.5],
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
