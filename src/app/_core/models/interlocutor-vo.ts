import { TelephoneVO } from './telephoneVO';
import { EmailVO } from './emailVO';
import { PostalAdresseVO } from './postalAdresseVO';
import { CmInterlocutorVO } from './cm-Interlocutor-vo';
import { ReferenceDataVO } from './ReferenceDataVO';
export interface InterlocutorVO {

  telephones: TelephoneVO[];
  emails: EmailVO[];
  adresses: PostalAdresseVO[];

// ajouter nouveau bloc interlocuteur
  id: number;
  personId: number;
  firstName: string;
  lastName: string;
  companyName: string;
  crmName: string;
  categoryPersonKey: string;
  favoriteLanguage: string;
  title: string;
  roleLabel: string;
  roleKey: string;
  roles: ReferenceDataVO[];
  isAlsoMember: boolean;

  /**
	 * liste des moyens contacts par personne 
	 */
  contactMethodsVO: Array<CmInterlocutorVO>;


  /**
	 *un seul moyen de contact par personne 
	 */
  value: string;
  contactType: string;
  contactTypeKey: string;
  contactMethodId: number;
}
