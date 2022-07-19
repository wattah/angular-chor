import { PersonService } from './../../../_core/services';
import { DebtRecouverementService } from './../../../_core/services/debt-recouverement.service';
import { CustomerTotalsDebt } from './../../../_core/models/customer-totals-debt';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CONSTANTS, COLOR_TYPE_CUSTOMER } from './../../../_core/constants/constants';
import { ContractsOffersVO } from '../../../_core/models/contracts-offers-vo';
import { CustomerTotalsDebtService } from '../../../_core/services/customer-totals-debt.service';
import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';

@Component({
  selector: 'app-accounting-state',
  templateUrl: './accounting-state.component.html',
  styleUrls: ['./accounting-state.component.scss']
})
export class AccountingStateComponent implements OnInit {
  customerId: string;
  typeCustomer: string;
  infoCustomer: BeneficiaireView;
  recoveryDate: Date;
  contractsOffers: ContractsOffersVO;
  nicheIdentifier:string;
  nicheIdentifiant: string;
  offerLabel: string;
  offerLabelChange: string;
  isEntreprise: boolean;
  isParticular: boolean;
  DEF_MVT_CF_SORT_FIELD = 'dateMouvement';
  totalDebts: CustomerTotalsDebt[];
  nichesWithRemainingGreatThanZero: string[];
  entrepriseRecoveryDate: Date;
  detteTotalTTC: number;
  detteTotal: number;
  constructor(private readonly route: ActivatedRoute,
    private readonly totalDebt: CustomerTotalsDebtService,
    private readonly debtRecouverementService: DebtRecouverementService,
    private personService: PersonService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.isEntreprise = ( this.typeCustomer === CONSTANTS.TYPE_COMPANY );
    this.isParticular = (this.typeCustomer === CONSTANTS.TYPE_PARTICULAR );
    this.route.data.subscribe(resolversData => {
      this.contractsOffers = resolversData['contractsOffers'];
      this.totalDebts = resolversData['totalDebt'];
      if(!isNullOrUndefined(this.contractsOffers)) {
        this.nicheIdentifiant = this.contractsOffers[0].nicheIdentifier;
        this.offerLabelChange = this.contractsOffers[0].offerLabel;
      }
      this.infoCustomer = resolversData['infoCustomer'];
      this.getRecoveryInformation();
      this.recoveryDate = resolversData['dateRecouvrement'];
    });
  }

  getContractOfferSelected(event): void {
    this.nicheIdentifiant = event.nicheIdentifier;
    this.offerLabelChange = event.offerLabel;
  }
  
  getClassEnvByTypeCustomer(): string {
    return 'env-' + COLOR_TYPE_CUSTOMER[this.typeCustomer];
  }

  private getRecoveryInformation() {
    if (this.totalDebts && this.totalDebts.length !== 0) {
      const debt = this.totalDebts.find(d => d.nicheIdentifier === this.infoCustomer.nicheIdentifier);
      this.detteTotalTTC = debt ? this.debtRecouverementService.calculateRemaining(debt) : 0,
      this.detteTotal = this.debtRecouverementService.calculateTotlaOfRemaining(this.totalDebts),
      this.nichesWithRemainingGreatThanZero = this.debtRecouverementService.getNichesWithRemainingGreatThanZero(this.totalDebts);
      if(!isNullOrUndefined(this.nichesWithRemainingGreatThanZero) && this.nichesWithRemainingGreatThanZero.length > 0){
        this.personService.getEntrepriseRecoveryDate(this.nichesWithRemainingGreatThanZero).subscribe(
          (data) => this.entrepriseRecoveryDate = data
        );
      }
    
    }
  }

}
