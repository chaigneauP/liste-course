import { makeStyles } from '@/presentation/theme';

export const useHomeScreenStyles = makeStyles(({ spacing }) => ({
  screen: {
    flex: 1,
  },
  tagline: {
    paddingHorizontal: spacing[5],
    marginTop: spacing[2],
    minHeight: 40,
  },
  listsSection: {
    flex: 1,
    paddingHorizontal: spacing[5],
    marginTop: spacing[8],
    minHeight: 0,
  },
}));
