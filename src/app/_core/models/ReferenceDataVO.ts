import { EntityBase } from './entity-base';
import { ReferenceListVO } from './models';

export interface ReferenceDataVO extends EntityBase {

	label:string;
	ordinal:number;
	active:boolean;
	dateUpdate:Date;
	parent:ReferenceDataVO;
	children:Array<ReferenceDataVO>;
	list:ReferenceListVO;
	logoName:string;
	key:string; 
  
}