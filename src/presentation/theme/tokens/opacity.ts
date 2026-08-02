export type Opacity = {
  /** Feedback press (boutons icône, pill, etc.). */
  pressed: number;
  /** Contrôle désactivé. */
  disabled: number;
};

export const opacity: Opacity = {
  pressed: 0.6,
  disabled: 0.5,
};
