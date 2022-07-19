import { EntityBase } from './entity-base';
import { KeyWordsVO } from './models';
import { ReferenceDataVO } from './ReferenceDataVO';

export interface MessageTemplateLightVO extends EntityBase {
    id: number;
    label: string;
    message: string;
    object: string;
    title: string;
    subtitle: string;
    keyWordsList: KeyWordsVO[];
    language: ReferenceDataVO;
  }