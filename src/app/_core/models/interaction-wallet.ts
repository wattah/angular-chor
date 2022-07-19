import { EntityBase } from './entity-base';

export interface InteractionWallet extends EntityBase {
   interactionId: number;
	createdAt: Date;
	firstNameCreator: string;
	lastNameCreator: string;
	reason: string;
	reasonParent: string;
	firstNameRecipient: string;
	lastNameRecipient: string;
	crmNameRecipient: string;
	requestId: number;
	requestLabel: string;
	isAutomatic: boolean;
	ftUniversalId: string;
	idCustomer: number;
	categoryCustomer: string;
	idCompanyCustomer: number;
	picto: string;
}
