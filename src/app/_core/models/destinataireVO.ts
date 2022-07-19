import { NicheContractStatus } from "../enum/customer-park-item-statut.enum";

export interface DestinataireVO{
	contactMethodId: number;
	parcItemId: number;
    firstName: string;
	lastName: string;
	parc: boolean;
	role: string;
	phoneNumber: string;
	personId: number;
	customerId: number;
	contactType: string;
	status : NicheContractStatus;
}