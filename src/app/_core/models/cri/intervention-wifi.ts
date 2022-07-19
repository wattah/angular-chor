import { InterventionWifiAccessPointVO } from './intervention-wifi-access-point-vo';
import { EntityBase } from './../entity-base';
export interface InterventionWifi extends EntityBase {
    id: number;
	isLivebox: boolean;
	ssidLivebox: string;
	passwordLivebox: string;
	interventionDetailId: boolean;
	interventionWifiAccessPoint: InterventionWifiAccessPointVO[];
	comment: string;
}
