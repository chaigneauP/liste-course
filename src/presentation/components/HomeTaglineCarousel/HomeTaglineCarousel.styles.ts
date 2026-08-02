import { makeStyles } from '@/presentation/theme';

export const TAGLINE_ROTATION_MS = 10000;
export const TAGLINE_FADE_MS = 450;

export const useHomeTaglineCarouselStyles = makeStyles(({ colors, typography }) => ({
  phrase: {
    ...typography.bodyRelaxed,
    color: colors.textSecondary,
  },
}));
