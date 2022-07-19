import { EntityBase } from './entity-base';

export interface CustomerParcItemVO extends EntityBase {
  contrat: string;	
  listParcLigne: CustomerParkLigne[];
}

export interface CustomerParkLigne extends EntityBase {
  type: string; // universe;
  ligne: string; // webServiceIdentifier;
  status: string; // nicheContractStatus;
  horsF: string; // totalTaxIncludedAmount;
  forfait: string; // libelleContract;
  dateRenewal: Date;
  rangRenewal: string;
  subscriptionDate: Date;
  isRenewalInProgress: Boolean;
  customerId: Number;
  title: string;
  fistName: string;
  lastName: string;
  contrat: string;
  idCustBeneficiare: number;
  linkedSimParkItem : any;
}
