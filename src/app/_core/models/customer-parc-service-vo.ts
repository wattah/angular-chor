import { EntityBase } from './entity-base';

export interface CustomerParcServiceVO extends EntityBase {
  productSubFamille: string;
  produit: string;
  beneficiaire: string;
  status: string;
  recurrent: boolean;
  dateFacturation: Date;
  subscriptionDate: Date;
  createdAt: Date;
  updatedAt: Date;
  terminatedAt: Date;
  comment: String;
  productName: String;
  numeroCompteFacturation: string;
  createdByFullName: string;
  updatedByFullName: string;
  terminatedByFullName: string;
  associatedLineIdentifier: string;
  delimitedContactMethodPostalAddress: string;
  serial: string;
  productCategoryName: string;
  productFamilyName: string;
  toInvoice: Boolean;
  unitPrice: number;
  remise: number;
  quantity: number;
  tva: number;
  createdByFirstName: String;
  createdByLastName: String;
  updatedByFirstName: String;
  updatedByLastName: String;
  terminatedByFirstName: String;
  terminatedByLastName: String;

}
