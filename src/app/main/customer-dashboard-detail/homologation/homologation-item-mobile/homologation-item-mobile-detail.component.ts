import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Observable, of } from 'rxjs';

import { getDefaultStringEmptyValue, isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { HomologationService } from '../../../../_core/services/homologation.service';
import { PENICHE_PAYMENT_TYPE } from '../../../../_core/constants/constants';

@Component({
  selector: 'app-detail-cell-renderer',
  template: `
    <div style="height: 100%; margin-left: 40px; padding: 0 20px 0 20px; box-sizing: border-box;">
      <div class="row" > 
        <div class=" col-24 d-block mt-4 mb-4" >
            <div> <strong class="athena " >  IBAN : </strong> <span *ngIf="untokenizeTokenIBAN$ | async as untokenizeTokenIBAN; else loading" >
                  {{ untokenizeTokenIBAN }}</span>
            </div>
            <div> <strong class="athena " >  RIO :  </strong> {{ rio }}</div>
            <div> <strong class="athena " >  Option : </strong> {{ options }}</div>
         </div>
        </div>
      </div>
      <ng-template #loading>En cours de chargement ...</ng-template>
  `
})
export class HomologationItemMobileDetailComponent implements ICellRendererAngularComp {
  
  untokenizeTokenIBAN$: Observable<string>;
  rio: string;
  options: any;
  
  constructor(private readonly homologationService: HomologationService) { 
  }

  agInit(params: any): void {
    const data = params.data;
    this.rio = getDefaultStringEmptyValue(data.rio);
    this.options = data.options;
    this.options = (this.options.length <= 0 ) ? '-' : (this.options.length === 1 ) ? this.options[0] : this.options.join(' , ') ;
    const { paymentMethod, ibanTokenCodeIban, ibanTokenCodeBanque, ibanTokenCodeGuichet, ibanTokenNumeroCompte, ibanTokenCleRib } = data ;
    this.untokenizeTokenIBAN(paymentMethod, ibanTokenCodeIban, ibanTokenCodeBanque, ibanTokenCodeGuichet, ibanTokenNumeroCompte, ibanTokenCleRib);
  }

  untokenizeTokenIBAN(paymentMethod: string, ibanTokenCodeIban: string, ibanTokenCodeBanque: string,
    ibanTokenCodeGuichet: string, ibanTokenNumeroCompte: string, ibanTokenCleRib: string): void {
    if ( isNullOrUndefined(ibanTokenCodeIban) && isNullOrUndefined(ibanTokenCodeBanque) && isNullOrUndefined(ibanTokenCodeGuichet) 
      && isNullOrUndefined(ibanTokenNumeroCompte) && isNullOrUndefined(ibanTokenCleRib)) {
      this.untokenizeTokenIBAN$ = of('-');
    } else if (paymentMethod === PENICHE_PAYMENT_TYPE.PRELEVEMENT ) {
      this.untokenizeTokenIBAN$ = 
        this.homologationService.untokenizeTokenIBAN(ibanTokenCodeIban, ibanTokenCodeBanque, ibanTokenCodeGuichet, ibanTokenNumeroCompte, ibanTokenCleRib);
    } else {
      this.untokenizeTokenIBAN$ = of('-');
    }
  }

  refresh(_params: any): boolean {
    return false;
  }
}
