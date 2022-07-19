import { TelephoneVO } from './telephoneVO';
import { EmailVO } from './emailVO';
import { PostalAdresseVO } from './postalAdresseVO';
import { CmInterlocutorVO } from './cm-Interlocutor-vo';
import { MessageReceiverLight } from './MessageReceiverLight';
export interface MailInteractionVo {
interactionId: number;
firstName: String;
lastName : String;
motif: String;
creeLe : Date;
subjectStyle : String;
receivers : String;
receiverss: MessageReceiverLight[];
sender: String;
description : String;
body : String;
subject : String;
style : String;
messageCategory : String;
title: string;
subtitle: string;
isAutomatic: boolean;
}
