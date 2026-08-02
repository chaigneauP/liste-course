import { makeStyles } from '@/presentation/theme';

export const SCROLL_EDGE_FADE_HEIGHT = 48;

export const useScrollEdgeFadeStyles = makeStyles(() => ({
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCROLL_EDGE_FADE_HEIGHT,
    zIndex: 1,
  },
  gradient: {
    flex: 1,
  },
}));
