import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getDefaultStringEmptyValue, isNullOrUndefined } from '../../_core/utils/string-utils';
import { InteractionService } from '../../_core/services/interaction.service';
import { CustomerDashboardRoutingModule } from '../customer-dashboard/customer-dashboard-routing.module';
import { DatePipe } from '@angular/common';
import { DateFormatPipeFrench } from 'src/app/_shared/pipes';
import { getEncryptedValue, getTypeCustomer } from 'src/app/_core/utils/functions-utils';


@Injectable({
  providedIn: 'root'
})
export class InteractionsService {

  readonly CUSTOMER_DASHBOARD = '/customer-dashboard';

  constructor(private readonly interactionService: InteractionService, private readonly dateFormatPipeFrench: DateFormatPipeFrench, private readonly datePipe: DatePipe) {
    
  }

  navigateToDetailInteractionPageByType(router: Router, customerId: string|number, idRequest: number, interactionId: number) {
    this.interactionService.getInteractionMailDetail(interactionId).subscribe(data => {
      let pageType = 'interaction-detail';
      if (!isNullOrUndefined(data)) {
        if ( data.messageCategory === 'SMS') {
          pageType = 'interaction-detail-sms';
        }
        else if ( data.messageCategory === 'MAIL') {
          pageType = 'interaction-detail-mail';
        }
      }
      router.navigate(
        [this.CUSTOMER_DASHBOARD, customerId, 'interaction', pageType, interactionId, idRequest],
        { queryParamsHandling: 'merge' }
      );
    });
  }

  
  navigateToInteractionModificationPage(router: Router, customerId: string|number, idRequest: number, interactionId: number, previousPage = 'detail') {
    router.navigate(
      [this.CUSTOMER_DASHBOARD, customerId, 'interaction', 'modification', interactionId, idRequest],
      {  
        queryParams: { previousPage: previousPage },
        queryParamsHandling: 'merge' }
    );
  
  }

  navigateToInteractionHistoryPage(router: Router, customerId: string|number) {
    router.navigate(
      [this.CUSTOMER_DASHBOARD, customerId, 'interaction', 'complete-history'],
      { queryParamsHandling: 'merge' }
    );
  }

  navigateToRequestPage(router: Router, customerId: string|number, idRequest: number) {
    router.navigate(
      [this.CUSTOMER_DASHBOARD, customerId, 'detail', 'request', idRequest],
      { queryParamsHandling: 'merge' }
    );
  }

  public displayMotifInteraction(interactionMotifParent: string, interactionMotif: string): string { 
    return `${getDefaultStringEmptyValue(interactionMotifParent)} > ${getDefaultStringEmptyValue(interactionMotif)}`;
  }

  public displayCreationDateOfInteraction(createdAt: any): string {
    const createHourAndMin = this.datePipe.transform(createdAt , "HH'h'mm");
    return `${this.dateFormatPipeFrench.transform(createdAt, 'dd MMM yyyy')} - ${createHourAndMin}`;
  }

  public openLinkedPagesOfINteractionInNewTab(router: Router, params: any): void {

    const CUSTOMER_DASHBOARD = '/customer-dashboard';
    const customerId = getEncryptedValue(parseInt(params.data.idCustomer));
    let segmentsUrl = [];
    const navigationExtras = { 
      queryParams: {typeCustomer : getTypeCustomer(params.data.categoryCustomer, params.data.idCompanyCustomer), fromDashbord : true}, 
    };
    switch( params.column.colId ) {
      
      case 'requestId' : {
        segmentsUrl =[ CUSTOMER_DASHBOARD, customerId, 'detail', 'request', params.data.requestId];
        this.openUrl(router, segmentsUrl, navigationExtras);
        break;
      }
        
      case 'membre' :  {
        const typepage = (params.data.categoryCustomer) ? 'particular' : 'entreprise'; 
        segmentsUrl = [ CUSTOMER_DASHBOARD, typepage, customerId];
        this.openUrl(router, segmentsUrl, navigationExtras);
        break;
      }
    
      case 'update' : { 
        segmentsUrl = [ CUSTOMER_DASHBOARD, customerId, 'interaction', 'modification', params.data.interactionId, params.data.requestId];
        if (!params.data.isAutomatic) {
          this.openUrl(router, segmentsUrl, navigationExtras);
        } 
        break;
      } 

      default : {
        this.interactionService.getInteractionMailDetail(params.data.interactionId).subscribe(data => {
          let pageType = 'interaction-detail';
          if (!isNullOrUndefined(data)) {
            if ( data.messageCategory === 'SMS') {
              pageType = 'interaction-detail-sms';
            }
            else if ( data.messageCategory === 'MAIL') {
              pageType = 'interaction-detail-mail';
            }
          }
          segmentsUrl = [ CUSTOMER_DASHBOARD, customerId, 'interaction', pageType, params.data.interactionId, params.data.requestId]; 
          this.openUrl(router, segmentsUrl, navigationExtras);
        });
        break;
      }
    } 
  
    
  }

  openUrl(router: Router, segmentsUrl : any[], navigationExtras: any ) : void {
    let url = router.serializeUrl(router.createUrlTree(segmentsUrl,navigationExtras));
    if(url !== null){
      window.open(`#${url}`, '_blank');
      url = null;
    }
  }
}
