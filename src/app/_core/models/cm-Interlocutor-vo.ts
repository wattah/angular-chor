import { ReferenceDataVO } from './reference-data-vo';
import { CmPostalAddressVO } from './cm-postaladdress-vo';
export interface CmInterlocutorVO {
  id: number;
  value: string;
  types: ReferenceDataVO[];
  //typeData: string;
  mediaRefKey: string;
  postalAddres: CmPostalAddressVO;     
  order: number;
  isExpired: boolean;
  iconAlert: string;
}
