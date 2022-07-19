import { EntityBase } from './entity-base';

export interface MessageReceiverVO extends EntityBase {
    id: number;
    value: string;
    contactMethodId: number;
    customerParkItemId: number;
    messageId: number;
    copy: boolean;
    hidden: boolean;
}


