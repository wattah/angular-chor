import { EntityBase } from './entity-base';

export interface FormVariableSubmittedVO extends EntityBase {
    value : any;
    type : string;
    valueInfo : any;
}