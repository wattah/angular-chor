import { EntityBase } from './entity-base';
import { CustomerView } from './customer-view';
import { CustomerParcItemVO } from './customer-parc-item-vo';
import { RequestCustomerVO } from './request-customer-vo';

/**
 * Contient les données pour afficher une fiche client
 */
export interface LiveEngageView extends EntityBase {

    customerId: Number;
    customerView : CustomerView;
    numeroLignes : CustomerParcItemVO;
    lastInteractionDate : string;
    lastClosedRequest : RequestCustomerVO;
    lastPendingRequest : RequestCustomerVO;
    lastCoachMeeting : string;
    lastSaveOpaqueIdDate : string;
    customerFirstName: string;
    customerLastName: string;
    civility: string;
    companyName: string;
}