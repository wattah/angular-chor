import { EntityBase } from './entity-base';

export interface RequestChangeAbsenceStatusVO extends EntityBase{

    /** The connected user id. */
    connectedUserId: number;
    
	/** The absence id. */
	absenceId: number;

}
