import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerParcServiceVO } from 'src/app/_core/models/customer-parc-service-vo';
import { isNullOrUndefined } from 'src/app/_core/utils/string-utils';
import { formatAdrresseAssocie } from 'src/app/_core/utils/formatter-utils';
import { ParcServiceDetailService } from './parc-service-detail.service';
import { NotificationService } from '../../../../_core/services/notification.service';

@Component({
  selector: 'app-parc-services-detail',
  templateUrl: './parc-services-detail.component.html',
  styleUrls: ['./parc-services-detail.component.scss']
})
export class ParcServicesDetailComponent implements OnInit {

  parcServicesDetail: CustomerParcServiceVO;
  adresseInstallation: String;
  recurrent: String;
  unitePriceTTC: String;
  remiseTtc: String;
  priceTTCAllIncluses: String;
  isEntreprise: boolean;
  customerId: string;
  parcServices: CustomerParcServiceVO[];

  constructor(private route: ActivatedRoute,private parcServiceDetailService: ParcServiceDetailService, private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.route.data.subscribe(resolversData => {
      this.parcServicesDetail = resolversData['parcServicesDetail'];
      if (!isNullOrUndefined(this.parcServicesDetail)) {
        this.adresseInstallation = this.parcServicesDetail.delimitedContactMethodPostalAddress;
        this.recurrent = this.getRecurrent();
        this.unitePriceTTC = this.parcServiceDetailService.unitePriceTTC(this.parcServicesDetail.unitPrice, this.parcServicesDetail.tva);
        this.remiseTtc = this.parcServiceDetailService.remiseTtc(this.parcServicesDetail.remise, this.parcServicesDetail.tva);
        this.priceTTCAllIncluses = this.parcServiceDetailService.priceTTCAllIncluses(this.parcServicesDetail.unitPrice, 
          this.parcServicesDetail.remise, this.parcServicesDetail.tva);
        this.isEntreprise = Boolean(this.route.snapshot.data['isEntreprise']);
      }
    });
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    }); 
    
    this.parcServices.push(this.parcServicesDetail);
    this.notificationService.setParcServices(this.parcServices);
  }

  getRecurrent(): String {
    if (!isNullOrUndefined(this.parcServicesDetail) && !isNullOrUndefined(this.parcServicesDetail.recurrent)) {
      if (this.parcServicesDetail.recurrent) {
        return 'Oui';
      } 
      return 'Non';
    }
  }

}
