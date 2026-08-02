import type { TextStyle } from 'react-native';

/**
 * Rôles typographiques de l'application. Les styles n'embarquent pas de
 * couleur : celle-ci vient du thème au point d'utilisation.
 */
export const typography = {
  screenTitle: { fontSize: 28, fontWeight: '700' },
  screenSubtitle: { fontSize: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  emptyTitle: { fontSize: 17, fontWeight: '600' },
  cardTitle: { fontSize: 16 },
  input: { fontSize: 16 },
  button: { fontSize: 15, fontWeight: '600' },
  buttonSmall: { fontSize: 14, fontWeight: '600' },
  body: { fontSize: 14 },
  bodyRelaxed: { fontSize: 14, lineHeight: 20 },
  label: { fontSize: 13, fontWeight: '500' },
  caption: { fontSize: 12 },
  fabGlyph: { fontSize: 32, fontWeight: '300', lineHeight: 36 },
} as const satisfies Record<string, TextStyle>;

export type Typography = typeof typography;
