import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CustomerParcLigneDetailVO } from '../../../_core/models/customer-parc-ligne-detail-vo';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { NestedOfferVO } from '../../../_core/models/nested-offer-vo';
import { ParkItemService } from './park-item-detail.service';
import { GassiMockLoginService } from '../../../_core/services';
import { ADA_PERMISSIONS } from '../../../_core/constants/constants';


@Component({
  selector: 'app-park-item-detail',
  templateUrl: './park-item-detail.component.html',
  styleUrls: ['./park-item-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParkItemDetailComponent implements OnInit {

  parcItemLigneDetail: CustomerParcLigneDetailVO;
  offers: NestedOfferVO[];
  isExistOffers = false;
  lengthOffersDetail = 0;
  columnDefsDetailInternet: any;
  rowDataDetailInternet: any;
  autoGroupColumnDef: any;
  defaultColDef;
  FIXE = 'FIXE';

  canShowAdaBanner: boolean;

  constructor(private readonly route: ActivatedRoute, private readonly parkItemService: ParkItemService,
    private readonly gassiMockLoginService: GassiMockLoginService) {
      
  }

  ngOnInit(): void {
    this.route.data.subscribe(resolversData => {
      this.parcItemLigneDetail = resolversData['parcItemLigneDetail'];
      if (!isNullOrUndefined(this.parcItemLigneDetail) && 
      !isNullOrUndefined(this.parcItemLigneDetail.offers) && this.parcItemLigneDetail.offers.length > 0) {
        this.offers = this.parcItemLigneDetail.offers;
      }
    });
    this.hasAdaPermissions();
  }

  selectWebServiceIdentifier(): void {
    this.parkItemService.selectWebserviceIdentifier(this.parcItemLigneDetail.webserviceIdentifier);
  }

  hasAdaPermissions() {
    this.gassiMockLoginService.getCurrentConnectedUser().subscribe(
      user => {
        this.canShowAdaBanner = user.activeRole.permissions.includes(ADA_PERMISSIONS.SHOW_ADA)
        console.log("canshowadabanner  ======> ", this.canShowAdaBanner)
      }
    );
  }
}
