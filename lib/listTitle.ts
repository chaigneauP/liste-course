export const MAX_LIST_TITLE_LENGTH = 40;

export function truncateListTitle(title: string): string {
  if (title.length <= MAX_LIST_TITLE_LENGTH) {
    return title;
  }
  return `${title.slice(0, MAX_LIST_TITLE_LENGTH - 1).trimEnd()}…`;
}
