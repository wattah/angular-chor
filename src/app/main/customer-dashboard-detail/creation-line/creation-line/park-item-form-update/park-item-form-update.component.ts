import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ReferenceDataService } from '../../../../../_core/services/reference-data.service';
import { ReferenceDataVO } from '../../../../../_core/models/models';
import { DatePipe } from '@angular/common';
import { CONSTANTS } from '../../../../../_core/constants/constants';
import { NicheContractStatustValue, NicheContractStatus } from '../../../../../_core/enum/customer-park-item-statut.enum';
import { ComponentCanDeactivate } from '../../../../../_core/guards/component-can-deactivate';
import { ParkItemUpdateService } from './park-item-update.service';
import { ConfirmationDialogService } from '../../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { AuthTokenService } from '../../../../../_core/services/auth_token';
import { ParcLigneService } from '../../../../../_core/services/parc-ligne.service';
import { CustomerParkItemVO } from '../../../../../_core/models/customer-park-item-vo';
import { NotificationService } from '../../../../../_core/services/notification.service';
import { ParkBillPenicheCustomerVO } from '../../../../../_core/models/park-bill-peniche-customer-vo';
import { BillingService } from '../../../../../_core/services/billing.service';
import { isNullOrUndefined } from '../../../../../_core/utils/string-utils';




@Component({
  selector: 'app-park-item-form-update',
  templateUrl: './park-item-form-update.component.html',
  styleUrls: ['./park-item-form-update.component.scss']
})
export class ParkItemFormUpdateComponent extends ComponentCanDeactivate  implements OnInit {

  messageError = "Erreur Serveur : Une erreur technique inattendue est surevenue.";
  transactionError = "Transaction rolled back because it has been marked as rollback-only";

  /**
   * Declaration des variables
   */
  customerParkItemId: any;
  customerParkItem: CustomerParkItemVO;
  parkWithCfAndCR: ParkBillPenicheCustomerVO = {} as ParkBillPenicheCustomerVO;
  userCatgory: ReferenceDataVO[];
  origineLine: ReferenceDataVO[];
  customerParkItemUpdateForm: FormGroup;
  form: FormGroup;
  subscriptionDate: Date;
  cancellationDate : Date;
  unnumberedDate : Date;
  idOrigineLine: number;
  idLineHolder: number;
  renewalDate : Date;
  showNewNumber = true ;
  showInputCancellationDate = true ;
  showInputSubscriptionDate = true ;
  showPickerCancellationDate = true ;
  showPickerSubscriptionDate = true ;
  showPickerUnnumberedDate = true ;
  submitted: boolean;
  isUpdateToActifLine = false;
  public NicheContractStatustValue = NicheContractStatustValue;

  public selectedStatusList = [];
  idCustomer: string;
  typeClient: string;

  customerDashboard = '/customer-dashboard';
  typeCustomer :string;
  rangRenewal : string;
  isAuthorized = false;
  constructor(private readonly parcLigneService: ParcLigneService, 
    private readonly route: ActivatedRoute , 
    private readonly referencesDataService: ReferenceDataService,
    private readonly formBuilder: FormBuilder,
    private readonly datePipe: DatePipe,
    private readonly    parcItemUpdateService: ParkItemUpdateService,
    readonly confirmationDialogService: ConfirmationDialogService, 
    readonly router: Router,
    private readonly authTokenService: AuthTokenService,
    private readonly notificationService: NotificationService,
    private readonly billingService: BillingService
    ) { 
      super();
      
    }

  ngOnInit() {
    this.route.parent.parent.parent.paramMap.subscribe( params => {
      this.idCustomer = params.get('customerId');
      this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer'); 
    });
    this.route.root.firstChild.firstChild.paramMap.subscribe( (params: ParamMap) => {
      this.idCustomer = params.get('customerId');
    });
    this.route.paramMap.subscribe( (params: ParamMap) => {
      this.typeClient = this.route.snapshot.queryParamMap.get('typeCustomer');
    });
    
    this.getParkUserCategory();
    this.route.data.subscribe(resolversData => {
      this.customerParkItem = resolversData['currentCustomerParkItem'];
      this.origineLine = resolversData['origineLineReferenceData'];
      this.origineLine .sort((a,b) => a.label.localeCompare(b.label));
      if ( this.customerParkItem) {
        this.rangRenewal = this.route.snapshot.queryParamMap.get('rangRenewal');
        this.isRenewalManual();
        this.subscriptionDate = new Date(this.datePipe.transform(this.customerParkItem.dateSubscription ? 
          this.customerParkItem.dateSubscription : new Date(), CONSTANTS.FORMAT_DATE));
        this.cancellationDate = new Date(this.datePipe.transform(this.customerParkItem.dateCancellation ? 
          this.customerParkItem.dateCancellation : new Date(),CONSTANTS.FORMAT_DATE));
        this.unnumberedDate = new Date(this.datePipe.transform(this.customerParkItem.dateUnnumbered ? 
          this.customerParkItem.dateUnnumbered : new Date(), CONSTANTS.FORMAT_DATE));
      
        this.renewalDate = new Date(this.datePipe.transform(this.customerParkItem.dateRenewal, CONSTANTS.FORMAT_DATE));  
        if(this.customerParkItem.lineOrigin) {
          this.idOrigineLine = this.customerParkItem.lineOrigin.id;
        }
        if(this.customerParkItem.lineHolder){
          this.idLineHolder= this.customerParkItem.lineHolder.id;
        }
       this.selectedStatusList = this.parcItemUpdateService.setSelectedNicheStatusContractList(this.customerParkItem.nicheContractStatus)
      if(this.customerParkItem.nicheContractStatus !== null){
        this.controleShowFields(this.customerParkItem.nicheContractStatus);
      }
      
       this.customerParkItemUpdateForm = this.createFormGroup();
      }
    });
    this.onFormGroupChange(this.customerParkItemUpdateForm);
    this.onSubmittedChange(false);
    this.onCanceledChange(false); 
  
  }

  createFormGroup(): FormGroup {
   
      return this.formBuilder.group({
        category: this.formBuilder.control(''),
        origine: this.formBuilder.control(null, [Validators.required]),
        subscriptionDate: this.formBuilder.control(null, this.showPickerSubscriptionDate ? [Validators.required] : []),
        cancellationDate : this.formBuilder.control(null, this.showPickerCancellationDate ? [Validators.required] : []),
        unnumberedDate : this.formBuilder.control(null, this.showNewNumber ? [Validators.required] : []),
        newNumber : this.formBuilder.control(null, this.showNewNumber ? [Validators.required] : []),
        comment : this.formBuilder.control(''),
        lineHolderName : this.formBuilder.control(''),
        commentMobile :  [{value:'' , disabled: true}, this.isAuthorized ? [Validators.required] : []],   
        renewalDate:  [{value:'' , disabled: true}, this.isAuthorized ? [Validators.required] : []  ],     
        isParnasseNumber  : this.formBuilder.control(''),
        status : this.formBuilder.control(null, [Validators.required]),
        reason :  this.formBuilder.control(''),
  
      });
    
   
    
  }

  getParkUserCategory(): void {
     this.referencesDataService
      .getReferencesData('PARK_USER_CATEGORY')
      .pipe(catchError(() => of(null)))
      .subscribe(userCatgory  => {
        
        this.userCatgory = userCatgory;
        this.userCatgory .sort((a,b) => a.label.localeCompare(b.label));
      }
     );

     
  }
//=========================================================================================================================================
prepareParkToSave(){
 
    const lineOrigin : ReferenceDataVO = {id: this.customerParkItemUpdateForm.get('origine').value} as ReferenceDataVO;
    this.customerParkItem.lineOrigin = lineOrigin; 
    const lineHolder : ReferenceDataVO = {id: this.customerParkItemUpdateForm.get('category').value} as ReferenceDataVO; 
    this.customerParkItem.lineHolder =lineHolder;
    this.customerParkItem.newNicheContractStatus = this.customerParkItemUpdateForm.get('status').value 
    this.customerParkItem.newDateSubscription = this.customerParkItemUpdateForm.get('subscriptionDate').value 
 if(this.isAuthorized){
   this.customerParkItem.dateRenewal = this.customerParkItemUpdateForm.get('renewalDate').value ;
   this.customerParkItem.commentRenewal = this.customerParkItemUpdateForm.get('commentMobile').value 
 }
    this.customerParkItem.dateCancellation = this.customerParkItemUpdateForm.get('cancellationDate').value 
    this.customerParkItem.modifierId = this.authTokenService.applicationUser.coachId;
    this.parkWithCfAndCR.customerParkItem = this.customerParkItem;
    this.parkWithCfAndCR.billAccount = null;
    this.parkWithCfAndCR.penicheCustomer = null;
}
//=============Modification d'une ligne vers un status # ACTIF donc pas d'étape d'activation=========================================
updateCustomerParkItemWithoutStep(){
  if (this.customerParkItemUpdateForm.valid) {
    this.prepareParkToSave();
    this.parcLigneService.updateCustomerParkItem(this.parkWithCfAndCR)
    .subscribe((response) => {
      this.back();  
      this.onSubmittedChange(true);
    },
    
    (error) => { 
      if (error.error.error !== '' && error.error.message !== this.transactionError) {
        this.openConfirmationDialog('Erreur Serveur : '+error.error.message,'ok', false);   
     } else {
        this.openConfirmationDialog(this.messageError,'ok',false);  
     }   
     
    } );
  }

}
//****************************************************************************************************/
updateCustomerParkItem(){
   if(this.isUpdateToActifLine){
      this.updateCustomerParkItemWithStep()
   }else{ 
     this.updateCustomerParkItemWithoutStep()}
}
//**********************Update To actif Line **************************************************************/
  updateCustomerParkItemWithStep(): void {
    if (this.customerParkItemUpdateForm.valid) {
      this.prepareParkToSave();
      this.billingService.getBillAccountByPeniche(this.customerParkItem.customerIdentifier, this.customerParkItem.numClient).subscribe(
        data => {
          if(data === null){
           this.notificationService.setCPI(this.customerParkItem);
           this.gotoRequiredInfo();
            this.popUpAccountNotFound();
          }
          else{
            this.updateCustomerParkItemWithoutStep();
          }
        },
        error => {
          console.error('getBillAccountByPeniche failed: ', error);
          return of(null);
        });
    
    }
  }


  gotoRequiredInfo() {
    this.router.navigate(
        [this.customerDashboard, this.idCustomer, 'detail', 'creation-line','required-info'],
      {
        queryParams: { typeCustomer: this.typeCustomer, customerId: this.idCustomer },    
        queryParamsHandling: 'merge'
      }
      ); 
  }


  popUpAccountNotFound(): void {
        const title = 'Attention';
        const comment = 'Il n\'y a pas de compte de facturation associé dans Péniche, merci de le créer pour valider l\'enregistrement';
        const btnOkText = 'OK';
        this.confirmationDialogService.confirm(title, comment, btnOkText, null, 'lg',true)
         .then((confirmed) => {
       if (confirmed) {
         this.gotoRequiredInfo();
       } 
      })
      .catch(() => console.log('User dismissed the dialog'));
} 

  openConfirmationDialog(commentText: string,OkText: string, isCancelBtnVisible: boolean): any {
   
    const title = 'Erreur';
    this.confirmationDialogService.confirm(title, commentText, OkText,'Non','lg', isCancelBtnVisible)
    .then((confirmed) => {
      if (confirmed)  {
        this.back();
      }
     
     } )
    .catch(() => console.log('User dismissed the dialog'));
  }

  

  onFormGroupChange( form: FormGroup): void {
    this.customerParkItemUpdateForm = form;
  }

  back(){
    const customerDashbord ='/customer-dashboard';
    if (this.route.snapshot.queryParams['from'] === 'all') {
      let page = (this.typeCustomer === 'company') ? 'list-enterprise' : 'list-particular';
      this.router.navigate([customerDashbord,  this.idCustomer , 'park-item', page],
      { queryParams: { typeCustomer: this.typeClient, from: 'all'} });
    } 
    
    if (this.route.snapshot.queryParams['from'] === 'dashboard') {
      let page = (this.typeCustomer === 'company') ? 'entreprise' : 'particular';
      this.router.navigate([customerDashbord, page, this.idCustomer],
        { queryParams: { typeCustomer: this.typeClient , from: 'dashboard'} });
    }

  }
 

  OncheckRenewMobile(values:any): void{
    
    const renewalDateCtrl = this.customerParkItemUpdateForm.get('renewalDate');
    const commentMobiledCtrl = this.customerParkItemUpdateForm.get('commentMobile');
    if(values.currentTarget.checked){
    
      renewalDateCtrl.enable();
      commentMobiledCtrl.enable();
    }
    else{
      renewalDateCtrl.disable();
      commentMobiledCtrl.disable();
    }
    
  }

  onSubmittedChange( submitted: boolean): void {
    this.submitted = submitted;
  }

  onCanceledChange( canceled: boolean): void {
    this.canceled = canceled;
  }
 
  routerAfterCanceling(canceled: boolean) : void{ 
    this.onCanceledChange(canceled);  
    const commentText = 'Êtes-vous sûr de vouloir annuler votre saisie ?';
    const OkText = 'Oui';
    this.openConfirmationDialog(commentText,OkText,true);
}




onChangeStatus (newNicheStatus : string) : void{
  if(newNicheStatus !== null){
    this.controleShowFields(newNicheStatus);
   if(newNicheStatus === NicheContractStatus[NicheContractStatus.ACTIF]){
    this.isUpdateToActifLine = true
   }
  } 
  this.customerParkItemUpdateForm.setControl("newNumber", this.formBuilder.control('',this.showNewNumber ? [Validators.required] : []))
  this.customerParkItemUpdateForm.setControl("subscriptionDate", this.formBuilder.control('',this.showPickerSubscriptionDate ? [Validators.required] : []))
  this.customerParkItemUpdateForm.setControl("cancellationDate", this.formBuilder.control('',this.showPickerCancellationDate ? [Validators.required] : []))
  this.customerParkItemUpdateForm.setControl("unnumberedDate", this.formBuilder.control('',this.showNewNumber ? [Validators.required] : []))
}

  controleShowFields(nicheStatus : string): void{
  this.showNewNumber = this.parcItemUpdateService.isNewNumberAndDateUnnumberedVisibleAndEdited(nicheStatus);
  this.showPickerUnnumberedDate = this.parcItemUpdateService.isNewNumberAndDateUnnumberedVisibleAndEdited(nicheStatus);
  this.showInputSubscriptionDate = this.parcItemUpdateService.isInputSubscriptionDateVisible(nicheStatus);
  this.showInputCancellationDate = this.parcItemUpdateService.isInputCancelationDateVisible(nicheStatus);
  this.showPickerSubscriptionDate = this.parcItemUpdateService.isPickerSubscribtionDateVisible(nicheStatus);
  this.showPickerCancellationDate = this.parcItemUpdateService.isPickerCancelationDateVisible(nicheStatus);

}


 isRenewalManual() : void {
 
   if(!isNullOrUndefined(this.customerParkItem) && !isNullOrUndefined(this.customerParkItem.universe)
   && this.customerParkItem.universe === 'MOBILE' &&   !isNullOrUndefined(this.rangRenewal)){
    this.isAuthorized = this.rangRenewal ==='notRestricted' ? false : true;   
   }	
  
  
}

}
