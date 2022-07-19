import { EntityBase } from './entity-base';
import { RoleRequestTypes } from './role-request-types-vo';
export interface TokenVO extends EntityBase{
    userId: number;
    token: string;
    userFirstName:string;
    userLastName:string;
    userRoles:any;
    selectedRole: string;
    roleRequestTypes: Array<RoleRequestTypes>;
}
