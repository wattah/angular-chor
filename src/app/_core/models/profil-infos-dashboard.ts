import { EntityBase } from './entity-base';
import { CategoryCustomer } from './models';
import { CustomerReferentLight } from './customer-referent-light';

/**
 * Contient les données pour afficher une fiche client
 */
export interface BeneficiaireView extends EntityBase {
  /**
	 * id du bénéficiaire
	 */
  id: number;

  /**
	 * Catégorie du client
	 */
  customerCategory: CategoryCustomer;

  /**
	 * Identifiant de niche
	 */
  nicheIdentifier: string;

  /**
	 * compagny name
	 */
  companyName: string;

  /**
	 * Full Nom  du client
	 */
  fullName: String;

  /**
	 * id person du customer courant
	 */
  personId: number;

  /**
	 * Civilité
	 */
  title: string;

  /**
	 * Prénom du client
	 */

  firstName: string;
  /**
	 * Nom du client
	 */
  lastName: string;

  /**
	 * Statut de client
	 */
  status: string;

  /**
	 * age
	 */
  age: Number;

  /**
	 * Date de naissance
	 */
  birthdate: string;

  /**
	 * sector
	 */
  businessSectorRef: string;

  /**
	 * job
	 */
  professionRef: string;

  /**
	 * Langue
	 */
  language: string;

  /**
	 * Apporteur
	 */
  businessProvider: boolean;

  /**
	 * Fournisseur
	 */
  supplier: boolean;

  providerSupplier: String;

  /**
	 * id du titulaire
	 */

  companyCustomerId: number;

  /**
	 * Référents
	 */
  referents: Array<CustomerReferentLight>;

  /**
	 * photo du membre
	 */
  photo: any;

  membrePhoto: string;

  /**
	 * si le titular a plusieurs contrats
	 */
  isMultiContract: boolean;

  /**
	 * sesame du titulaire
	 */
  sesame: string;

  /**
	 * score du titulaire : orangeCreditScoreValue
	 */
  score: number;

  /**
	 * date d'entrée dans le cercle
	 */
  dateEntryCercle: string;

  /**
	 * l'offre du customer
	 */
  offerLabel: string;

  /**
	 * siren du customer sauf si la longueur est de 9 caracteres, si plus c'est le siret
	 */
  siren: string;

  isAssistant: Boolean;

  husbandWife: Boolean;

  professionRefParent: string;

  metier: string;

  companyNiche: string;

  cancellationDate: string;

  cancellationReason: string;

  dateHomologation: string;

}
