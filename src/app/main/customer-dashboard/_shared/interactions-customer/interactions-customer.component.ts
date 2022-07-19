import { catchError } from 'rxjs/operators';
import { CustomerService } from './../../../../_core/services/customer.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { InfoClientDashboardsLight } from 'src/app/_core/models/info-client-dashboards-light';
import { RequestService } from 'src/app/_core/services/request.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-interactions-customer',
  templateUrl: './interactions-customer.component.html',
  styleUrls: ['./interactions-customer.component.scss']
})
export class InteractionsCustomerComponent implements OnInit {

  referents: any[] = [];
  infoClientLight: InfoClientDashboardsLight;

  @Input()
  isParticular: boolean;

  totalReclamation: string;
  totalRemplacementMobile: string;
  totalRecouvrement: string;
  totalEvenement: string;


  isOneRequestReclamation = false;
  isOneRequestSav = false; 
  isOneRequestSavHome= false;
  isOneRequestRecouvrement = false;

  customerId: string;
  typeClient: String;
  inCompleteCall: boolean = true;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private requestService: RequestService,
              private customerService: CustomerService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( (params: ParamMap) => {
      this.customerId = params.get('customerId');
      this.getReferents();
      this.typeClient = this.route.snapshot.queryParamMap.get('typeCustomer');
    });
    this.route.data.subscribe(resolversData => {
      this.infoClientLight = resolversData['infoClientLight'];
      if ( this.infoClientLight !== null) {
        if ( this.infoClientLight.nbrTotalEvenement === 1 ) {
          this.totalEvenement = 'évènement';
        } else {
          this.totalEvenement = 'évènements';
        }
        if ( this.infoClientLight.nbrTotalRecouvrement === 1) {
          this.totalRecouvrement = 'recouvrement';
          this.isOneRequestRecouvrement = true;
        } else {
          this.totalRecouvrement = 'recouvrements';
          this.isOneRequestRecouvrement = false;
        }
        if ( this.infoClientLight.nbrTotalRemplacementMobile === 1) {
          this.totalRemplacementMobile = 'appareil';
        } else {
          this.totalRemplacementMobile = 'appareils';
        }
        if (this.infoClientLight.nbrTotalSAV === 1) {
          this.isOneRequestSav = true;
        } else {
          this.isOneRequestSav = false;
        }
        if (this.infoClientLight.nbrTotalHome === 1) {
          this.isOneRequestSavHome = true;
        } else {
          this.isOneRequestSavHome = false;
        }
      }
    });
    
  }
  getReferents() {
    return this.customerService.getListReferents(this.customerId)
        .pipe(catchError(() => of(null)))
        .subscribe(
          (referents) => {
            this.referents = referents;
            this.inCompleteCall = false;
          }
        );
  }

  /**
	 * 
	 */
  toDetailOrFull(isReclamation: Boolean, isSav: Boolean, isRecouvrement: Boolean, isSavHome: boolean): void {
    if (isSav) {
      if ( this.isOneRequestSav) {
        let idRequestSav: Number;
        this.requestService.getIdRequestSavByIdCustomerLessTwelveMouth(this.customerId).subscribe(data => {
          if (data !== null) {
            idRequestSav = data;
            this.router.navigate(['/customer-dashboard', this.customerId, 'detail', 'request', idRequestSav],
            { queryParams: { typeCustomer: this.typeClient } });
          }
        });     
      } else {
        this.router.navigate(['/customer-dashboard', this.customerId , 'see-all', 'requests-minitoring'],
          { queryParams: { typeCustomer: this.typeClient, typeRequest: 'sav' }
          });
      }
    } else if ( isRecouvrement) {
      if ( this.isOneRequestRecouvrement) {
        let idRequestRecouvrement: Number;
        this.requestService.getIdRequestRecouvrementByIdCustomerLessTwelveMouth(this.customerId).subscribe(data => {
          if (data !== null) {
            idRequestRecouvrement = data;
            this.router.navigate(['/customer-dashboard', this.customerId, 'detail', 'request', idRequestRecouvrement],
            { queryParams: { typeCustomer: this.typeClient } }
            ); 
          }
        });
      } else {
        this.router.navigate(['/customer-dashboard', this.customerId , 'see-all', 'requests-minitoring'],
          { queryParams: { typeCustomer: this.typeClient, typeRequest: 'recouvrement' }
          });
      }    
    }
    else if (isSavHome) {
      if ( this.isOneRequestSavHome) {
        let idRequestSavHome: Number;
        this.requestService.getIdRequestSavHomeByIdCustomerLessTwelveMouth(this.customerId).subscribe(data => {
          if (data !== null) {
            idRequestSavHome = data;
            this.router.navigate(['/customer-dashboard', this.customerId, 'detail', 'request', idRequestSavHome],
            { queryParams: { typeCustomer: this.typeClient } });
          }
        });     
      } else {
        this.router.navigate(['/customer-dashboard', this.customerId , 'see-all', 'requests-minitoring'],
          { queryParams: { typeCustomer: this.typeClient, typeRequest: 'home'}
          });
      }
    } 
  }

  toDetailOrFullListHumeurMembre(): void {
    if (this.infoClientLight.nbrTotalHumeurMembre >= 1) {
        this.router.navigate(
          ['/customer-dashboard', this.customerId , 'see-all', 'requests-minitoring'],
          { queryParams: { typeCustomer: this.typeClient, typeRequest: 'humeurMembre' }}
        );
    }
  }

}
