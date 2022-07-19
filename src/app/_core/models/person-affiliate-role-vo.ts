import { ReferenceDataVO } from './reference-data-vo';

export interface PersonAffiliateRoleVO {
    id: number;
    personId: number;
    affiliateId: number;
    refRole: ReferenceDataVO;
  }
