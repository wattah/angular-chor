import { EntityBase } from './entity-base';

export interface MonitoringTaskVO extends EntityBase {
    arrow: string;
    id: number;
    firstNameMember: string;
    lastNamMember: string;
    createdByFirstName: string;
    createdByLastName: string;
    tache: string;
    parcours: string;
    endDateStr: string;
    starDateStr: string;
    isPriority: boolean;
    isBackup: boolean;
    assignedToId: number;
    customerId: number;
    requestId: number;
    thetisTaskId: string;
    processInstanceId: string;
    categorie: string;
    statut: string;
    existTaskToAssigned: boolean;
    crmName: string;
    endHours: number;
    createdAt : string;
    traiterByFirstName: string;
    traiterByLastName: string;
    suiviByLastName: string;
    suiviByFirstName: string;
    statutTask: string;
    panierIconeTask: string;
    panierId: number;
	panierPrice: string;
	panierComposition: Array<string>;
    requestDescription: string;
    createdByFT: string;
    isOpened: boolean;
    statutPanier: string;   
    carttItemsGroup: string;
    stockToUseCode : string;
    isConnectedOnWf : boolean;
    workflowId : number;
    blocked: boolean;
    requestTypeId: number;
    universId: number;
    
}
