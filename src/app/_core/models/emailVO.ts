import { EntityBase } from './entity-base';
export interface EmailVO extends EntityBase {
   id: number ;
   prenom : string;
   nom : string;
   role : string;
   email : string;
   type : string
}