import { EntityBase } from './entity-base';
import { RequestTypeVO } from './models';

export interface ProcessInstanceVO {

    id: string;
    name: string;
    definitionId: string;
    businessKey: string;
    caseInstanceId: string;
    ended: boolean;
    suspended: boolean;
    tenantId: string;
    requestType: RequestTypeVO;
    priority: number;
	candidateStarterGroup: Array<string>;
    candidateStarterUser: Array<string>;
    assignee: string;
    description: string;
    executionId: string;
    followUpDate: string; 
    dueDate: string;
    initialisationProcedures: Array<string>;
    traitementProcedures: Array<string>;
    blocked: boolean;
	error: string;
}