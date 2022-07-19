import { EntityBase } from "./entity-base";
export interface InvoiceVO extends EntityBase {

issueDate : Date;
invoiceNumber : string;
invoiceFileName : string;
arrow: string;
}
