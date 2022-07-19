import { Injectable } from '@angular/core';
import { HttpCommandOrderService } from './http-command-order.service';
import { CartConfirmationDialogService } from '../../main/cart/cart-confirmation-dialog/cart-confirmation-dialog.service';
import { Subject, Observable } from 'rxjs';
import { AuthTokenService } from './auth_token';
import { CommandOrderResultVO } from '../models/command-order-result-vo';




@Injectable({
    'providedIn': 'root'
})

export class GenerateCommandOrderService  {

   static readonly comment = 'Attention: un ordre de commande a déjà été créé pour ce panier. Êtes-vous sûr de vouloir réémettre un ordre<br/>  de commande pour ce panier?';
   static readonly title = 'Erreur!';
   static readonly btnOkText = 'Ok';
   static readonly btnCancelText = 'Non';
   static readonly btnYesText = 'oui';


    /**
     * 
     * @param commandOrderService 
     * @param cartConfirmationDialogComponent 
     * @param authTokenService 
     */
    constructor( private readonly commandOrderService: HttpCommandOrderService,
        private readonly cartConfirmationDialogComponent: CartConfirmationDialogService,
        private readonly authTokenService: AuthTokenService){
       
    }


    /**
     * @author fsmail
     * @param cartId 
     * @param requestId 
     * @returns 
     */
    checkIfACommandOrderExists(cartId : number): Observable<boolean>{
    const checkOCExist =  new Subject<boolean>();
      this.commandOrderService.checkIfACommandOrderExists(cartId).subscribe(data => {
        checkOCExist.next(data);
       });
       return checkOCExist.asObservable();
   }

   /**
    * @author fsmail
    * @param comment 
    * @param requestId 
    */
   popUpOCExists(comment:string) : Observable<boolean>{
    const confirmedConst = new Subject<boolean>();
        this.cartConfirmationDialogComponent.confirmCartConfirmationDialog(GenerateCommandOrderService.title, comment,GenerateCommandOrderService.btnYesText, 
        GenerateCommandOrderService.btnCancelText,"sm",true)
       .then((confirmed) => {
        confirmedConst.next(false);
          if (confirmed) {
            confirmedConst.next(true);

      }  })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    return confirmedConst.asObservable();
   }


   /**
    * @author fsmail
    * @param requestId 
    */
   launchSaveOC(requestId : number) :  Observable<CommandOrderResultVO> {
    const isCommandOrderResultVODone = new Subject<CommandOrderResultVO>();
    this.commandOrderService.saveCommandOrder(requestId,this.authTokenService.applicationUser.coachId,
        true,true).subscribe(data => {
        isCommandOrderResultVODone.next(data)
       });
       return isCommandOrderResultVODone.asObservable();
   }

   /**
    * @author fsmail
    * @param comment 
    */
   popUperrorOrInfosMessage(comment:string): any {
     
        this.cartConfirmationDialogComponent.confirmCartConfirmationDialog(GenerateCommandOrderService.title, comment,GenerateCommandOrderService.btnOkText, 
        GenerateCommandOrderService.btnCancelText,"lg",false)
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
   }
}
