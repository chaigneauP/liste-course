export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 18,
  /** Assez grand pour arrondir complètement n'importe quel élément. */
  full: 999,
} as const;

export type Radius = typeof radius;
