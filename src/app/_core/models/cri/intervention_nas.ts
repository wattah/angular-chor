import { InterventionBackupNas } from './intervention-bckup-nas';
import { InterventionComptesUsersNas } from './intervention-comptes-users-nas';
import { EntityBase } from './../entity-base';
import { InterventionAutreStNas } from './intervention-autre-st-nas';
export interface InterventionNas extends EntityBase {
    id: number;
	interventionDetailsId: number;
	modele: string;
	nbDisk: string;
	capaciteDisk: string;
	ddns: string;
	idSyno: string;
	mdpSyno: string;
	quickconnect: string;
	isAudioSt: boolean;
	isFileSt: boolean;
	isSurveillanceSt: boolean;
	isVideoSt: boolean;
	isCloudSt: boolean;
	portAudio: string;
	portFile: string;
	portSurveillance: string;
	portVideo: string;
	portCloud: string;
	interventionAutreStNas: InterventionAutreStNas[];
	interventionComptesUsersNas: InterventionComptesUsersNas[];
	interventionBackupNas: InterventionBackupNas[];
	isBackup: boolean;
	comment: string;

}
