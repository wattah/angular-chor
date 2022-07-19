import { CustomerParkItemVO } from './customer-park-item-vo';
import { PenicheBillAccountVO } from './peniche-bill-account-vo';
import { PenicheCustomerResponseVO } from './peniche-customer-response-vo';

export interface ParkBillPenicheCustomerVO {
  customerParkItem: CustomerParkItemVO;
  billAccount: PenicheBillAccountVO;
  penicheCustomer: PenicheCustomerResponseVO;
}
