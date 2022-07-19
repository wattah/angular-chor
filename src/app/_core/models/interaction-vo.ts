import { EntityBase } from './entity-base';
import { UserVo } from './user-vo';
export interface InteractionLight extends EntityBase {
   interactionId: number;
   creeLe: Date;
   media: string;
   interactionMotif: string;
   interactionMotifParent: string;
   firstNameCreePar: string;
   lastNameCreePar: string;
   universe : string;
   firstNameInterlocuteur : string;
   lastNameInterlocuteur: string;
   firstNameDestinataire: string;
   lastNameDestinataire: string;
   moreInformation: string;
   contactMethod: string;
   participants : Array<UserVo>;
   startDate :Date;
   description: string;
   requestId: number;
   isAutomatic: boolean;

}
