import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { HomologationVO } from '../../../../_core/models/homologation/homologation-vo';
import { PENICHE_PAYMENT_TYPE, CUSTOMER_OFFER, PRELEVEMENT_PENICHE_TYPES,
   DEFAULT_STRING_EMPTY_VALUE } from '../../../../_core/constants/constants';
import { HomologationService } from '../../../../_core/services/homologation.service';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';

@Component({
  selector: 'app-homologation-item-service',
  templateUrl: './homologation-item-service.component.html',
  styleUrls: ['./homologation-item-service.component.scss']
})
export class HomologationItemServiceComponent implements OnInit {

  customerId: string;
  @Input() homologation: HomologationVO;
  @Input() isAmendment: boolean;

  offre = '-';
  paymentsMethod = '-';
  modeReglement: any;
  reglementCompte: any;
  options = '-';
  hasThirdPayer = '-';
  nameThirdPayer = '-';
  showAccount: boolean;
  showParcoursTypes: boolean;
  servicePanelForm: FormGroup;
  
  paymentTypes = [{ key: 'PU', data: 'Parcours unique entreprise' }, { key: 'PM', data: 'Parcours multiple par bénéficiaire' } ];

  constructor(private readonly fb: FormBuilder, readonly homologationService: HomologationService) { }
  
  createFormGroup(): FormGroup {
    return this.fb.group({
      parcoursTypesList: this.fb.control(null)
    });
  }

  ngOnInit(): void {
    if (this.isAmendment) {
      this.offre = 'Parnasse pour un Groupe';
    } else {
      this.servicePanelForm = this.createFormGroup();

      /*si la décision de la préhomologation pas encore prise ou a été refusée*/
      if (this.homologation.prehomologationDecision === null || this.homologation.prehomologationDecision === false) {
          /*Offre PPG*/
        if (CUSTOMER_OFFER.PLURIEL_PARNASSE_ID.toString() === this.homologation.service.contractCode) {
          this.homologation.typeParcours = 'PU';
        } else {
          this.homologation.typeParcours = null;
        }
      }

      this.offre = this.homologation.service.offer ? this.homologation.service.offer : '-';
      if ( this.homologation.fees !== null ) {
        this.paymentsMethod = this.homologation.fees.paymentMethod ? this.prelevementFormatter(this.homologation.fees.paymentMethod) :
        (this.homologation.fees.paymentMethod ? this.homologation.fees.paymentMethod : '-');
      // tslint:disable-next-line: no-collapsible-if
      } else {
        if ( this.homologation.feesPaymentMethod === PRELEVEMENT_PENICHE_TYPES.PRELEVEMENT ) {
          this.paymentsMethod = this.homologation.feesPaymentMethod;
        } else {
          this.paymentsMethod = this.homologation.feesPaymentMethod ? this.prelevementFormatter(this.homologation.feesPaymentMethod) : '-';
        }
      }
      this.options = (this.homologation.service.options.length > 0 ) ? this.homologation.service.options[0] : '-' ;
      this.hasThirdPayer = this.homologation.service.hasThirdPayer ? 'Oui' : 'Non';
      this.nameThirdPayer = this.homologation.service.thirdPayerName ? this.homologation.service.thirdPayerName : '-';
      this.verifyAccountNumberAndFees();
      if ( CUSTOMER_OFFER.PLURIEL_PARNASSE_ID.toString() === this.homologation.service.contractCode ) {
        this.showParcoursTypes = true;
      }
    }
  }

  /* Check account SEPA */
  checkSEPAccount(): void {
    if ( this.homologation.fees !== null &&
      this.homologation.fees.paymentMethod === PENICHE_PAYMENT_TYPE.PRELEVEMENT && 
      this.homologation.fees.ibanTokenNumeroCompte !== null ) {	

      this.showAccount = true;
      const numCompteSize = this.homologation.fees.ibanTokenNumeroCompte.length;
      this.reglementCompte = PENICHE_PAYMENT_TYPE.INFO_BANK_SEPA_PRELEVMENT +
      this.homologation.fees.ibanTokenNumeroCompte.substring(numCompteSize - 4);

    } else {

      this.showAccount = false;

    }
  }

  /* Check accounts & fees */
  verifyAccountNumberAndFees(): any {
    
    this.checkSEPAccount();

    if ( this.homologation.service !== null && this.homologation.service.paymentMethod === 
     PENICHE_PAYMENT_TYPE.PRELEVEMENT && this.homologation.service.ibanTokenNumeroCompte !== null) {

      this.showAccount = true;
      const numCompteSize = this.homologation.service.ibanTokenNumeroCompte.length;
      this.reglementCompte = PENICHE_PAYMENT_TYPE.INFO_BANK_SEPA_PRELEVMENT +
      this.homologation.service.ibanTokenNumeroCompte.substring(numCompteSize - 4);

    } else if (this.homologation.service !== null && 
     (this.homologation.service.paymentMethod === PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB || 
       this.homologation.service.paymentMethod === PENICHE_PAYMENT_TYPE.PRELEVEMENT_AMEX) 
   && this.homologation.service.cbAmexToken !== null) {

      this.showAccount = true;
      const numeroCompteSize = this.homologation.service.cbAmexToken.length;	
      if ( this.homologation.service.paymentMethod === PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB) {
        this.reglementCompte = PENICHE_PAYMENT_TYPE.INFO_BANK_CB_PRELEVMENT +
          this.homologation.service.cbAmexToken.substring(numeroCompteSize - 4, numeroCompteSize);

      } else {
        this.reglementCompte = PENICHE_PAYMENT_TYPE.INFO_BANK_AMEX_PRELEVMENT + 
        this.homologation.service.cbAmexToken.substring(numeroCompteSize - 4, numeroCompteSize);
      }
    } 
    
    this.modeReglement = this.prelevementFormatter(this.homologation.service.paymentMethod);
  }

  /* Format upperCase Characters */
  prelevementFormatter(prelevement: string): string {
    if (isNullOrUndefined(prelevement) ) {
      return DEFAULT_STRING_EMPTY_VALUE;
    } 
    return ( PRELEVEMENT_PENICHE_TYPES[prelevement] ) ? PRELEVEMENT_PENICHE_TYPES[prelevement] : DEFAULT_STRING_EMPTY_VALUE;
  }

  onSelectChange(event: any): void {
    const parcours = this.paymentTypes.slice();
    const parcourType = parcours.filter((p) => p.data === event.target.value)[0].key;
    this.homologation.typeParcours = parcourType;
    // tslint:disable-next-line: no-console
    console.log('selected parcours type =', this.homologation.typeParcours);
  }

}
