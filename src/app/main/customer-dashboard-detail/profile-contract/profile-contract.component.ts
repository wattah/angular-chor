import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoodToKnowResolver } from '../../../_core/resolvers';
import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';

@Component({
  selector: 'app-profile-contract',
  templateUrl: './profile-contract.component.html',
  styleUrls: ['./profile-contract.component.scss']
})
export class ProfileContractComponent implements OnInit {

 
  customerId: string;
  infoProfil: BeneficiaireView;
  goodToKnow: GoodToKnowResolver;
  recoveryDate: Date;
  typeCustomer: string;

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.route.data.subscribe(resolversData => {
      this.recoveryDate = resolversData['recoveryDate'];
      this.infoProfil = resolversData['infoProfil'];
      this.goodToKnow = resolversData['goodToKnow'];
    });

  }


}
