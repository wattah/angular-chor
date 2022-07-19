import { EntityBase } from './entity-base';

export interface MembrePerson extends EntityBase {
  idPerson: number;
  idCustomer: number;
  typePerson: any;
  firstName: string;
  lastName: string;
  title: any;
  nicheIdentifier: string;
  crmName: string;
  siret: string;
  category: any;
  companyName: string;
  status: any;
  companyNameParentId: number;
  // attributs relatifs au produit
  idProduct: number;     // table product
  idMasterProduct: number;
  nameProduct: string; // table master_product
  categoryProduct: any;
  nomenclature: number;
  univers: string;
  billAccountNumber: string
}

export interface PagePerson extends EntityBase {
  persons: MembrePerson[];
  page: number;
  totalPages: number;
  totalPersons: number;    
}
