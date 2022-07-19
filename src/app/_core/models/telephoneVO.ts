import { EntityBase } from './entity-base';
export interface TelephoneVO extends EntityBase {
   id: number ;
   prenom : string;
   nom : string;
   role : string;
   mobile : string;
   fix : string; 
   type : string
  
}