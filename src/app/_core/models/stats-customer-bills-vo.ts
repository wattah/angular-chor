import { EntityBase } from './entity-base';

export interface StatsCustomerBillsUniverseVO extends EntityBase {
  universe: string;
  count: number;
}
  
export interface StatsCustomerBillsVO extends EntityBase {
  customerIdentifier: string;
  statsUniverse: StatsCustomerBillsUniverseVO[];
  cr: number;
  customerName: string;
  deskName: string;
  customerId: number;
  mobileNbr: number;
  homeNbr: number;
  internetNbr: number;
  serviceNbr: number;
}
