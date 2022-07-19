import { EntityBase } from './entity-base';

export interface TaskVo extends EntityBase {
  createdById: number;
  description: String; 
  userIdToNotify: number;
  assignedToId: number;
  inChargeOfId: number;
  startDate: Date;
  startDateAsString: string;
  endDate: Date;
  endDateAsString: string;
  dispalyEndDate: string;
  isPriority: Boolean;
  requestId: number;
  customerId: number;
  resolutionDuration: number;
  thetisTaskId: string;
  statut: string;
  resolutionComment: string;
  resolutionStatus: String;
  closedById: number;
  label: string;
  name: string;
  createDate: Date;
  createDateAsString: string;
  initialisationProcedures: Array<string>;
  traitementProcedures: Array<string>;
  realEndDate?: string;
}
