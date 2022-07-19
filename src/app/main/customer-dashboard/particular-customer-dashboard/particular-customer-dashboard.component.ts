import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CustomerParcItemVO } from 'src/app/_core/models/customer-parc-item-vo';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { InfoClientDashboardsLight } from '../../../_core/models/info-client-dashboards-light';
import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';
import { CustomerParcServiceVO } from '../../../_core/models/customer-parc-service-vo';
import { InterlocutorVO } from '../../../_core/models/interlocutor-vo';
import { DocumentVO } from '../../../_core/models/documentVO';
import { TypeDocument } from '../../../_core/models/Type-Document';
import { CustomerDashboardService } from '../customer-dashboard.service';
import { PersonNoteVo } from '../../../_core/models/person-note';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { CONSTANTS } from '../../../_core/constants/constants';
import { CustomerReferentLight } from '../../../_core/models/customer-referent-light';
import { TitleServices } from '../../../_core/services/title-services.service';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { CustomerComplaint } from '../../../_core/models/customer-complaint';

@Component({
  selector: 'app-particular-customer-dashboard',
  templateUrl: './particular-customer-dashboard.component.html',
  styleUrls: ['./particular-customer-dashboard.component.scss']
})
export class ParticularCustomerDashboardComponent implements OnInit, OnDestroy {
  parcLignes: CustomerParcItemVO;

  parcServices: CustomerParcServiceVO[];

  typeDocuments: TypeDocument[];

  documents: DocumentVO[];

  yearsDocumentFilter: number[];

  titleCustomerInfos: string;

  infoClientLight: InfoClientDashboardsLight;
  homologationsIds: number[];

  goodToKnow: PersonNoteVo;

  infoFacturation: PersonNoteVo;

  infoCustomer: BeneficiaireView;
  requestsCustomer: RequestCustomerVO[];

 // coordonnes: InterlocutorVO;

  interlocutorList: InterlocutorVO[];
  customerId: string;
  personIdNote: number;

  dateRecouvrement: Date;

  isParticular: boolean;

  navigationSubscription$;

  remaining: number;
  referents: CustomerReferentLight;

  typeCustomer: string;
  customerComplaint: CustomerComplaint;

  constructor( private route: ActivatedRoute, private router: Router, private customerDashboardService: CustomerDashboardService, 
    private titleServices: TitleServices ) {
    this.navigationSubscription$ = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.getData();
        let title =this.capitalizeWord(this.infoCustomer.firstName + ' ' + this.infoCustomer.lastName + ' ' + '- Athena ') ;
        this.titleServices.setTitle(title);
        
      }
    });  
   
  }

  capitalizeWord(word: string): string {
    return isNullOrUndefined(word) ? '-' : word[0].toUpperCase() + word.substr(1);
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.route.paramMap.subscribe( params => {
      this.customerDashboardService.setCustomerId( Number.parseInt(params.get('customerId'), 10));
      this.customerId = params.get('customerId');
    });
    this.route.queryParamMap.subscribe(params => this.typeCustomer = params.get('typeCustomer'));
    this.customerDashboardService.changeCurrentTypeCustomer(this.typeCustomer);
    this.isParticular = ( this.typeCustomer === CONSTANTS.TYPE_PARTICULAR );
    this.route.data.subscribe(resolversData => {
      //this.parcLignes = resolversData['parcLignes'];
     // this.parcServices = resolversData['parcServices'];
      //this.documents = resolversData['documents'];
     // this.typeDocuments = resolversData['typeDocuments'];
    //  this.coordonnes = resolversData['cordonnes'];

      //this.interlocutorList = resolversData['interlocutorList'];

      this.infoCustomer = resolversData['infoCustomer'];
      //this.goodToKnow = resolversData['goodToKnow'];
      // this.infoFacturation = resolversData['infoFacturation'];
      // if (this.infoFacturation !== null) { 
      //   this.personIdNote = this.infoFacturation.personId;
      // }
      this.dateRecouvrement = resolversData['dateRecouvrement'];
      //this.requestsCustomer = resolversData['requestsCustomer'];
      //this.referents = resolversData['referents'];
     // this.customerComplaint = resolversData['customerComplaint'];
     this.homologationsIds = resolversData['homologationsIds'];
    });

    this.yearsDocumentFilter = this.listYears();
  }

  /**
	 * methode qui permet de construire le titre de bloc infos customer
	 */
 /*  getTiltleInformationCustomer(value: InfoClientDashboardsLight): string {
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
  } */

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

  ngOnDestroy(): void {
    this.navigationSubscription$.unsubscribe();
  }
}
