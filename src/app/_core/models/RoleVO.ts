import { EntityBase } from './entity-base';
export interface RoleVO extends EntityBase{

    roleName: string;
    permissions: Array<string>;
    affectationDate: Date;
    displayName: string;
    roleId: number;
}
