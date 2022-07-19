import { DebtRecouverementService } from './../../../_core/services/debt-recouverement.service';
import { CustomerTotalsDebt } from './../../../_core/models/customer-totals-debt';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';
import { GoodToKnowResolver } from '../../../_core/resolvers';
import { CONSTANTS } from '../../../_core/constants/constants';
import { PersonService } from '../../../_core/services';

@Component({
  selector: 'app-see-all',
  templateUrl: './see-all.component.html',
  styleUrls: ['./see-all.component.scss']
})
export class SeeAllComponent implements OnInit {
  customerId: string;

  infoProfil: BeneficiaireView;
  goodToKnow: GoodToKnowResolver;

  isEntreprise: boolean;
  isParticular:boolean;

  recoveryDate: Date;

  typeCustomer: string;
  totalDebt: CustomerTotalsDebt[];
  nichesWithRemainingGreatThanZero: string[];
  entrepriseRecoveryDate: Date;
  nicheValue: string;
  detteTotalTTC: number;
  detteTotal: number;

  constructor(private readonly route: ActivatedRoute ,
    private readonly debtRecouverementService: DebtRecouverementService,
    private personService: PersonService) {}
    

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.isEntreprise = ( this.typeCustomer === CONSTANTS.TYPE_COMPANY); 
    this.isParticular=( this.typeCustomer === CONSTANTS.TYPE_PARTICULAR); 
    this.route.data.subscribe(resolversData => {
      this.recoveryDate = resolversData['recoveryDate'];
      this.infoProfil = resolversData['infoProfil'];
      this.goodToKnow = resolversData['goodToKnow'];
      this.totalDebt = resolversData['totalDebt'];
    });
  }
}
