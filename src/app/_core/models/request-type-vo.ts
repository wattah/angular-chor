import { EntityBase } from './entity-base';

export interface RequestTypeVO extends EntityBase {
  id: number;
  label: string;
  technicalKey: string;
  idFamily: number;
  active: boolean;
  ordinal: number;
  automatic: boolean;
  key: string; 
}
