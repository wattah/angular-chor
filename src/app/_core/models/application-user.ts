import { RoleVO } from './RoleVO';
import { EntityBase } from './entity-base';
import { ResponseIbanDetailsVO } from './response-iban-details-vo';
import { RoleRequestTypes } from './role-request-types-vo';

export interface ApplicationUserVO extends EntityBase {
  name: string;
  firstName: string;
  lastName: string;
  rolesAsString: string;
  roles: Array<string>;
  permissions: Array<string>;
  identifiantFT: string;
  coachId: number;
  roleWithPermissions: Array<RoleVO>;
  activeRole: RoleVO;
  trigram: string;
  uuid: string;
  responseIbanDetails: ResponseIbanDetailsVO;
  roleRequestTypes: Array<RoleRequestTypes>;
  activeRoleRequestTypes: Array<string>;
}
