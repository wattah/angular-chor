import { EntityBase } from './entity-base';

export interface CustomerParkHardwareAssociatedLineVO extends EntityBase {
 
  id : number;
  billingDate: Date;
  dateDelivery: Date;
  productCategoryName: string;
  requestId : number;
  associatedLineId : number;
  nicheContractStatus :  string;
  cartId :number;
  dateLastChange: Date;
  billAccountId : string;
  commandOrderStatus: string;
}
