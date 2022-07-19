import { EntityBase } from './entity-base';

export interface DossierCompteFacturationVO extends EntityBase {
 lineIdentifier: string;
 lineStatus: string;
 lineAlias: string;
 lineDateStatus: string;
}
