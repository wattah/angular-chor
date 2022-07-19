import { PenicheLineDetailsVO } from './../../../_core/models/peniche-line-details-vo';
import { PenicheBillCreditComplementaryVO } from './../../../_core/models/peniche-bill-credit-complementary-vo';
import { BillingService } from './../../../_core/services/billing.service';
import { isNullOrUndefined } from './../../../_core/utils/string-utils';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './../../../_core/services/notification.service';

@Component({
  selector: 'app-add-credit',
  templateUrl: './add-credit.component.html',
  styleUrls: ['./add-credit.component.scss'],
})
export class AddCreditComponent implements OnInit {

  
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  isValid = false;
  addCreditForm: FormGroup;
  linesDetails : Array<PenicheLineDetailsVO>;


  billAccountIdentifier : string;
  clientIdentifier : string;
  referenceBillNumber : string;
  paymentMethod : string;
  billCreditComplementary : PenicheBillCreditComplementaryVO;
  totalAmounts : number = 0;
  IndexesOfLineDetailsInvalid : any[];

  typePieceInvalid = false;
  numPieceInvalid = false;
  transmitDateInvalid = false;

  labelInvalid = false;
  categoryInvalid = false;
  amountHTInvalid = false;
  tvaInvalid = false;

  isDetailsLinesValid = true;
  isNewCreditValid=true;

  constructor(private readonly confirmationDialogService: ConfirmationDialogService, private readonly location: Location,
              private readonly route: ActivatedRoute,private readonly _formBuilder: FormBuilder,
              private readonly billingService: BillingService,private readonly notificationService: NotificationService
              ) { 
                this.addCreditForm  = new   FormGroup({});
              }

  ngOnInit() {
    this.billAccountIdentifier = this.route.snapshot.queryParamMap.get('billAccountIdentifier');
    this.clientIdentifier = this.route.snapshot.queryParamMap.get('clientIdentifier');
    this.referenceBillNumber = this.route.snapshot.queryParamMap.get('referenceBillNumber');
    this.checkPaymentMethod();
    this.billCreditComplementary = {} as PenicheBillCreditComplementaryVO;
    this.billCreditComplementary.transmitDate = new Date(this.route.snapshot.queryParamMap.get('date'));
    this.buildFrom();
    this.linesDetails = [{} as PenicheLineDetailsVO];
    this.billCreditComplementary.billAccountNumber = this.billAccountIdentifier;
    this.billCreditComplementary.clientNumber = this.clientIdentifier;
    this.billCreditComplementary.referenceBillNumber = this.referenceBillNumber;
    this.billCreditComplementary.type = null;
    this.billCreditComplementary.deductionCredit = false;
    this.billCreditComplementary.linesList = this.linesDetails;
    this.onCanceledChange.emit(false);
  }

  checkPaymentMethod(): boolean{
    const PRELEVEMENT_AMEX = "Prélèvement AMEX";
    const PRELEVEMENT_CB ="Prélèvement CB";
    const PRELEVEMENT_SEPA ="Prélèvement SEPA";
    this.paymentMethod = this.route.snapshot.queryParamMap.get('paymentMethod');
    if( !isNullOrUndefined(this.paymentMethod) && ( this.paymentMethod=== PRELEVEMENT_AMEX || this.paymentMethod === PRELEVEMENT_CB || this.paymentMethod === PRELEVEMENT_SEPA)){
      return true;
    }else{
      return false;
    }
  }

  buildFrom(): any {
    this.addCreditForm = this._formBuilder.group({
      typePiece : this._formBuilder.control( this.billCreditComplementary.type, Validators.required),
      numPiece : this._formBuilder.control( this.billCreditComplementary.billNumber, Validators.required),
      transmitDate : this._formBuilder.control( this.billCreditComplementary.transmitDate, Validators.required),
      deductedFromLevy :  this._formBuilder.control( this.billCreditComplementary.deductionCredit, null),

    });
    
  }

  /**
 * @author HGM
 * add other credit
 */
   addLineDetail(event){
    event.preventDefault();
    const lineDetails = {} as PenicheLineDetailsVO;
    this.linesDetails.push(lineDetails);
  }

  /**
   * @author HGM
   * @param index of line detail
   * catch remove line detail event from child
   */
   onRemoveLineDetailsItemEvent(index){
    this.linesDetails.splice(index, 1);
  }

  onAmountHTChangeEvent(){
    this.totalAmounts = 0;
   if(this.linesDetails && this.linesDetails.length >0){
      this.linesDetails.forEach(lineDetail => {
        if(!isNullOrUndefined(lineDetail.amount) && !isNullOrUndefined(lineDetail.tvaRate)){
          this.totalAmounts = this.totalAmounts + (lineDetail.amount + (lineDetail.amount * lineDetail.tvaRate)/100);
        }
      });
   }
  }

  initValidators(){
    this.typePieceInvalid = false;
    this.numPieceInvalid = false;
    this.transmitDateInvalid = false;
  }

  validateNewCredit(form){ 
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
          switch (name) {
            case 'typePiece':
              this.typePieceInvalid = true;
            break;
            case 'numPiece':
              this.numPieceInvalid = true;
            break;
            case 'transmitDate':
              this.transmitDateInvalid = true;
            break;
            default:
             break;
          }
        }
    }

    if(invalid.length === 0){
      this.isNewCreditValid = true;
   }
   else{
     this.isNewCreditValid = false;
   }
  }

  enregistrer(){
    this.initValidators();
    this.validateNewCredit(this.addCreditForm);
    this.validateDetailsLinesForms();
    if(this.isNewCreditValid && this.isDetailsLinesValid){
      this.billingService.checkIfCRExists(this.billCreditComplementary.transmitDate,this.clientIdentifier).subscribe(
        (response) => {
           if(response){
            this.callTheSaveWS();
           }else{
             this.showPopupExistingCRInSamePeriod();
           }
        },
        (error: HttpErrorResponse) => {
          if(error.status === 500){
            this.confirmationDialogService.confirm('Erreur', error.error.message, 'Ok', null, 'lg', false);
          }
        } 
      );
    }
  }

  callTheSaveWS()
  {
    this.billingService.saveBillCreditCompl(this.billCreditComplementary).subscribe(
      (response) => {
        this.notificationService.setPenicheBillCreditComplementaryVo(this.billCreditComplementary);
        this.location.back();
      },
      (error: HttpErrorResponse) => {
        if(error.status === 500){
          this.confirmationDialogService.confirm('Erreur', error.error.message, 'Ok', null, 'lg', false);
        }
      }
    );
  }

  showPopupExistingCRInSamePeriod(){
    const title = '';
        const comment = 'Un Compte Rendu a déjà été généré pour la période de la facture. Si vous continuez, le compte rendu sera supprimé. Voulez vous continuer ?';
        const btnOkText = 'Oui';
    const btnCancelText = 'Non';
        this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg', true)
         .then((confirmed) => {
            if (confirmed) {
              this.billingService.deleteExistingReport(this.billCreditComplementary.transmitDate,this.clientIdentifier).subscribe(
                (response) => {
                   if(response){
                    this.callTheSaveWS();
                   }
                },
                (error: HttpErrorResponse) => {
                  this.confirmationDialogService.confirm('Attention', error.error.message, 'Ok', null, 'lg', false);
                } 
              );
            } 
          })
         .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  validateDetailsLinesForms(){
    this.IndexesOfLineDetailsInvalid = [];
    this.isDetailsLinesValid = true;
    let index = 1;
    this.linesDetails.forEach(lineDetail => {
      if(isNullOrUndefined(lineDetail.lineLabel)){
        this.IndexesOfLineDetailsInvalid.push({ name : 'Libellé',index : index});
        this.isDetailsLinesValid = false;
      } 
      if(isNullOrUndefined(lineDetail.lineCategory)){
        this.IndexesOfLineDetailsInvalid.push({ name : 'Catégorie',index : index});
        this.isDetailsLinesValid = false;
      } 
      if(isNullOrUndefined(lineDetail.amount)){
        this.IndexesOfLineDetailsInvalid.push({ name : 'Montant',index : index});
        this.isDetailsLinesValid = false;
      }
      if(isNullOrUndefined(lineDetail.tvaRate)){
        this.IndexesOfLineDetailsInvalid.push({ name : 'TVA',index : index});
          this.isDetailsLinesValid = false;
      }
      index++;
    });
  }

  annuler(): void {
        const title = 'Erreur!';
        const comment = 'Êtes-vous sûr de vouloir annuler votre saisie ?';
        const btnOkText = 'Oui';
    const btnCancelText = 'Non';
        this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg', true)
         .then((confirmed) => {
       if (confirmed) {
        this.location.back();
        this.onCanceledChange.emit(true);
       } 
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  } 

}
