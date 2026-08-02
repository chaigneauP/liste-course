import { makeStyles } from '@/presentation/theme';
import { spacing } from '@/presentation/theme/tokens';

import { CENTER_BUTTON_HEIGHT } from './CustomTabBar.styles';

export const CENTER_TAB_PILL_HORIZONTAL_PADDING = spacing[5];

export const useCenterTabButtonStyles = makeStyles(
  ({ colors, radius, typography, shadow }) => ({
    centerButton: {
      height: CENTER_BUTTON_HEIGHT,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.btnPrimaryBg,
      overflow: 'hidden',
      ...shadow.floating,
    },
    centerButtonPressed: {
      opacity: 0.92,
    },
    centerButtonLayer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerButtonLabel: {
      ...typography.button,
      color: colors.btnPrimaryIcon,
    },
  })
);
