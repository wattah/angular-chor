import { DebtRecouverementService } from './../../_core/services/debt-recouverement.service';
import { CustomerTotalsDebt } from './../../_core/models/customer-totals-debt';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodToKnowResolver } from '../../_core/resolvers';
import { BeneficiaireView } from '../../_core/models/profil-infos-dashboard';
import { PersonService } from '../../_core/services';




@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

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
     private readonly router: Router,
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
      this.totalDebt = resolversData['totalDebt'];
      sessionStorage.setItem('companyNiche', this.infoProfil.companyNiche);
    });

  }

  forwardTo360() {
    if (this.typeCustomer === 'company') {
      this.router.navigate(
        ['/customer-dashboard/entreprise', this.customerId],
        {
          queryParamsHandling: 'merge',
          queryParams: {typeCustomer: this.typeCustomer }
        }
      );
    } else {
      this.router.navigate(
        ['/customer-dashboard/particular', this.customerId],
        {
          queryParamsHandling: 'merge'
        }
      );
    }
  }

}
