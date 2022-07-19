import { EntityBase } from './entity-base';
import { PersonNoteVo } from './person-note';
import { CustomerReferentLight } from './customer-referent-light';
/**
 * Contient les données pour afficher une fiche client
 */
export interface CustomerView extends EntityBase {
  /**
   * Identifiant de niche
   */
  nicheIdentifier: string;
  /**
   * id du titulaire
   */
  customerHolderId: number;
  /**
   * Date de naissance
   */
  birthdate: string;
  /**
   * age
   */
  age: Number;
  /**
   * Prénom du client
   */
  firstName: string;
  /**
   * Nom du client
   */
  lastName: string;
  /**
   * Full Nom  du client
   */
  fullName: String;
  /**
   * Type de client
   */
  customerStatus: string;
  /**
   * Catégorie du client
   */
  customerCategory: string;
  /**
   * Nom du Titulaire
   */
  holderBenefName: string;
  /**
   * Type de Titulaire
   */
  customerHolderCategory: string;
  /**
   * Langue
   */
  language: string;
  /**
   * Civilité
   */
  civility: string;
  /**
   * Bons à savoir
   */
  infos: Array<PersonNoteVo>;

  info: string;
  
  /**
   * Référents
   */
  referents: Array<CustomerReferentLight>;
  /**
   * siret
   */
  siret: string;
  /**
   * siren
   */
  siren: string;

 /**
   * flag pour verifier info (Bon a savoir)
   */
  bonSavoirIsModify: Boolean;

 /**
   * is entreprise
   */
  isEntreprise: Boolean;

  /**
   * compagny name 
   */
  companyName: string;
 
  /**
   * flag pour verifier siren 
   */
  isSiretModify: Boolean;

  nameBeneficiare: string;

  idCustomerBen: number;

  companyNameBenef: string;

  personId: number;
}
