import { EntityBase } from './entity-base';


export interface RequestAnswersVO extends EntityBase {
  id: number;
  idRequest: number;
  answer: string; 
  type : string;
  label : string;
  idFormField : string;
}
