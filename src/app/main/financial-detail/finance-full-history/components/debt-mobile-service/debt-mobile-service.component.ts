import { firstNameFormatter, formatterStatut } from './../../../../../_core/utils/formatter-utils';
import { DebteService } from './../../../../../_core/services/debt.service';
import { DebtRecouverementService } from './../../../../../_core/services/debt-recouverement.service';
import { CustomerService } from './../../../../../_core/services/customer.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CustomerTotalsDebt, SelectedDebt } from '../../../../../_core/models/customer-totals-debt';
import { BeneficiaireView } from '../../../../../_core/models/profil-infos-dashboard';
import { CONTRAT_STATUTS } from '../../../../../_core/constants/constants';
import { CustomersLight } from '../../../../../_core/models/customers_light';
import { map, switchMap } from 'rxjs/operators';
import { isNullOrUndefined } from '../../../../../_core/utils/string-utils';


@Component({
  selector: 'app-debt-mobile-service',
  templateUrl: './debt-mobile-service.component.html',
  styleUrls: ['./debt-mobile-service.component.scss']
})
export class DebtMobileServiceComponent implements OnInit, OnChanges {

  @ Input()
  totalDebt: CustomerTotalsDebt[];
   chaine : any[] = [];

  @Input()
  severalCustomerTit: CustomersLight[];
 
  @ Input()
  typeCustomer: string;

  mobile = [];

  service = [];
  totauxMobile ;
  totauxServices ;
  listCustomers = [];
  listbenef = [];

  listActifBenif  : any[] = [];
 
  @Input()
  selectedDebt: SelectedDebt;

  @Output()
  changeSelectedDebt: EventEmitter<SelectedDebt> = new EventEmitter<SelectedDebt>();

  total: { detteTotalTTC: number; detteTotal: number; nichesWithRemainingGreatThanZero: string[]; };
  LOCAL_CONTRAT_STATUTS = CONTRAT_STATUTS;

  @Output()
  selectedProfilView : EventEmitter<BeneficiaireView> = new EventEmitter<BeneficiaireView>();

  @Input() nicheIdentifier : string;
  constructor(private readonly route: ActivatedRoute ,
    private readonly debtRecouverementService: DebtRecouverementService ,
    private readonly debteService: DebteService, private readonly customerService : CustomerService) { }


  ngOnInit(): void {
    this .countTotaux();
    this.sendDetteTotalTTCToProfil();
    this.formatterbenef();
  }

  ngOnChanges(changes) {
    if( ( changes['totalDebt'] || changes['nicheIdentifier'] ) && !isNullOrUndefined(this.totalDebt) && !isNullOrUndefined(this.nicheIdentifier)) {
      this .countTotaux();
      this.sendDetteTotalTTCToProfil();
      this.formatterbenef();
    }
  }

  countTotaux(): void {
    this .totauxMobile = 0.00;
    this .totauxServices = 0.00;
    if (this .totalDebt !== undefined && this .totalDebt !== null) {  
      for ( const t of this .totalDebt) {
        this .totauxMobile += t.detteMobileTTC;
        this .totauxServices += t.detteServiceTTC;
        this .mobile.push(t.detteMobileTTC.toFixed(2));
        this .service.push(t.detteServiceTTC.toFixed(2));
      }
      this .totauxMobile = (this .totauxMobile).toFixed(2);
      this .totauxServices = (this .totauxServices).toFixed(2);
    }
  }

  selectDebt(rowSelected: number, mobileSelected: boolean, serviceSelected: boolean, internetSelected: boolean,
    contractSelected: CustomerTotalsDebt): void {
          this.selectedDebt = {
      ...this.selectedDebt,
      rowSelected,
      mobileSelected, 
      contractSelected,
      serviceSelected,
      internetSelected,
      hasNext : (rowSelected !== this.totalDebt.length - 1),
      hasPrevious : (rowSelected !== 0) ,
      showInactifAccounts: false
    };
    this.changeSelectedDebt.emit(this.selectedDebt);
    this.customerService.getProfilViewByNicheIdentifier(this.selectedDebt.contractSelected.nicheIdentifier).subscribe(data => {
      this.selectedProfilView.emit(data);
    });
    this.nicheIdentifier = contractSelected.nicheIdentifier;
    this.sendDetteTotalTTCToProfil();
  }

  formatterStatut(value: string): string {
    return formatterStatut(value);
  }

  formatterbenef(): any  {
    this.totalDebt.forEach(element => {
     element.beneficiaryList = [];
      this.severalCustomerTit.forEach(benef => {
      if(benef.nichIdentifiant === element.nicheIdentifier ){
        element.beneficiaryList = benef.beneficiaryList 
      } 
      });
    });
  }

  private sendDetteTotalTTCToProfil() {
    const debt = this.totalDebt.find(d => d.nicheIdentifier === this.nicheIdentifier);
    this.total = {
        detteTotalTTC: debt ? this.debtRecouverementService.calculateRemaining(debt):0,
        detteTotal: this.debtRecouverementService.calculateTotlaOfRemaining(this.totalDebt),
        nichesWithRemainingGreatThanZero: this.debtRecouverementService.getNichesWithRemainingGreatThanZero(this.totalDebt) 
    }
    this.debteService.recoveryOfBill$.next(this.total)
  }
  
  nameFormatter(object){
    if(object){
      const lastName= object.lastName ? object.lastName:'';
      const firstName = object.firstName ? object.firstName:'';
      return `${firstNameFormatter(firstName)} ${lastName.toUpperCase()}`;
    }
    return '-'
  }
}


