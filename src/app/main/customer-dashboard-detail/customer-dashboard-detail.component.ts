import { PersonService, CustomerService } from '../../_core/services';
import { DebtRecouverementService } from './../../_core/services/debt-recouverement.service';
import { CustomerTotalsDebt } from './../../_core/models/customer-totals-debt';
import { AfterContentInit, AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InteractionService } from './interaction.service';

import { CONSTANTS } from '../../_core/constants/constants';
import { BeneficiaireView } from '../../_core/models/profil-infos-dashboard';
import { GoodToKnowResolver } from '../../_core/resolvers';

@Component({
  selector: 'app-customer-dashboard-detail',
  templateUrl: './customer-dashboard-detail.component.html',
  styleUrls: ['./customer-dashboard-detail.component.scss']
})
export class CustomerDashboardDetailComponent implements OnInit, AfterViewChecked {
  
  customerId: string;
  infoProfil: BeneficiaireView;
  goodToKnow: GoodToKnowResolver;
  recoveryDate: Date;
  typeCustomer: string; 
  isSowLink360 = false; 
  referents : any;
  static readonly CONSTANTS = CONSTANTS;
  totalDebt: CustomerTotalsDebt[];
  nichesWithRemainingGreatThanZero: string[];
  entrepriseRecoveryDate: Date;
  nicheValue: string;
  detteTotalTTC: number;
  detteTotal: number;
  constructor(readonly route: ActivatedRoute, 
    readonly service: InteractionService,
    readonly cdRef : ChangeDetectorRef,
    readonly customerService: CustomerService,
    private readonly debtRecouverementService: DebtRecouverementService,
    private readonly personService: PersonService) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.route.data.subscribe(resolversData => {
      this.recoveryDate = resolversData['recoveryDate'];
      this.initProfile();
      this.referents = resolversData['referents'];
      this.goodToKnow = resolversData['goodToKnow'];
      this.totalDebt = resolversData['totalDebt'];
    });

    let refresh = false;
    this.service.isRefresh$.subscribe(res =>  {
      refresh = res;
      if(refresh) {
        this.initProfile();
        refresh = false;
      }
    });
    
  }



  initProfile(): void {
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    const isParticular = ( this.typeCustomer === CONSTANTS.TYPE_PARTICULAR );
    const isTitular = (  this.typeCustomer  === CONSTANTS.TYPE_COMPANY );
    this.customerService.getProfilView(this.customerId, Boolean(isParticular), Boolean(isTitular)).subscribe( data => {
       this.infoProfil = data;
    });
    this.customerService.getListReferents(this.customerId).subscribe( data => this.referents = data);

    
  }

  ngAfterViewChecked(){
    let show ;
    
    this.service.data$.subscribe(res => show = res) ;
    if(show !== this.isSowLink360){
      this.isSowLink360 = show;
      this.cdRef.detectChanges();
    }
    
  }
}
