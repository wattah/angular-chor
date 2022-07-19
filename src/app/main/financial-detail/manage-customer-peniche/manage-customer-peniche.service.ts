import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageCustomerPenicheService {

    /**
     * true: consulation
     * false: modification
     */  
    consultationModePage$ = new BehaviorSubject(true);
    doesCustomerPenicheExist = false;

    constructor() {
        this.setConsultationModeInLocalStorage(true);
        this.consultationModePage$.next(this.getConsultationModeFromLocalStorage());
    }

    updateConsultationModePage(newMode: boolean): void {
        this.consultationModePage$.next(newMode);
        this.setConsultationModeInLocalStorage(newMode);
    }

    getConsultationModePage(): BehaviorSubject<boolean> {
        return this.consultationModePage$;
    }

    getConsultationModeFromLocalStorage(): boolean {
        return localStorage.getItem('mode_consultation_customer_peniche').toLowerCase() === 'true'; 
    }

    setConsultationModeInLocalStorage(mode: boolean): void {
        localStorage.setItem('mode_consultation_customer_peniche', mode.toString());
    } 

    getUpdateFlag(): boolean {
        return this.doesCustomerPenicheExist; 
    }

    setUpdateFlag(value: boolean): void {
        this.doesCustomerPenicheExist = value ; 
    } 
}