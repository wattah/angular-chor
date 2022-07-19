import { EntityBase } from './entity-base';
import { ReferenceListVO } from './models';


export interface ReferenceDataVO extends EntityBase  {
  id: number;
  label: string;
  ordinal: number;
  active: boolean;
  dateUpdate: Date;
  parent: ReferenceDataVO;
  children: ReferenceDataVO[];
  logoName: string;
  key: string;
  labelComplement: string;
  list : ReferenceListVO

}
