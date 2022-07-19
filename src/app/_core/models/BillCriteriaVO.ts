import { EntityBase } from './entity-base';

export interface BillCriteriaVO extends EntityBase{
    nicheIdentifier: string;
	date: Date;
	nbMonthsFrom: number;
	customersNumber: Array<string>;
	trigram: string;
}
