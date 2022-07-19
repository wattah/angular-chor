import { EntityBase } from './entity-base';

export interface NestedOfferVO extends EntityBase {
    id: number;
    customerParkItemId: number;
    name: string;
    status: number;
    startDate: string;
    endDate: string;
    value: string;
    children: NestedOfferVO[];
}
