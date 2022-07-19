import { EntityBase } from './entity-base';
import { DocumentVO } from './documentVO';
import { FileUploadVO } from './file-upload-vo';

export interface Document extends EntityBase {
    documentVo: DocumentVO;
    fileUploadVO: FileUploadVO;
    file: File;
    
}