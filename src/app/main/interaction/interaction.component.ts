import { DebtRecouverementService } from './../../_core/services/debt-recouverement.service';
import { CustomerTotalsDebt } from './../../_core/models/customer-totals-debt';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GoodToKnowResolver } from '../../_core/resolvers';
import { BeneficiaireView } from '../../_core/models/profil-infos-dashboard';
import { PersonService } from './../../_core/services';

@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.scss']
})
export class InteractionComponent implements OnInit {

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
    private readonly personService: PersonService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.route.data.subscribe(resolversData => {
      this.recoveryDate = resolversData['recoveryDate'];
      this.infoProfil = resolversData['infoProfil'];
      this.goodToKnow = resolversData['goodToKnow'];
      this.totalDebt = resolversData['totalDebt'];
    });
  }
}
