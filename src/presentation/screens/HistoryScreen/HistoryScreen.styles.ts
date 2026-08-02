import { makeStyles } from '@/presentation/theme';

export const useHistoryScreenStyles = makeStyles(({ spacing }) => ({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[5],
    minHeight: 0,
  },
}));
