import { DestinataireVO } from './destinataireVO';
import { EntityBase } from './entity-base';
import { MessageReceiverVO } from './Message-receiver-vo';
import { DocumentVO } from './documentVO';

export interface MessageVO extends EntityBase {
    id: number;
    requestId: number;
    createdBy: number;
    messageTemplateId: number;
    interactionReasonId: number;
    createdAt: Date;
    createAtStr: string;
    sender: string;
    message: string;
    description: string;
    taskId: number;
    listReceivers: Array<MessageReceiverVO>
    destinataires: DestinataireVO[];
    category:String;
    isSatisfied: boolean;
    userId: number;
    customerId: number;


    styleId: number;
    subject: string;
    title: string;
    subtitle: string;
   // listFile: Array<DocumentVO>;
}