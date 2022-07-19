import { EntityBase } from './entity-base';
import { ReferenceDataVO } from './ReferenceDataVO';


export interface UserVo extends EntityBase {
  id: number;
  ftUniversalId: string;
  email: string;
  phoneNumber: string;
  active: boolean;
  firstName: string;
  lastName: string;
  useChorniche: boolean;
  roleNamesAsString: string;
  name: string;
  parnasseEmail: string;
  canalType: ReferenceDataVO ;
  parnassePhoneNumber: string;


}
