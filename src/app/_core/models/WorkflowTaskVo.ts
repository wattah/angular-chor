import { FormFieldVO } from './FormFieldVO';

export interface WorkflowTaskVO {
    id: string;
	name: string;
	assignee: string;
	created: Date;
	due: Date;
	followUp: Date;
	delegationState: string;
	description: string;
	executionId: string;
	owner: string;
	parentTaskId: string;
	priority: number;
	processDefinitionId: string;
	processInstanceId: string;
	taskDefinitionKey: string;
	caseExecutionId: string;
	suspended: boolean;
	formKey: string;
	tenantId: string;
	condidateGroups: Array<string>;
	condidateUsers: Array<string>;
	formFields: Array<FormFieldVO>;
	procedures: Array<string>;
	rolesToNotifyOnClosure: Array<string>;
	usersToNotifyOnClosure: Array<string>;
}