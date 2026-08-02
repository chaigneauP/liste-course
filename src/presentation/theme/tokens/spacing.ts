/** Échelle d'espacement en pas de 4 px (les demi-pas couvrent les cas serrés). */
export const spacing = {
  0: 0,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  4.5: 18,
  5: 20,
  6: 24,
  8: 32,
  9: 36,
} as const;

export type Spacing = typeof spacing;
