import { EntityBase } from './entity-base';

export interface StoreWinGsmVO extends EntityBase {
    store: string;
    code: string;
    available: string;
    itemCode: string;
    quantity: number;
}
