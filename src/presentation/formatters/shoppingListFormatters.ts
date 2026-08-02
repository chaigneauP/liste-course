export function formatItemCount(count: number): string {
  if (count === 0) {
    return 'Aucun article';
  }
  if (count === 1) {
    return '1 article';
  }
  return `${count} articles`;
}

export function formatArchivedListCount(count: number): string {
  if (count === 0) {
    return 'Aucune liste archivée.';
  }
  return `${count} liste${plural(count)} archivée${plural(count)}.`;
}

export function plural(count: number): string {
  return count > 1 ? 's' : '';
}
