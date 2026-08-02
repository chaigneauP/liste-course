export const MAX_LIST_TITLE_LENGTH = 40;

/** Ramène un titre saisi librement dans les limites acceptées par le domaine. */
export function normalizeListTitle(title: string): string {
  return title.trim().slice(0, MAX_LIST_TITLE_LENGTH);
}

/** Titre normalisé, ou `null` s'il est vide après trim. */
export function parseListTitle(title: string): string | null {
  const normalized = normalizeListTitle(title);
  return normalized.length > 0 ? normalized : null;
}

/** Version abrégée destinée à l'affichage, les données restent intactes. */
export function truncateListTitle(title: string): string {
  if (title.length <= MAX_LIST_TITLE_LENGTH) {
    return title;
  }
  return `${title.slice(0, MAX_LIST_TITLE_LENGTH - 1).trimEnd()}…`;
}
