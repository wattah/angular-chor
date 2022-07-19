import { ReferenceDataVO } from './reference-data-vo';

export interface PersonCustomerRoleVO {
    id: number;
    customerId: number;
    personId: number;
    refRole: ReferenceDataVO;
    allowedToCall: boolean;
  }
