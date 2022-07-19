import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/**
 * CHANGE THE PATH
 */
import { CustomerTotalsDebt } from 'src/app/_core/models/customer-totals-debt';
import { BeneficiaireView } from 'src/app/_core/models/profil-infos-dashboard';
import { GoodToKnowResolver } from 'src/app/_core/resolvers/customer-dashboard/good-to-know.resolver';
import { ManageCustomerPenicheService } from './manage-customer-peniche.service';

@Component({
  selector: 'app-manage-customer-peniche',
  templateUrl: './manage-customer-peniche.component.html',
  styleUrls: ['./manage-customer-peniche.component.scss']
})

export class ManageCustomerPenicheComponent implements OnInit {
    infoProfil: BeneficiaireView;
    goodToKnow: GoodToKnowResolver;
    recoveryDate: Date;
    typeCustomer: string;
    totalDebt: CustomerTotalsDebt[];
    customerId: string;
    nicheIdentifier: string;
    isUpdateMode = false;
    consultationModePage$: BehaviorSubject<boolean>;
    modificationBlockClientPeniche: boolean;
    constructor(private readonly route: ActivatedRoute, 
      private readonly manageCustomerPenicheService: ManageCustomerPenicheService) { }

    ngOnInit(): void {
        this.consultationModePage$ = this.manageCustomerPenicheService.getConsultationModePage();
        this.route.queryParamMap.subscribe(params => {
            this.typeCustomer = params.get('typeCustomer');
            this.nicheIdentifier = params.get('nicheIdentifier');
          });
      
          this.route.paramMap.subscribe( params => {
            this.customerId = params.get('customerId');
          });
          
          this.route.data.subscribe(resolversData => {
            this.recoveryDate = resolversData['recoveryDate'];
            this.infoProfil = resolversData['infoProfil'];
            this.goodToKnow = resolversData['goodToKnow'];
            this.totalDebt = resolversData['totalDebt'];
          });
    }

    onUpdateCustomerPeniche(mode: boolean): void {
      this.manageCustomerPenicheService.updateConsultationModePage(mode);
      this.manageCustomerPenicheService.setUpdateFlag(true);
    }
}
