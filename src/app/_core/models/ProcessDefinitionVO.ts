import { EntityBase } from './entity-base';

export interface ProcessDefinitionVO extends EntityBase {
    key:string;
    category:string;
    description:string;
    name:string;
    version:number;
    resource:string;
    deploymentId:string;
    diagram:string;
    suspended:boolean;
    tenantId:string;
    versionTag:string;
    historyTimeToLive:number;
    startableTaskList:boolean;
}