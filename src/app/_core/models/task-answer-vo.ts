import { EntityBase } from './entity-base';

export interface TaskAnswerVO extends EntityBase {

    id: number;
    value: string;
    taskId: number;
    formfieldId : string;
    type : string;
    label : string ;
}
