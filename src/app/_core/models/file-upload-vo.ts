import { EntityBase } from './entity-base';

export interface FileUploadVO extends EntityBase {

 file: File;
 originalFilename: string;
 documentType: string;
 documentTitle: string;
 customizedName: string;
 title: string;
 documentTypeId: number;
 documentTitleId: number;
 comment: string;

}