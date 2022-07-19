import { AbsenceLight } from './absence-light';

export interface CustomerReferentVO {
    id: number;
    customerId: number;
    userId: number;
    userName: string;
    roleId: number;
    roleName: string;
    lastName: string;
    firstName: string;
    currentAbsence: AbsenceLight;
    email: string;
    parnasseEmail: string;
  }
