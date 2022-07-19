import { EntityBase } from './entity-base';
/**
 * Elément d'un auto-complete
 */
export interface CustomerAutocomplete extends EntityBase {

  id: number;
  /**
   * Identifiant de niche
   */
  nicheIdentifier: string;
  /**
   * 
   */
  status: string;
  /**
   * Catégorie du bénéficiaire
   */
  categoryCustomer: string;
  /**
   * Nom du bénéficiaire
   */
  name: string;
  /**
   * Nom du titulaire
   */
  holderBenefName: string;
  /**
   * 
   */
  referenceKey: string;
  /**
   * 
   */
  textOfStatus: string;
}
