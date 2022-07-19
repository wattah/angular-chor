import { CustomerService } from './../../../_core/services/customer.service';
import { getEncryptedValue } from './../../../_core/utils/functions-utils';
import { toUpperCase } from '../../../_core/utils/formatter-utils';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CustomerTotalsDebt, SelectedDebt } from '../../../_core/models/customer-totals-debt';
import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';
import { CONSTANTS, COLOR_TYPE_CUSTOMER, UNIVERS_PENICHE } from '../../../_core/constants/constants';
import { DetailsDebtsBillingAccountService } from '../../../_core/services/details-debts-billing-account.service';
import { CompteFacturation } from '../../../_core/models/compte-facturation-vo';
import { CustomersLight } from '../../../_core/models/customers_light';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { DebtMobileServiceComponent } from './components/debt-mobile-service/debt-mobile-service.component';
import { PersonService } from '../../../_core/services';
import { CustomerDebtService } from '../../../_core/services/customer-debt.service';
import { DetailsBillingAccounts } from '../../../_core/models/details-billing-accounts';

@Component({
  selector: 'app-finance-full-history',
  templateUrl: './finance-full-history.component.html',
  styleUrls: ['./finance-full-history.component.scss']
})
export class FinanceFullHistoryComponent implements OnInit {

  customerId: string;
  recoveryDate: Date;
  infoCustomer: BeneficiaireView;
  totalDebt: CustomerTotalsDebt[];
  isEntreprise: boolean;
  isParticular: boolean;
  severalCustomerTit: CustomersLight[];
  debtsOfBillingAccount: DetailsBillingAccounts;
  loadingActifAccounts: boolean;

  @ViewChild(DebtMobileServiceComponent, {static: false}) debtMobilServiceComponentChild:DebtMobileServiceComponent;
  fromBillAccountNumSearchType : string;
  searchPattern : string;
  realNicheIdentifier : string = null;
  nextOrPreviousClicked : boolean = false;
  readonly constants = CONSTANTS;
  typeCustomer: string;
  nicheIdentifier : string;
  selectedUnivers : string;
  selectedDebt: SelectedDebt;
  entrepriseRecoveryDate: Date;
  detteTotalTTC: number;
  detteTotal : number;
  selectedProfilView : BeneficiaireView;
  constructor( private route: ActivatedRoute,
    private readonly customerDebt: CustomerDebtService,
    private readonly detailsDebtsBillingAccountService: DetailsDebtsBillingAccountService,
    private readonly personService: PersonService,
    private readonly customerService : CustomerService){}

  ngOnInit(): void { 
    this .route.data.subscribe(resolversData => {
      this .totalDebt = resolversData['totalDebt'];    
      this.infoCustomer = resolversData['infoCustomer'];
      this.recoveryDate = resolversData['dateRecouvrement'];
      this.debtsOfBillingAccount = resolversData['detailsDebtsBillingAccount'];
      this.severalCustomerTit = resolversData['severalCustomerTit'];
  
    });
    

    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });

    this.route.queryParamMap.subscribe( params => {
      this.nicheIdentifier = params.get('nicheIdentifier');
      this.searchPattern = params.get('searchPattern');
      this.typeCustomer = params.get('typeCustomer');
      const rowSelected = Number(params.get('rowSelected'));
      const mobileSelected = params.get('mobileSelected');
      this.selectedUnivers = params.get('univers'); 
      if (isNullOrUndefined(this.selectedUnivers)) {
        const mobileSelected = params.get('mobileSelected');
        let isMobile = mobileSelected || params.get('univers') === UNIVERS_PENICHE.MOBILE.code;
        this.selectedUnivers = UNIVERS_PENICHE[isMobile ? 'MOBILE' : 'SERVICE' ].code;
      }
      this .selectedDebt = {
        ...this.selectedDebt,
        mobileSelected : ( mobileSelected === 'true' ) || (this.selectedUnivers === UNIVERS_PENICHE.MOBILE.code),
        serviceSelected : (this.selectedUnivers === UNIVERS_PENICHE.SERVICE.code),
        universSelected :this.selectedUnivers,
        rowSelected : rowSelected, 
        contractSelected: this.totalDebt[rowSelected],
        hasNext : (rowSelected !== this.totalDebt.length - 1),
        hasPrevious : (rowSelected !== 0) 
      };
      this.isEntreprise = ( this.typeCustomer === CONSTANTS.TYPE_COMPANY );
      this.isParticular = (this.typeCustomer === CONSTANTS.TYPE_PARTICULAR );
      this.fromBillAccountNumSearchType = params.get('fromBillAccountNumSearchType');
      if(this.fromBillAccountNumSearchType && isNullOrUndefined(this.realNicheIdentifier)){
        this.getToTheRightNicheIdentifierDetailsDebts(this .selectedDebt);
      }
    });
  }


  
  onChangeSelectedDebt( event: SelectedDebt): void {
    this.selectedDebt = event;
    this.getDetailDebtBillingAccounts();
  }
  
  
  onChangeSelectedProfilView(event : BeneficiaireView){
    this.selectedProfilView = event;
    this.customerId = getEncryptedValue(this.selectedProfilView.id);
    this.customerService.getProfilView(this.customerId,this.isParticular,this.isEntreprise).subscribe( data => {
      if(data){
        this.infoCustomer = data;
        this.customerDebt.getRecoveryDate(this.customerId).subscribe(date=> this.recoveryDate = date);
      }
    });
    
  }

  
  
  getToTheRightNicheIdentifierDetailsDebts(event: SelectedDebt){
    // check if the client has only one account
    if(this.totalDebt && this.totalDebt.length === 1){
      this.realNicheIdentifier = this.totalDebt[0].nicheIdentifier;
      // Ajouter l'appel au ws getDetailsDebts...
      this.loadingActifAccounts = true;
      this.detailsDebtsBillingAccountService.getDetailsDebts(this.realNicheIdentifier,this.selectedUnivers, 'Actif' ).subscribe(data => { 
            if(  !isNullOrUndefined(data) ) {
            this.selectedDebt = {
              ...this.selectedDebt,
              rowSelected : 0, 
              contractSelected: this.totalDebt[0],
              hasNext : false,
              hasPrevious : false, 
              showInactifAccounts: false
            };

            this.debtMobilServiceComponentChild.selectedDebt = this.selectedDebt;
          
              this.debtsOfBillingAccount=data;
            }
            this.loadingActifAccounts = false;
        },
        err => {this.loadingActifAccounts = false});
    }

    // check if the client has multiple accounts, if true get the right account which agree with the searched pattern
    if(this.totalDebt && this.totalDebt.length > 1){
      this.getDataForTheRightNicheIdentifierForMultipleAccount();
    }
}

getDataForTheRightNicheIdentifierForMultipleAccount(){
    let indexOfTheRightDebt;
    this.totalDebt.forEach(debt =>{
      if(isNullOrUndefined(this.realNicheIdentifier)){
        this.loadingActifAccounts = true;
        this.detailsDebtsBillingAccountService.getDetailsDebts(debt.nicheIdentifier, this.selectedUnivers, 'Actif').subscribe(data => {               
            if( !isNullOrUndefined(data) ) {
              data.listBillingAccounts.forEach(billAccount =>{
                if(isNullOrUndefined(this.realNicheIdentifier) && billAccount.identifier && billAccount.identifier.includes(this.searchPattern)){
                  this.realNicheIdentifier = debt.nicheIdentifier;
                  indexOfTheRightDebt = this.totalDebt.indexOf(debt);
                  this.selectedDebt = {
                    ...this.selectedDebt,
                    rowSelected : indexOfTheRightDebt, 
                    contractSelected: this.totalDebt[indexOfTheRightDebt],
                    hasNext : (indexOfTheRightDebt !== this.totalDebt.length - 1),
                    hasPrevious : (indexOfTheRightDebt !== 0), 
                  };
                  this.debtsOfBillingAccount=data;
                  this.debtMobilServiceComponentChild.selectedDebt = this.selectedDebt;
                 this.customerService.getProfilViewByNicheIdentifier(this.realNicheIdentifier).subscribe(profil => {
                    this.customerId = getEncryptedValue(profil.id);
                        this.customerService.getProfilView(this.customerId,this.isParticular,this.isEntreprise).subscribe( info => {
                          if(info){
                            this.infoCustomer = info;
                            this.customerDebt.getRecoveryDate(this.customerId).subscribe(dat=> this.recoveryDate = dat);
                          }
                    });
                  });                
                }
              });
            }
            this.loadingActifAccounts = false;
        },
        err => { this.loadingActifAccounts = false});
      }
    });
}

  getArrowLeftClass(): string {
    return (this.selectedDebt.hasPrevious) ? 'arrow-left-blue' : 'arrow-left-grey';
  }

  getArrowRightClass(): string {
    return (this.selectedDebt.hasNext) ? 'arrow-right-blue' : 'arrow-right-grey';
  }
  
  getClassEnvByTypeCustomer(): string {
    return 'env-' + COLOR_TYPE_CUSTOMER[this.typeCustomer];
  }

  goToTheNextDebt(): void {
    if ( this.selectedDebt.hasNext ) {
      this.nextOrPreviousClicked = true;
      const nextRowSelected = this.selectedDebt.rowSelected + 1;
      this .selectedDebt = {
        ...this.selectedDebt,
        rowSelected: nextRowSelected, 
        contractSelected: this .totalDebt[nextRowSelected],
        hasNext : (nextRowSelected !== this.totalDebt.length - 1),
        hasPrevious : (nextRowSelected !== 0) 
      };
      this.getDetailDebtBillingAccounts();
    }
  }

  goToThePreviousDebt(): void {
    if ( this.selectedDebt.hasPrevious ) {
      this.nextOrPreviousClicked = true;
      const prevRowSelected = this.selectedDebt.rowSelected - 1;
      this .selectedDebt = {
        ...this.selectedDebt,
        rowSelected: prevRowSelected, 
        contractSelected: this.totalDebt[prevRowSelected],
        hasNext : (prevRowSelected !== this.totalDebt.length - 1),
        hasPrevious : (prevRowSelected !== 0) 
      };
      this.getDetailDebtBillingAccounts();
    } 
  }

  onSendNichesWithRemainingGreatThanZeroEvent(nichesWithRemainingGreatThanZero: string[]){
    if(!isNullOrUndefined(nichesWithRemainingGreatThanZero) && nichesWithRemainingGreatThanZero.length > 0){
      this.personService.getEntrepriseRecoveryDate(nichesWithRemainingGreatThanZero).subscribe(
        (data)=>this.entrepriseRecoveryDate = data
      );
    }
   
  }
  onSendRemainingEvent(detteTotalTTC: number){
    this.detteTotalTTC = detteTotalTTC;
  }

  /**
   * 
   */
  getDetailDebtBillingAccounts(): void {
    const statut = 'Actif' as const;
    this.selectedDebt = {
      ...this.selectedDebt,
      showInactifAccounts: false
    }
    this.loadingActifAccounts = true;
    this.detailsDebtsBillingAccountService.getDetailsDebts(this.selectedDebt.contractSelected.nicheIdentifier, this.selectedDebt.universSelected, statut)
    .subscribe(data => { 
      this.debtsOfBillingAccount=data;
      this.loadingActifAccounts = false;
    },
    err => { this.loadingActifAccounts = false; });
  }
}
