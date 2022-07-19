import { CartItemVO } from './../../cart-item-vo';
import { RequestTypeVO } from '../../request-type-vo';

export interface RequestVO {
  id: number;
  customerId: number;
  title: string;
  description: string;
  createdAt: Date;
  createdById: number;
  attachedUserId: number;
  salesReprentatifId: number;
  accountManagerUserId: number;
  modifiedAt: Date;
  modifiedById: number;
  requestType: RequestTypeVO;
  recepientId: number;
  interlocuteurId: number;
  mediaId: number;
  step: number;
  isConnectedOnWf: boolean;
  universId: number;
  instanceId: string;
  requestTypeLabel: string;
  closureComment: string;
  conclusionType: string;
  realEndDate: Date;
  realEndDateAsString: string;
  creationDateAsString: string;
  modifiedAtAsString: string;
  cartItems: CartItemVO[];
}
