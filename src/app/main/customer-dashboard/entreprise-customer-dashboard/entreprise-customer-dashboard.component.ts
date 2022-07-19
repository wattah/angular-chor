import { CustomerParkLigne } from './../../../_core/models/customer-parc-item-vo';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CustomerParcServiceVO } from '../../../_core/models/customer-parc-service-vo';
import { CustomerParcItemVO } from '../../../_core/models/customer-parc-item-vo';
import { InfoClientDashboardsLight } from '../../../_core/models/info-client-dashboards-light';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { InterlocutorVO } from '../../../_core/models/interlocutor-vo';
import { CustomerDashboardService } from '../customer-dashboard.service';
import { PersonNoteVo } from '../../../_core/models/person-note';
import { CONSTANTS } from '../../../_core/constants/constants';
import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';
import { CustomerReferentLight } from '../../../_core/models/customer-referent-light';
import { CustomersLight } from '../../../_core/models/customers_light';
import { TypeDocument } from '../../../_core/models/Type-Document';
import { DocumentVO } from '../../../_core/models/models';
import { TitleServices } from '../../../_core/services/title-services.service';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { CustomerComplaint } from '../../../_core/models/customer-complaint';
import { PersonService } from '../../../_core/services';

@Component({
  selector: 'app-entreprise-customer-dashboard',
  templateUrl: './entreprise-customer-dashboard.component.html',
  styleUrls: ['./entreprise-customer-dashboard.component.scss']
})
export class EntrepriseCustomerDashboardComponent implements OnInit {
  beneficiares: CustomerParkLigne[];

  @Input('parcServices')
  parcServices: CustomerParcServiceVO[];

  titleCustomerInfos: string;

  infoCustomer: BeneficiaireView;
  infoClientLight: InfoClientDashboardsLight;
  homologationsIds: number[];
  //coordonnes: InterlocutorVO[];
  interlocutorList: InterlocutorVO[];
  customerId: string;
  personIdNote: number;
  infoFacturation: PersonNoteVo;
  dateRecouvrement: Date;
  isEntreprise: boolean;
  referents: CustomerReferentLight;
  severalCustomerTit: CustomersLight[];

  requestsCustomer: RequestCustomerVO[];

  goodToKnow: PersonNoteVo;

  typeDocuments: TypeDocument[];

  documents: DocumentVO[];

  yearsDocumentFilter: number[];
  typeCustomer: string;
  customerComplaint: CustomerComplaint;
  entrepriseRecoveryDate: Date;
  detteTotalTTC: number;
  totalNumberOfRecouverement: number;

  constructor(private route: ActivatedRoute,
    private customerDashboardService: CustomerDashboardService,
    private titleServices: TitleServices,
    private personService: PersonService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
      this.customerDashboardService.setCustomerId(Number.parseInt(params.get('customerId'), 10));
    });
    this.route.queryParamMap.subscribe(params => this.typeCustomer = params.get('typeCustomer'));
    this.customerDashboardService.changeCurrentTypeCustomer(this.typeCustomer);
    this.isEntreprise = (this.typeCustomer === CONSTANTS.TYPE_COMPANY);
    this.route.data.subscribe(resolversData => {
      this.infoCustomer = resolversData['infoCustomer'];
      this.titleServices.setTitle(this.infoCustomer.companyName + ' - Athena ');
      this.severalCustomerTit = resolversData['severalCustomerTit'];
      this.infoClientLight = resolversData['infoClientLight'];
      this.totalNumberOfRecouverement = resolversData['totalNumberOfRecouverement'];
      if (!isNullOrUndefined(this.infoClientLight)) {
        this.getTiltleInformationCustomer(this.infoClientLight);
      }
      this.dateRecouvrement = resolversData['dateRecouvrement'];
      this.homologationsIds = resolversData['homologationsIds'];
    });
    this.yearsDocumentFilter = this.listYears();
    console.log(this.requestsCustomer)
  }

  onSendNichesWithRemainingGreatThanZeroEvent(nichesWithRemainingGreatThanZero: string[]) {
    this.personService.getEntrepriseRecoveryDate(nichesWithRemainingGreatThanZero).subscribe(
      (data) => this.entrepriseRecoveryDate = data
    )
  }

  onSendRemainingEvent(detteTotalTTC: number) {
    this.detteTotalTTC = detteTotalTTC;
  }

  /**
	 * methode qui permet de construire le titre de bloc infos customer
	 */
  getTiltleInformationCustomer(value: InfoClientDashboardsLight): string {
    this.titleCustomerInfos = '';
    let notAge = false;
    if (!isNullOrUndefined(value)) {
      if (
        !isNullOrUndefined(value.ageInscri) &&
        value.ageInscri === 1 &&
        (!isNullOrUndefined(value.moisInscri) && value.moisInscri === 1)
      ) {
        this.titleCustomerInfos += 'Client Depuis ' + value.ageInscri + ' an et ' + value.ageInscri + ' mois ';
        notAge = true;
      } else if (!isNullOrUndefined(value.ageInscri) && value.ageInscri === 1) {
        this.titleCustomerInfos += 'Client Depuis ' + value.ageInscri + ' an ';
      } else if (
        !isNullOrUndefined(value.ageInscri) &&
        value.ageInscri === 0 &&
        (!isNullOrUndefined(value.moisInscri) && value.moisInscri !== 0)
      ) {
        this.titleCustomerInfos += 'Client depuis ' + value.moisInscri + ' mois';
        notAge = true;
      } else if (
        !isNullOrUndefined(value.ageInscri) &&
        value.ageInscri === 0 &&
        (!isNullOrUndefined(value.moisInscri) && value.moisInscri === 0)
      ) {
        this.titleCustomerInfos += 'Client depuis moins d\'1 mois';
        notAge = true;
      }
      if (!isNullOrUndefined(value.ageInscri) && !notAge && value.ageInscri > 1) {
        this.titleCustomerInfos += 'Client Depuis ' + value.ageInscri + ' ans';
      }
      if (!isNullOrUndefined(value.moisInscri) && !notAge && value.moisInscri > 1) {
        this.titleCustomerInfos += ' et ' + value.moisInscri + ' mois';
      }
    }
    return this.titleCustomerInfos;
  }

  /**
	 * methode qui permet de remplir les des annees a partir en 2009 jusqu'a maintenant
	 */
  listYears(): number[] {
    const list = [];
    const year = new Date().getFullYear();
    let yearBegin = 2009;
    list.push(yearBegin);
    while (yearBegin < year) {
      yearBegin = yearBegin + 1;
      list.push(yearBegin);
    }
    return list;
  }
}
