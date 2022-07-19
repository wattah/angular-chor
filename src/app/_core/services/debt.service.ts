import { CustomerTotalsDebt } from './../models/customer-totals-debt';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class DebteService{
    recoveryOfBill$ : Subject<{detteTotalTTC: number , detteTotal: number , nichesWithRemainingGreatThanZero: string[]}> = new Subject();
    errorInBill$: Subject<boolean> = new Subject();
}