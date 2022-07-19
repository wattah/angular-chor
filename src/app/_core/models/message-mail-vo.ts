import { EntityBase } from './entity-base';
import { DocumentVO } from './documentVO';
import { MessageVO } from './message-vo';

export interface MessageMailVo extends EntityBase {

    message: MessageVO;
    listFile: Array<DocumentVO>;
    isNewDoc: string;
    files: File[];
}