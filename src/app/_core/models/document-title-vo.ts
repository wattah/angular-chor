import { EntityBase } from './entity-base';

export interface DocumentTitleVO extends EntityBase {
    id: number;
    trigram: string;
    documentTitle: string;
    documentTypeName: string;
    documentTypeId: number;
  }