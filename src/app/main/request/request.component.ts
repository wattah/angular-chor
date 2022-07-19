import { CustomerTotalsDebt } from './../../_core/models/customer-totals-debt';
import { DebtRecouverementService } from './../../_core/services/debt-recouverement.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerReferentLight } from '../../_core/models/customer-referent-light';

import { BeneficiaireView } from '../../_core/models/profil-infos-dashboard';
import { GoodToKnowResolver } from '../../_core/resolvers';
import { PersonService } from '../../_core/services';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  customerId: string;
  infoProfil: BeneficiaireView;
  goodToKnow: GoodToKnowResolver;
  recoveryDate: Date;
  typeCustomer: string;
  referents: CustomerReferentLight[];
  totalDebt: CustomerTotalsDebt[];
  nichesWithRemainingGreatThanZero: string[];
  entrepriseRecoveryDate: Date;
  nicheValue: string;
  detteTotalTTC: number;
  detteTotal: number;
  constructor(private route: ActivatedRoute,
    private readonly debtRecouverementService: DebtRecouverementService,
    private readonly personService: PersonService) { }

  ngOnInit() {
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.route.data.subscribe(resolversData => {
      this.recoveryDate = resolversData['recoveryDate'];
      this.infoProfil = resolversData['infoProfil'];
      this.goodToKnow = resolversData['goodToKnow'];
      this.referents = resolversData['referents'];
      this.totalDebt = resolversData['totalDebt'];
    });
  }
}
