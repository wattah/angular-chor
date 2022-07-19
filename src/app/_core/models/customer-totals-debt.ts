import { EntityBase } from './entity-base';
import { PersonVO } from './person-vo';

export interface SelectedDebt {
  rowSelected: number;
  universSelected: string,
  mobileSelected: boolean; 
  serviceSelected: boolean;
  internetSelected: boolean;
  contractSelected: CustomerTotalsDebt;
  hasNext: boolean;
  hasPrevious: boolean;
  showInactifAccounts: boolean;
}

export interface CustomerTotalsDebt extends EntityBase {

  /**
  * Identifiant de niche
  */
  nicheIdentifier: string;

  /**
  * Statut du contrat
  */
  status: string;

  /** Offre */
  offerLabel: string;

  /** Total Mobile Debt */
  detteMobileTTC: number;

  /** Total Service Debt */
  detteServiceTTC: number;

  /** Total Internet Debt */
  detteInternetTTC: number;

  /** Total Debt */
  detteTotalTTC: number;

  /** Total Credit */
  totalCreditTTC: number;

  beneficiaryList: PersonVO[];

  /** Total Credit Mobile*/
  totalCreditMobileTTC: number;

  /** Total Credit Service*/
  totalCreditServiceTTC: number;
}
