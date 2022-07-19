import { NavigationExtras, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, HostListener, ViewEncapsulation } from '@angular/core';

import { ParcLigneService, CustomerService } from '../_core/services';
import { BeneficiaireView } from '../_core/models/profil-infos-dashboard';
import { environment } from '../../environments/environment';
import { ParkItemService } from '../main/park-item/park-item-detail/park-item-detail.service';
import { isNullOrUndefined } from '../_core/utils/string-utils';

declare const __M10: any;

const ADA_ACTION_NAME = {
  DIAL : 'dial'
};

@Component({
  selector: 'app-ada-banner',
  templateUrl: './ada-banner.component.html',
  styleUrls: ['./ada-banner.component.scss'],
  //encapsulation: ViewEncapsulation.ShadowDom
})
export class AdaBannerComponent implements OnInit, AfterViewInit, OnDestroy {

  adaBannerPlateforme: string = `${environment.adaBannerPlateforme}`;

  @ViewChild('headband', { static: false }) headband: ElementRef;

  tabArray: Window[] = [];

  creationDate: Date;

  constructor(private readonly parcLigneService: ParcLigneService, private readonly customerService: CustomerService,
    private readonly parkItemService: ParkItemService , private readonly router: Router) {}

  ngOnInit(): void {
    this.creationDate = new Date();
    this.addCreationDateToListInLocalStorage(this.creationDate);
  }

  ngAfterViewInit(): void{
    __M10.themes.banner.hydrate(this.headband.nativeElement);
    this.headband.nativeElement.addEventListener('M10CallIncoming', (event) => {
      const detail: any = (<CustomEvent>event).detail;
      this.redirectionToContracts(detail);
    });

    this.headband.nativeElement.addEventListener('M10TransferInitiated', (event) => {
      let detail:any = (<CustomEvent>event).detail;
      this.hasMultipleParcTelcoActif(detail.clientId).then(
        (hasMultipleParcTelcoActif)=>{
          if(hasMultipleParcTelcoActif){
            this.redirectToSearchVue(detail.clientId);
          }else{
            if(detail.crmId){
              this.customerService.getProfilViewByNicheIdentifier(detail.crmId).subscribe((data) => {
                this.openCustomerOnNewTab(data);
              });
            } else{
              this.parcLigneService.getBeneficiairyByWebServiceIdentifier(detail.clientId, detail.crmId).subscribe((data) => {
                this.openCustomerOnNewTab(data);
              });
            }
          }
        }
      );
    });

    this.insertPhoneNumberInADAHeadBand();
  }

  /**
   * @author YFA 
   * @param detail 
   * ATHENA-747 : [Bandeau ADA] - Détection de plusieurs numéros de téléphone en BDD
   */
  private redirectionToContracts(detail: any) {
    this.hasMultipleParcTelcoActif(detail.clientId).then(
      (hasMultipleParcTelcoActif) => {
        if (hasMultipleParcTelcoActif) {
          this.redirectToSearchVue(detail.clientId);
        } else {
          this.redirectionForOneContract(detail);
        }
      }
    );
  }

  private redirectionForOneContract(detail: any) {
    if (detail.crmId) {
      this.customerService.getProfilViewByNicheIdentifier(detail.crmId).subscribe((data) => {
        if (data) {
          this.openCustomerOnNewTab(data);
          this.headband.nativeElement.action('updateContext', { 'clientId': detail.clientId, 'crmId': data.nicheIdentifier });
        }
      });
    } else {
      this.parcLigneService.getBeneficiairyByWebServiceIdentifier(detail.clientId, detail.crmId).subscribe((data) => {
        if (data) {
          this.openCustomerOnNewTab(data);
          this.headband.nativeElement.action('updateContext', { 'clientId': detail.clientId, 'crmId': data.nicheIdentifier });
        }
      });
    }
  }

  redirectToSearchVue(callKeyId: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: { search_pattern: callKeyId }
    };
    this.router.navigate(['serp', 'all'], navigationExtras);
  }
  async hasMultipleParcTelcoActif(callKeyId: string) {
    return <boolean>await this.parcLigneService.hasMultipleParcTelcoActif(callKeyId).toPromise();
  }

  ngOnDestroy(): void {
    this.headband.nativeElement.removeEventListener('M10CallIncoming', (event) => {
      const detail: any = (<CustomEvent>event).detail;
      this.hasMultipleParcTelcoActif(detail.clientId).then(
        (hasMultipleParcTelcoActif)=>{
          if(hasMultipleParcTelcoActif){
            this.redirectToSearchVue(detail.clientId)
          }else{
            this.parcLigneService.getBeneficiairyByWebServiceIdentifier(detail.clientId, detail.crmId).subscribe((data) => {
              this.openCustomerOnNewTab(data);
            });
          }
        }
      )
    });
    this.headband.nativeElement.removeEventListener('M10TransferInitiated', (event) => {
      const detail: any = (<CustomEvent>event).detail;
      this.hasMultipleParcTelcoActif(detail.clientId).then(
        (hasMultipleParcTelcoActif)=>{
          if(hasMultipleParcTelcoActif){
            this.redirectToSearchVue(detail.clientId)
          }else{
            this.parcLigneService.getBeneficiairyByWebServiceIdentifier(detail.clientId, detail.crmId).subscribe((data) => {
              this.openCustomerOnNewTab(data);
            });
          }
        }
      );
    });
  }
  
  @HostListener('window:beforeunload', ['$event'])
  closeWindowEvent($event: any): void {
    this.removeCreationDateFromListInLocalStorage(this.creationDate);
  }

  openCustomerOnNewTab(data: BeneficiaireView): void {
    if (data && this.creationDate.getTime() === this.getLastCreatedWindow().getTime() ) {
      let url = environment.baseUrl + '/#/customer-dashboard/particular/' + data.id ;
      if (data.companyCustomerId) {
        url += '?typeCustomer=beneficiary';
      } else {
        url += '?typeCustomer=particular';
      }
      window.open(url);
    }
  }

  getLastCreatedWindow(): Date {
    const creationDateList = this.getCreationDateListFromLocalStorage();
    creationDateList.sort( (d1, d2) => new Date(d2).getTime() - new Date(d1).getTime());
    return new Date(creationDateList[0]);
  }

  addCreationDateToListInLocalStorage(Date: Date): Date[] {
    let creationDateList: Date[] = JSON.parse(localStorage.getItem('date_creation_list'));
    if (!creationDateList) { creationDateList = []; }
    creationDateList.push(Date);
    this.setCreationDateListInLocalStorage(creationDateList);
    return creationDateList;
  }

  removeCreationDateFromListInLocalStorage(deletedDate: Date): Date[] {
    const creationDateList = JSON.parse(localStorage.getItem('date_creation_list'));
    const filtredList = creationDateList.filter( date => new Date(date).getTime() !== deletedDate.getTime());
    this.setCreationDateListInLocalStorage(filtredList);
    return creationDateList;
  }
 
  getCreationDateListFromLocalStorage(): Date[] {
    const creationDateList = JSON.parse(localStorage.getItem('date_creation_list'));
    return (creationDateList) ? creationDateList : []; 
  }

  setCreationDateListInLocalStorage(creationDateList: Date[]): void {
    localStorage.setItem('date_creation_list', JSON.stringify(creationDateList));
  }

  /**
   * US: ATHENA-618
   * DESCRIPTION: this method below allows the insertion phone number
   * on which the user clicked in the detail of the parc item
   */
  insertPhoneNumberInADAHeadBand(): void {
    this.parkItemService.getSelectedWebserviceIdentifier().subscribe( phoneNumber => {
      if (!isNullOrUndefined(phoneNumber)) {
        this.headband.nativeElement.action(ADA_ACTION_NAME.DIAL, { 'destination': phoneNumber });
      }
    })
  }

}
