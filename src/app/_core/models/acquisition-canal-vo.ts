import { EntityBase } from './entity-base';

export interface AcquisitionCanalVO extends EntityBase {
    id: number;
    customerId: number;
    canalKey: string;
    canalName: string;
    typeKey: string;
    typeName: string;
    details1: string;
    details2: string;
    details3: string;
    customerOtherId: number;
    customerOtherFullName: string;
    customerOtherNicheIdentifier: string;
    userId: number;
    numberCanal: number;
    otherUserId: number;
  }