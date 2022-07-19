import { UserVo } from '../../user-vo';

export interface CustomerInteractionVO {
  id: number;
  startDate: Date;
  startDateStr: string;
  creationDate: Date;
  creationDateStr: string;
  customerId: number;
  creatorId: number;
  actorId: number;
  requestId: number;
  refMediaId: number;
  interactionReasonId: number;
  interactionReasonLabel: string;
  description: string;
  interlocuteurId: number;
  contactMethodId: number;
  moreInformation: string;
  participants: Array<UserVo>;
  objetRequest: string;
  idDestinataire: number;
  attachedUserId: number;
  universId: number;
  endDate: Date;
  endDateStr: string;
}

