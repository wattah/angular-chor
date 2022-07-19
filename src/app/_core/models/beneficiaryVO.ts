import { EntityBase } from './entity-base';

export interface BeneficiaryVO extends EntityBase {

    nicheIdentifier:string;
	label:string;
    holderId:number;
    offreLabel: string;
    firstName: string;
    lastName: string;
    crmName: string;
    idCompany: number;
    idCustomer: number;   
    status: string; 
}