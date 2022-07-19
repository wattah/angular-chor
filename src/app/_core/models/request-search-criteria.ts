import { PendingStatus } from './../enum/task.enum';
import { RequestStatut } from './../enum/request-statut.enum';

export interface RequestSearchCriteria {
  roleId: number;
  userId: number;
  customerId: number;
  fromDate: Date;
  toDate: Date;
  requestTypeLabel: string;
  status: RequestStatut;
  pendingStatus: PendingStatus;
  taskHandlerRoleId: number;
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
  accountManagerUserId: number;
  idCreatedByListVO: number[];
  referentId: number;
  customerOfferId: number;
  isAutomaticRequestType: boolean;
  requestId: number;
  campaignName: string;
  campaignDate: Date;
}
