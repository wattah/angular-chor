import { ReferenceDataVO } from './reference-data-vo';
import { InterlocutorVO } from './interlocutor-vo';
import { CmInterlocutorVO } from './cm-Interlocutor-vo';

export interface CmUsageVO {
  id:number;
  interlocutor: InterlocutorVO;
  cmInterlocuteur: CmInterlocutorVO;
  usageRef: ReferenceDataVO;
  homeCM: CmInterlocutorVO;
  mobileCM: CmInterlocutorVO;
  emailCM: CmInterlocutorVO;
  addressCM: CmInterlocutorVO;
}
