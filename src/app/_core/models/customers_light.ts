import { PersonVO } from './person-vo';

export interface CustomersLight {
  id: number;
  nichIdentifiant: string;
  statut: string;
  offre: string;
  beneficiaryList: PersonVO[];
}
