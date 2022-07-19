import { ReferenceDataVO } from './reference-data-vo';
import { EntityBase } from './entity-base';
export interface PostalAdresseVO extends EntityBase {
  title: string; 
  firstName: string;
  lastName: string;
  addrLine4: string;
  addrLine3: string;
  addrLine2: string;   
  addrLine5: string; 
  logisticInfo: string;
  cedex: string;
  postalCode: string;
  country: ReferenceDataVO;
  city: string;
  socialTitle: string;
  companyName: string;
  types: any;
  personId : number;
}