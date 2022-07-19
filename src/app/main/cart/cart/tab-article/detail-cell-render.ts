import { RedirectionService } from './../../../../_core/services/redirection.service';
import { FormStoreManagementService } from './from-store-management.service';
import { CustomerParkItemVO } from './../../../../_core/models/customer-park-item-vo';
import { ParcLigneService } from './../../../../_core/services/parc-ligne.service';
import { ActivatedRoute } from '@angular/router';
import { getCustomerIdFromURL } from './../../../../main/customer-dashboard/customer-dashboard-utils';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { first } from 'rxjs/operators';
import { generateRandomString, isNullOrUndefined } from './../../../../_core/utils/string-utils';
import { ParkItemListParticularService } from './../../../../main/park-item/park-item-list-particular/park-item-list-particular.service';
import { ActService } from 'src/app/_core/services';

@Component({
  selector: 'app-detail-cell-renderer',
  template: `
  <form  [formGroup]="form">
  <div style="height: 100%; padding: 20px; box-sizing: border-box; white-space: normal !important; word-wrap: break-word !important;">
<div class="row">
    <div class="col-lg-12 d-lg-block col-24" style="user-select: text !important;">
        <div><strong class="athena"> Type: </strong> {{ type }}</div>
        <div><strong class="athena"> Catégorie : </strong> {{ category }} </div>
        <div><strong class="athena"> Référence : </strong> {{ partnerProductReference ? partnerProductReference:'-'}}</div>
        <div class="d-block d-sm-none d-lg-none"><strong class="athena">Quantité : </strong> {{quantity}} </div>
        <div class="d-block d-sm-none d-lg-none"><strong class="athena">Prix(TTC) : </strong> {{price}}</div> 


        <div class="form-group row   mt-0 mt-lg-3  mb-2 mb-lg-0">
            <label class="col-24 col-sm-6 col-lg-9 athena font-weight-bold">
                <strong class="athena"> N° de série</strong>
            </label>
            <div class="col-24 col-sm-18 col-lg-15 pl-0">
                <input class="h-respo athena form-control" formControlName="serial" type="text" />
            </div>
        </div>
        <br>
        <div class="form-group row" *ngIf="showLines">
            <label class="col-24 col-sm-6 col-lg-9 athena">
                <strong class="athena"> Ligne associée</strong>
            </label>
            <div class="col-24 col-sm-18 col-lg-15 pl-0">
                <mat-form-field class="custum_stock">
                    <mat-select [disableRipple]="true" 
                    class="addarrow" 
                    formControlName="associetedLine">
                        <option [value]="null" disabled> - - </option>
                        <mat-option *ngFor="let park of parkItems" [value]="park.id">
                            <!-- Pour icone vert et supprimer d-none -->
                            <span class="icon mr-1" [ngClass]="getIconStatusRenewal(park.rangRenewal)" *ngIf="park.universe === 'MOBILE'"> </span> 
                            {{park.webServiceIdentifier}} {{park.libelleContract ? '-':''}}  {{park.libelleContract ? park.libelleContract:''}}
                        </mat-option>
                    </mat-select>
                </mat-form-field> 
            </div>
        </div>
        <div class="form-group row" *ngIf="params?.data?.product?.masterProduct?.customizedBenefit">
            <label class="col-24 col-sm-24 col-lg-24 athena">
                <strong class="athena"> Prestation sur mesure : détail des actes de main d’œuvre sur le devis :</strong>
            </label>
            <div class="col-24 athena mt-1">
              <div class="d-flex justify-content-between py-1" *ngFor="let a of acteList">
                <span class="form-check-label athena mr-2"><strong class="athena"> {{a?.titleAct}}</strong> </span>
                <input class="form-check-input athena" type="checkbox" [id]="randomName+'-act-'+a?.id" [checked]="a.checked"  (change)="onSelectAct($event,a)" >
                <label class="form-check-label athena" [for]="randomName+'-act-'+a?.id"></label>
              </div> 
            </div>
        </div>
    </div>
    <div class="col-lg-12 col-24 pl-0 pl-lg-5">
        <div class="row">
            <label class="athena col-sm-6 col-lg-6 p-0">
                <strong class="athena"> Commentaire <span *ngIf="isCommentDisplayOnBill">*</span> </strong>
            </label>

            <div class="col-sm-18 col-lg-18 col-24">
                <div class="form-check">
                    <input 
                    class="form-check-input athena" 
                    id="{{randomName}}-optionsRadios1" 
                    type="radio" 
                    [checked]="!isCommentDisplayOnBill" 
                    [value]="false" 
                    formControlName="radio"/>
                    <label class="form-check-label athena" for="{{randomName}}-optionsRadios1">
                    Interne (Non visible sur le devis) 
                    </label>
                </div>

                <div class="form-check">
                    <input 
                    class="form-check-input athena" 
                    id="{{randomName}}-optionsRadios2" 
                    type="radio" [checked]="isCommentDisplayOnBill" 
                    [value]="true" 
                    formControlName="radio"/>
                    <label class="form-check-label athena" for="{{randomName}}-optionsRadios2">
                    Externe (Visible sur le devis) 
                    </label>
                </div>
            </div>
            <div class="col-24 col-sm-18 col-lg-24 mt-1 ml-auto">
                <textarea class="form-control athena h-textarea" formControlName="comment" rows="8"></textarea>
            </div>
        </div>
    </div>
</div>
</div>
  `,
})
export class DetailArticlRenderer implements ICellRendererAngularComp {
    type: any;
    category: any;
    form;
    customerId: any;
    parkItems: CustomerParkItemVO[];
    partnerProductReference: any;
    serial: any;
    commentMandatory: any;
    isCommentDisplayOnBill: any;
    herChangedTab = false;
    comment: any;
    price: number;
    quantity: any;
    cartStatus: any;
  randomName: string;
  params: any;
  acteList = [];
  selectedActList = [];
  renouvellements = [
    'Renouvellement Monde',
    'Renouvellement Annuel'
  ]
  showLines: boolean;
  radioFormControlName = 'radio';
  serialFormControlName = 'serial';
  associetedLineFormControlName = 'associetedLine';
  commentFormControlName = 'comment';
  actsFormControlName = 'acts';
  customizedBenefit: boolean;
    constructor(private readonly route: ActivatedRoute,
        private readonly parcLigneService: ParcLigneService,
        private readonly formStoreManagementService: FormStoreManagementService,
        private readonly parkItemListParticularService: ParkItemListParticularService,
        private readonly redirectionService:RedirectionService,
        private readonly actService: ActService){}
  // called on init
  agInit(params: any): void {
    const parent = this.formStoreManagementService.getParentByLevel(params.data.product);
    this.showLines = this.renouvellements.includes(parent.name);
    this.randomName = generateRandomString(5);
    this.getCartStatus();
    this.params = params;
    const formIndex = params.node.id.split('_')[1];
    this.form= this.formStoreManagementService.forms[formIndex];
    this.observeTabChangement(formIndex);
    this.type = this.formStoreManagementService.getParentLabelFromNomenclatureByLevel(params.data , 1)
    this.category = this.formStoreManagementService.getParentLabelFromNomenclatureByLevel(params.data , 3);
    if(params.data.product){
      this.partnerProductReference = params.data.product.masterProduct.id;
    }
    this.serial = params.data.serial;
    this.commentMandatory = params.data.commentMandatory;
    this.comment = params.data.comment;
    this.isCommentDisplayOnBill = params.data.isCommentDisplayOnBill;
    this.price = this.formStoreManagementService.calculateTotalPriceTtc(params.data);
    this.quantity = params.data.quantity;
    this.setComment();
    if(this.commentMandatory){
      this.isCommentDisplayOnBill = true;
      this.form.get(this.radioFormControlName).disable();
      this.observeComment();
    }else{
      this.form.get(this.radioFormControlName).enable();
    }
    this.form.get(this.radioFormControlName).setValue(this.isCommentDisplayOnBill);
    if(this.serial && this.serial.length !== 0){
        this.form.get(this.serialFormControlName).setValue(this.serial);
        this.form.get(this.serialFormControlName).disable();
    }
    this.customerId = getCustomerIdFromURL(this.route);
    this.parcLigneService
      .getParkItemsFull(this.customerId)
      .subscribe((data) => {
        this.parkItems = data;
        this.setParkItemIfExiste(formIndex);
      });

      this.form.get(this.associetedLineFormControlName).valueChanges
      .pipe(first())
      .subscribe(
          (chosenParkItem)=> this.formStoreManagementService.chosenParkItems[formIndex]=chosenParkItem
      );
      this.form.get(this.serialFormControlName).valueChanges
      .pipe(first())
      .subscribe(
          (serailNumber)=> this.formStoreManagementService.serialFieldhasChanged[formIndex]=true
      );

    
      this.form.get(this.radioFormControlName).valueChanges
      .pipe(first())
      .subscribe(
          (chose)=> this.isCommentDisplayOnBill= chose
      );
      this.formStoreManagementService.changeVisibleActionsOnArticleNotification().subscribe(
          (visible)=>{
              if(!visible){
                this.disablingFormElements();
              }else{
                this.enablingFormElements();
              }
          }
      );
      if(!this.hasPermissionOnInfoComplet()){
        this.disablingFormElements();
      }
      if (isNullOrUndefined(params.data.acts)) params.data.acts = [];
      this.getActList(params.data.acts);
  }
  private enablingFormElements() {
    this.form.get(this.associetedLineFormControlName).enable();
    this.form.get(this.radioFormControlName).enable();
    this.form.get(this.commentFormControlName).enable();
    const serial  = this.form.get(this.serialFormControlName).value;
    if(!serial){
      this.form.get(this.serialFormControlName).enable();
    }
  }

  private disablingFormElements() {
    this.form.get(this.associetedLineFormControlName).disable();
    this.form.get(this.radioFormControlName).disable();
    this.form.get(this.commentFormControlName).disable();
    this.form.get(this.serialFormControlName).disable();
  }

  observeComment() {
    this.form.get(this.commentFormControlName).valueChanges.subscribe(
      (data)=>{
        this.params.data.comment = data;
        if(data && data.length === 0){
          this.params.data.productLabel = `<span class="icon picto-exclamation-rouge"></span> ${this.params.data.productLabel}`
        }
        this.params.node.gridApi.refreshCells({
          force: true,
          suppressFlash: true,
        });
      }
    );
  }
    getCartStatus() {
        this.route.data.subscribe((resolve) => {
            this.cartStatus =  resolve['carts'][0] ? resolve['carts'][0].status : '';
        });
    }
    setComment() {
        if(this.comment){
            this.form.get(this.commentFormControlName).setValue(this.comment);
        }
    }
    observeTabChangement(index) {
        this.formStoreManagementService.tabChangeNotification()
        .subscribe(
            (change)=> this.checkSerialuNumer(index , change)
        );
    }
    checkSerialuNumer(formIndex , changeTab) {
        const serial = this.form.get(this.serialFormControlName).value;
      if(this.formStoreManagementService.serialFieldhasChanged[formIndex] 
        && changeTab && serial && serial.length !== 0
        ){
        this.form.get(this.serialFormControlName).disable();
      }
    }
    setParkItemIfExiste(index) {
        if(!this.params.data.customerParkItemId){
          const chosenParkItem = this.formStoreManagementService.chosenParkItems[index];
          if(chosenParkItem && Object.keys(chosenParkItem).length !== 0){
            this.form.get(this.associetedLineFormControlName).patchValue(chosenParkItem);
          }
        }else{
          this.parkItems.forEach(
            (parkItem)=>{
              if(parkItem.id===this.params.data.customerParkItemId){
                this.form.get(this.associetedLineFormControlName).patchValue(parkItem.id);
              }
            }
          );
        }
    }

  refresh(params: any): boolean {
    return false;
  }
  hasPermissionOnInfoComplet() {
    switch (this.cartStatus) {
      case 'PENDING':
        return this.redirectionService.hasPermission('pending_info_complet');
      case 'AWAITING_APPROVAL':
        return this.redirectionService.hasPermission('awaiting_approval_info_complet');
      case 'VALIDATE':
        return this.redirectionService.hasPermission('validate_info_complet');
      case 'ESTIMATE_SENT':
        return this.redirectionService.hasPermission('estimate_sent_info_complet');
      case 'READY_DELIVER':
        return this.redirectionService.hasPermission('ready_deliver_info_complet');
      case 'DELIVERED':
        return this.redirectionService.hasPermission('delivered_info_complet');
      case 'ABANDON':
        return this.redirectionService.hasPermission('abandon_info_complet');
      default:
        return false;
    }
  }

  getIconStatusRenewal(value: string):string {
    return this.parkItemListParticularService.getStatutRenouv(value);
  }

  getActList(acts) {
    this.selectedActList = acts.map( e => ({...e, checked: true} )) ;
    this.form.get(this.actsFormControlName).setValue(this.selectedActList);
    this.form.get(this.actsFormControlName).markAsDirty();
    this.actService.findAll().subscribe(data => {
      this.acteList = data;
      if (acts.length > 0) {
        acts.forEach(d => {
          const index = this.acteList.findIndex( elt => elt.id === d.id);
          this.acteList[index].checked = true;
        });
      }
    });
    this.form.get(this.actsFormControlName).valueChanges
      .pipe(first())
      .subscribe(
          (chose)=> this.selectedActList= chose
      );
  }

  onSelectAct(event,  act) {
    act.checked = event.target.checked;
    if (event.target.checked) {
      this.selectedActList = [ ...this.selectedActList, act ];
    } else {
      this.selectedActList = this.selectedActList.filter( e => e.id != act.id).slice();
    }
    this.form.get(this.actsFormControlName).setValue(this.selectedActList);
  }

  
}
