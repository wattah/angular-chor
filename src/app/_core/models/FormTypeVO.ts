import { EntityBase } from './entity-base';

export interface FormTypeVO extends EntityBase {

    name : string;
	values : Map<string, string>;
}