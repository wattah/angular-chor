/**
 * Bon à savoir
 */
export interface PersonNoteVo {

  id: number;

  /**
   * id person
   */
  personId: number;

  /**
   * Commentaire
   */
  value: string;
  /**
   * le nom  du commentaire
   */
  lastNameAuthor: string;
  /**
   * le prenom  du commentaire
   */
  firstNameAuthor: string;
  /**
   * Date d'écriture
   */
  dateNote: Date;

  /**
   * email utilisateur
   */

  emailUser: string;
}
