import { InterventionWifiLocationVO } from './intervention-wifi-location-vo';
import { ReferenceDataVO } from './../reference-data-vo';
import { EntityBase } from './../entity-base';
export interface InterventionWifiAccessPointVO extends EntityBase {
    id: number;
	ssid: string;
	password: string;
	interventionWifiLocation: InterventionWifiLocationVO[];
	interventionWifiVOId: number;
	modelBorne: string;
	isControler: boolean;
	refControlerLocationType: ReferenceDataVO;
	autreEmplacement: string;
	identifiant: string;
	ipAdresse: string;
	passwordController: string;
}
