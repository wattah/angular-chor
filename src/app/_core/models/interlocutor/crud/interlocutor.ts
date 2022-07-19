import { ContactMethodNew } from './contact-methode-new';
import { Role } from './role';

export interface Interlocutor {
    idPerson: number;
    customerId: number;
    civilite: string;
    firstName: string;
    lastName: string;
    crmName: string;
    companyName: string;
    favoritLanguage: string;
    favoritLanguageKey: string;
    categoryPersonKey: string;
    roles: Role[];
    listCm : ContactMethodNew[];
    
}
