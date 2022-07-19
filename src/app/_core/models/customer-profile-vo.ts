import { CustomerVO } from './customer-vo';
import { PersonVO } from './person-vo';

export interface CustomerProfileVO {
    id: number;
    customer: CustomerVO;
    person: PersonVO;
    holderContracts: CustomerVO[];
}
