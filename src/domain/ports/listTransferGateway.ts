/**
 * Port de transfert de fichiers JSON (partage sortant / sélection entrante).
 * L’infrastructure fournit l’implémentation Expo concrète.
 */
export interface ListTransferGateway {
  /** Écrit un fichier JSON temporaire puis ouvre la feuille de partage système. */
  shareJsonFile(filename: string, contents: string): Promise<void>;
  /**
   * Ouvre le sélecteur de documents et renvoie le contenu texte.
   * `null` si l’utilisateur annule.
   */
  pickJsonFileContents(): Promise<string | null>;
}
