import { EntityBase } from './entity-base';
import { FormTypeVO } from './FormTypeVO';

export interface TypedValueVO extends EntityBase {

    value : any;
	type : FormTypeVO;
}