import { CompteFacturation } from "./compte-facturation-vo";


export interface DetailsBillingAccounts {

    listBillingAccounts: CompteFacturation[];
	
	nbrTotalBillingAccounts: number;
	
	totalBalance: number;

}
