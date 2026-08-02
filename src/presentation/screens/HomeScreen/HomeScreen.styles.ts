import { makeStyles } from '@/presentation/theme';

export const useHomeScreenStyles = makeStyles(({ spacing }) => ({
  screen: {
    flex: 1,
  },
  listsSection: {
    flex: 1,
    paddingHorizontal: spacing[5],
    minHeight: 0,
  },
}));
