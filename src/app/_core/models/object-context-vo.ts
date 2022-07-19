import { EntityBase } from './entity-base';
import { ReferenceDataVO } from './reference-data-vo';

export interface ObjectContextVO extends EntityBase {
  id: number;
  label: string;
  active: boolean;
  language: ReferenceDataVO;
}
