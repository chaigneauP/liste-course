/**
 * Port de transfert de fichiers JSON (partage sortant / sélection entrante).
 * L’infrastructure fournit l’implémentation Expo concrète.
 */
export interface ListTransferGateway {
  /** Écrit un fichier JSON temporaire puis ouvre la feuille de partage système. */
  shareJsonFile(filename: string, contents: string): Promise<void>;
  /**
   * Demande un dossier à l’utilisateur puis y écrit le fichier JSON.
   * `cancelled` si le sélecteur est fermé sans choix.
   */
  saveJsonFile(filename: string, contents: string): Promise<'saved' | 'cancelled'>;
  /**
   * Ouvre le sélecteur de documents et renvoie le contenu texte.
   * `null` si l’utilisateur annule.
   */
  pickJsonFileContents(): Promise<string | null>;
}
