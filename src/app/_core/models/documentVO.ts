import { EntityBase } from './entity-base';

export interface DocumentVO extends EntityBase {
  id: number;
  addDate: string;
  receiptDate: string;
  fileName: string;
  title: string;
  name: string;
  targetId: number;
  extension: string;
  titreDocument: string;
  titreDocumentId: number;
  typeDocument: string;
  dowloadUrl: string;
  checkUrl: boolean;
  customerNicheIdentifer: string;
  description: string;
  readOnly: boolean;
  category: number;
  targetType: string;
  documentTypeId: number;
  documentTitleId: number;
  file: any;
  isAccessibleFromPortal: boolean;
  requestType: string;
  isAnAuthorizedType: boolean;
  /**
   * attribut juste pour verification cote front
   */
  isRemove: boolean;
}
