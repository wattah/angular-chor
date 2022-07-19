import { EntityBase } from './entity-base';
import { FormTypeVO } from './FormTypeVO';
import { TypedValueVO } from './TypedValueVO';
import { FormFieldValidationConstraintVO } from './FormFieldValidationConstraintVO';

export interface FormFieldVO {

    businessKey : boolean;
	id : string;
	label : string;
    type : FormTypeVO;
    typeName : string;
	defaultValue : any;
	value : TypedValueVO;
	validationConstraints : Array<FormFieldValidationConstraintVO>;
	properties : Map<String, String> ;
	displayResponse : string;
}