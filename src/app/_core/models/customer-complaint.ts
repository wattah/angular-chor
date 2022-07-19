import { EntityBase } from './entity-base';

export interface CustomerComplaint extends EntityBase {
    isSensible : boolean;
    complaintValue : string;

}