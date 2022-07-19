import { CustomerTotalsDebt } from './../models/customer-totals-debt';
import { Injectable } from "@angular/core";
import { CONTRAT_STATUTS } from "../constants/constants";

@Injectable({
    providedIn:'root'
})
export class DebtRecouverementService{
    getNichesWithRemainingGreatThanZero(rowData: CustomerTotalsDebt[]) {
        return rowData.filter(debt=> debt.status !== CONTRAT_STATUTS.INACTIVE.key && this.calculateRemaining(debt) > 0)
                          .map(debt=> debt.nicheIdentifier);
    }

    calculateTotlaOfRemaining(rowData: CustomerTotalsDebt[]) {
        return rowData.filter(row=> row.status !== CONTRAT_STATUTS.INACTIVE.key)
                          .map((debt) => this.calculateRemaining(debt))
                          .reduce((a, b) => a + b, 0);
    }
    
    calculateRemaining(debt){
        return debt.detteTotalTTC - (-debt.totalCreditTTC);
    }
}