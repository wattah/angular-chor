import { EntityBase } from './entity-base';

export interface TaskFilterVo extends EntityBase {
  idResponsableAffaire: number;
  idMember: number;
  requestType: string;
  idSuiviPar: number;
  idTraiterPar: number;
  taskPriority: boolean;
  idTask: number;
  fromDate: Date;
  toDate: Date;
  taskAssignedStatut: string;
  statut: string;
  cartStatut: string;
  idRoleCreateur: number;
  idCreateurs: Array<number>;
  idBackup: number;
  idPortfeuille: number;
  idPilotePar: number;
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
}
