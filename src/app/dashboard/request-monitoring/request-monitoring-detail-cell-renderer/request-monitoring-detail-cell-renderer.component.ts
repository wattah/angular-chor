import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

import { CartItemVO, RequestVO as RequestMonitoring } from './../../../_core/models/models.d';
import { getCartLabel } from './../../../_core/utils/functions-utils';
import { isNullOrUndefined } from './../../../_core/utils/string-utils';
import { GenerateCommandOrderService } from '../../../_core/services/generate-command-order.service';
import { ABANDON_PERMISSIONS, PENDING_PERMISSIONS, VALIDATE_PERMISSIONS, AWAINTING_APPROVEL_PERMISSIONS, ESTIMATE_SENT_PERMISSIONS, READY_DELIVER_PERMISSIONS, DELIVERED_PERMISSIONS } from '../../../_core/constants/permissions-constants';
import { GassiMockLoginService } from '../../../_core/services/gassi-mock-login.service';
import { STATUS_CART } from '../../../_core/constants/constants';
import { isEmpty } from '../../../_core/utils/string-utils';
import { ApplicationUserVO } from '../../../_core/models/application-user';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-request-monitoring-detail-cell-renderer',
  templateUrl: './request-monitoring-detail-cell-renderer.component.html',
  styleUrls: ['./request-monitoring-detail-cell-renderer.component.scss']
})
export class RequestMonitoringDetailCellRendererComponent implements ICellRendererAngularComp {

  constructor( private readonly generateOcService : GenerateCommandOrderService,
    private readonly mockLoginService: GassiMockLoginService,
    private readonly _snackBar: MatSnackBar){
 
  }

  data: RequestMonitoring;
  activeCartItems: CartItemVO[] = [];
  cartlabel : string ;
  visibleActionsTriggerOC = false;
  loadingOC = false;
  hasBlockedProduct = false;
  static readonly snackBarMsg = "L'ordre de commande a bien été déclenché";
  agInit(params: any): void {
    if (params) {
      this.data = params.data;
    }
    if(this.data.cartId && this.data.cartItems){
    for ( const item of this.data.cartItems) {
      if (item.deletingDate === null) {
        this.activeCartItems.push(item);
      }
     
    }

    this.hasBlockedProduct = this.data.isBlocked;
  }

    console.warn('agInit: -params- : ', params.data.canonicalLabel);
    this.geCartLabel(this.data.cartColor)
    this.setRestrictionByCartPhaseAndUserRole(this.data.cartStatus);
   
  }

  geCartLabel(cartColor:string){
  const cartLabel = getCartLabel(cartColor, null);
  this.cartlabel = !isNullOrUndefined(cartLabel)  ? cartLabel  : '-';
  }

  

  refresh(params: any): boolean {
    if (params) {
      this.data = params.data;
    }
    for ( const item of this.data.cartItems) {
      if (item.deletingDate === null) {
        this.activeCartItems.push(item);
      }
    }
    console.warn('refresh: -params- : ', params);
    return false;
  }

  canonicalLabelList(): string[] {
    return this.data.canonicalLabel.slice(0, -1).split(/\r\n|\r|\n/);
  }

  /********************************************************************************************** */
  triggerOCandBLWingsm(){
    if(this.data.cartId){
      this.loadingOC = true ;
       this.generateOcService.checkIfACommandOrderExists(this.data.cartId).subscribe( data => {
        this.loadingOC = false ;
        if(data){
          this.generateOcService.popUpOCExists(GenerateCommandOrderService.comment).subscribe( confirmed => {
           if(confirmed){
            this.launchDelivery();
           }

          });
        }
        else{
          this.launchDelivery();
        }
      }); 
      }
   }
/*********************************************************************************************/
   launchDelivery(){
    this.loadingOC = true ;
    this.generateOcService.launchSaveOC(this.data.id).subscribe( commandOrderResVO => {
      if(!isNullOrUndefined(commandOrderResVO)){
        this.loadingOC = false ;
        if(!isEmpty(commandOrderResVO.errorOrInfosMessage)){
         this.generateOcService.popUperrorOrInfosMessage(commandOrderResVO.errorOrInfosMessage)
        } 
        if(commandOrderResVO.commandOrder != null){
          this.openSnackBar(RequestMonitoringDetailCellRendererComponent.snackBarMsg);
         }
       
      }
    });
   }

/*********************************************************************************************/
   /**
    * @author fsmail
    * @param mockLoginService 
    * @param status 
    */
   setRestrictionByCartPhaseAndUserRole(status: string) {
    switch (status) {
      case STATUS_CART.PENDING:
        this.setRestrictionFoOC(PENDING_PERMISSIONS.LOGISTIQUE);
      break;
      case STATUS_CART.AWAITING_APPROVAL:
        this.setRestrictionFoOC(AWAINTING_APPROVEL_PERMISSIONS.LOGISTIQUE);
      break;
      case STATUS_CART.VALIDATE:
        this.setRestrictionFoOC( VALIDATE_PERMISSIONS.LOGISTIQUE);
      break;
      case STATUS_CART.ESTIMATE_SENT:
        this.setRestrictionFoOC(ESTIMATE_SENT_PERMISSIONS.LOGISTIQUE);
      break;
      case STATUS_CART.READY_DELIVER:
        this.setRestrictionFoOC(READY_DELIVER_PERMISSIONS.LOGISTIQUE);
      break;
      case STATUS_CART.DELIVERED:
        this.setRestrictionFoOC( DELIVERED_PERMISSIONS.LOGISTIQUE);
      break;
      case STATUS_CART.ABANDON:
        this.setRestrictionFoOC(ABANDON_PERMISSIONS.LOGISTIQUE);
      break;
      default:
        break;
    }
}
/*********************************************************************************************/
/**
 * 
 * @param mockLoginService 
 * @param status 
 */
   setRestrictionFoOC(status: string) {
    this.mockLoginService.getCurrentConnectedUser().subscribe((user) => {
        if (this.userHasPermissions(user)) {
            this.visibleActionsTriggerOC = user.activeRole.permissions.includes(status);
            
        }
    });
}
/*********************************************************************************************/
/**
 * 
 * @param user 
 * @returns 
 */
private userHasPermissions(user: ApplicationUserVO) {
  return user && user.activeRole && user.activeRole.permissions;
}


  /** SNACK BAR */
  openSnackBar(text: string): void {
    this._snackBar.open(
      text, undefined, 
      { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
  }

}
