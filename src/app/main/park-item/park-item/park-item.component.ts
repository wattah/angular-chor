import { PersonService } from './../../../_core/services';
import { DebtRecouverementService } from './../../../_core/services/debt-recouverement.service';
import { CustomerTotalsDebt } from './../../../_core/models/customer-totals-debt';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';
import { GoodToKnowResolver } from '../../../_core/resolvers';

@Component({
  selector: 'app-park-item',
  templateUrl: './park-item.component.html',
  styleUrls: ['./park-item.component.scss']
})
export class ParkItemComponent implements OnInit {

  customerId: string;
  infoProfil: BeneficiaireView;
  goodToKnow: GoodToKnowResolver;
  recoveryDate: Date;
  typeCustomer: string;
  totalDebt: CustomerTotalsDebt[];
  nichesWithRemainingGreatThanZero: string[];
  entrepriseRecoveryDate: Date;
  nicheValue: string;
  detteTotalTTC: number;
  detteTotal: number;

  constructor(private readonly route: ActivatedRoute,
    private readonly debtRecouverementService: DebtRecouverementService,
    private readonly personService: PersonService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.route.queryParamMap.subscribe( params => {
      this.typeCustomer = params.get('typeCustomer');
    });
    this.route.data.subscribe(resolversData => {
      this.recoveryDate = resolversData['recoveryDate'];
      this.infoProfil = resolversData['infoProfil'];
      this.goodToKnow = resolversData['goodToKnow'];
      this.totalDebt = resolversData['totalDebt'];
    });
  }
}
