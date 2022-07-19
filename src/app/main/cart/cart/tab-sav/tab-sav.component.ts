import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, ControlContainer, FormGroupDirective } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { getCustomerIdFromURL } from './../../../../main/customer-dashboard/customer-dashboard-utils';
import { ParcLigneService } from './../../../../_core/services/parc-ligne.service';
import { ManufacturerService } from './../../../../_core/services/manufacturer.service';
import { CustomerHardwareParkService } from './../../../../_core/services/customer-hardware-park.service';
import { CustomerParkItemVO } from './../../../../_core/models/customer-park-item-vo';
import { ManufacturerVO } from './../../../../_core/models/manufacturer-vo';
import { CustomerHardwareParkItemVO, CartSavVO } from '../../../../_core/models/models';
import { RequestDetailsService } from '../../../../_core/services/request-details.service';
import { RequestCustomerVO } from '../../../../_core/models/request-customer-vo';
import { RequestService } from '../../../../_core/services/request.service';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { NotificationService } from '../../../../_core/services/notification.service';

@Component({
  selector: 'app-tab-sav',
  templateUrl: './tab-sav.component.html',
  styleUrls: ['./tab-sav.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]

})
export class TabSavComponent implements OnInit , OnChanges {

  customerId: any;
  requestId: any;

  hideInputs: boolean;
  hideNone = true;
  hideSerials: boolean;

  manufacturer: any;
  description: any;
  dateBuy: string;
  
  parkItems: CustomerParkItemVO[] = [];
  mobileParkItems: CustomerParkItemVO[] = [];
  hardwareParkItems: CustomerHardwareParkItemVO[] = [];
  mobileHardwareParkItems: CustomerHardwareParkItemVO[] = [];
  manufacturers: ManufacturerVO[] = [];
  
  selectedHardware: CustomerHardwareParkItemVO = {} as CustomerHardwareParkItemVO;
  request: RequestCustomerVO;
  parcours = '';
  cartSav: CartSavVO = {} as CartSavVO;
  isRecover = false;
  cartSavManufacturer: ManufacturerVO = {} as ManufacturerVO;
  cartSavSerial: string;
  cartSavParkItem: string;
  space = '  ';
  dash = ' - ';
  matchedParkItem: CustomerParkItemVO;

  savForm: FormGroup;
  @Input() visibleActionsOnSAV;
  @Output() onCheckSavModification: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isRecoverToSendToDelivery: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() clickCancelBtn= false;
  
  selectmanufacturerId : number;
  selectHardwareParkItem : number;
  selectParkItemId :number;
  manufacturerDisabled : boolean;

  @Input() cartSAVResultAfterSave = {} as CartSavVO;
  isChangedAfterSave = false;

  constructor(private readonly route: ActivatedRoute, private readonly parcLigneService: ParcLigneService, 
    private readonly _formBuilder: FormBuilder, private readonly manufacturerService: ManufacturerService,
    private readonly customerHardwarePark: CustomerHardwareParkService, private readonly requestDetailService: RequestDetailsService,
    private readonly datePipe: DatePipe, readonly requestService: RequestService,
    public parent: FormGroupDirective,
    readonly notificationService: NotificationService
    ) { 
      this.savForm  = new   FormGroup({});
  }



  ngOnChanges(change: SimpleChanges){
    if(change['visibleActionsOnSAV']){
      this.setRestriction();
    }
 
      if(!change['clickCancelBtn'].isFirstChange() &&  change['clickCancelBtn']){
          this.cancelFormChanges(); 

        }

        if(change['cartSAVResultAfterSave'] && 
        this.cartSAVResultAfterSave && this.cartSAVResultAfterSave.id){
        this.cartSav = this.cartSAVResultAfterSave;
         console.log('cartSav after sav in sav ',this.cartSav);
         this.initDataCartSav();
       this.initLigneDesParc();
         this.onCheckSavModification.emit(false);   
         this.isChangedAfterSave = true;
   }
  }

  ngOnInit(): any {
    this.savForm = this.parent.form;
    this.savForm .addControl('sav', new FormGroup({
      serialSelect: this._formBuilder.control(null),
      parcImpacteSelect: this._formBuilder.control(null),
      manufacturerSelect : this._formBuilder.control('--'),
      descriptionText: this._formBuilder.control(null),
      numeroSerieInput: this._formBuilder.control(null),
      cartSavObject : this._formBuilder.control(null),
    }))
    this.setRestriction();
    this.customerId = getCustomerIdFromURL(this.route);
    this.requestId = this.route.snapshot.paramMap.get('idRequest');

    this.requestService.getCartSavByRequest(this.requestId).subscribe((data) => {
      this.cartSav = data;
      if(!isNullOrUndefined(this.cartSav)){
        this.isRecover = this.cartSav.isRecover ? true : false; 
        this.isRecoverToSendToDelivery.emit(this.isRecover);
        this.savForm.get('sav').get('cartSavObject').setValue(this.cartSav);
      }

    },
      (erreur) => {console.log('erreur', erreur); },
      () => { 
        this.getCartSavData();
        this.notifyWhenSavFromIsChanged();
      }); 
       
    this.parcLigneService.getParkItemsFull(this.customerId).subscribe((data) => {
      this.parkItems = data; 
    },
     
      (err) => {console.log('err', err); },
      () => {
      
        for (const el of this.parkItems) {
            this.mobileParkItems.push(el);
        }
       this.initLigneDesParc();
      });

    this.manufacturerService.getAllManufacturers().subscribe((data) => {
      this.manufacturers = data; 
    },
      (er) => {console.log('er', er); },
      () => {
        for (const item of this.manufacturers) {
          if (!isNullOrUndefined(this.cartSav) &&  item.id === this.cartSav.manufacturerId) {
            this.cartSavManufacturer = item;
          }
        } 
      });
 
    this.customerHardwarePark.getAllHardwareParkItems(this.customerId).subscribe((reponse) => {
      this.hardwareParkItems = reponse; 
    }, 
      (error) => {console.log('error', error); },
      () => {
        for (const element of this.hardwareParkItems) {
          this.mobileHardwareParkItems.push(element);
        }
        
        this.initDataCartSav();
      });
     
    this.requestDetailService.getDetailsByRquestId(this.requestId).subscribe((response) => 
    this.request = response);

      this.notifyWhenSavFromIsChanged();
  }
  setRestriction() {
    if(!isNullOrUndefined(this.savForm.get('sav'))){
    if(this.visibleActionsOnSAV){
      this.savForm.get('sav').enable();
    }else{
      this.savForm.get('sav').disable();
    }}
  }

  initDataCartSav(){
    if(isNullOrUndefined(this.cartSav)){
      this.hideInputs = true;
      this.hideNone = true;
      this.hideSerials = false;
    }
    else{
    if(!isNullOrUndefined(this.cartSav) && this.cartSav.hardwareParkItemId === null){
      this.hideNone = true;
      this.hideSerials = false;
      this.savForm.get('sav').get('descriptionText').setValue(this.cartSav.description);
      this.savForm.get('sav').get('numeroSerieInput').setValue(this.cartSav.serial);
      this.savForm.get('sav').get('manufacturerSelect').setValue(this.cartSav.manufacturerId);
      this.selectmanufacturerId = this.cartSav.manufacturerId;
      if(!isNullOrUndefined(this.cartSav.manufacturerId)){
        const manufacture = this.manufacturers.find((x) => x.id ===  this.cartSav.manufacturerId);
        this.savForm.get('sav').get('manufacturerSelect').setValue(manufacture);
      }
      this.selectmanufacturerId = this.cartSav.manufacturerId;
      this. manufacturerDisabled = true;
      if(this.cartSav.isOtherHardware) {
        this.savForm.get('sav').get('serialSelect').setValue('autre');
        this.hideInputs = true;
      } else {
        this.savForm.get('sav').get('serialSelect').setValue('null');
        this.hideInputs = false;
      }
      
    }
    else{
      const datePattern = 'dd MMM yyyy';
     const currentHardwarePI = this.hardwareParkItems.find((x) => x.id ===  this.cartSav.hardwareParkItemId)
     if(!isNullOrUndefined(currentHardwarePI) && !isNullOrUndefined(currentHardwarePI.manufacturerId)){
       const manufacture = this.manufacturers.find((x) => x.id ===  currentHardwarePI.manufacturerId);
      this.manufacturer = !isNullOrUndefined(manufacture) ? manufacture.name : " ";
     }
     if(!isNullOrUndefined(currentHardwarePI)){
      this.description = currentHardwarePI.productLabel != null ? currentHardwarePI.productLabel : " ";
      this.selectHardwareParkItem  = currentHardwarePI.id;
      this.savForm.get('sav').get('serialSelect').setValue(currentHardwarePI);
      this.parcours = currentHardwarePI.requestType;
     }
    if(!isNullOrUndefined(this.cartSav)){
      this.dateBuy = this.datePipe.transform(currentHardwarePI.subscriptionDate, datePattern);
    }
     this.hideInputs = false;
      this.hideNone = false;
      this.hideSerials = true;
      
      
    }}
    
  }
  initLigneDesParc(){
    console.log('save   ', this.cartSav)
    if(!isNullOrUndefined(this.cartSav)){
    if(this.cartSav.parkItemId === null && this.cartSav.isOtherParkItem){
      this.savForm.get('sav').get('parcImpacteSelect').setValue('autre');
    }
    else if (this.cartSav.parkItemId !== null){
      this.selectParkItemId = this.cartSav.parkItemId;
      const currentParkItem = this.parkItems.find((x) => x.id ===  this.cartSav.parkItemId)
      this.savForm.get('sav').get('parcImpacteSelect').setValue(currentParkItem);
    } else {
      this.savForm.get('sav').get('parcImpacteSelect').setValue(null);
    }
  }
  }

  getCartSavData(): any {
    if(!isNullOrUndefined(this.cartSav)){
      this.cartSavSerial = this.cartSav.description ? this.cartSav.serial + this.space + this.cartSav.description 
      : this.cartSav.serial ;
    }
         
  }
  
  serialChangeHandler(event: any): any {  
    const datePattern = 'dd MMM yyyy';
    if ( event.target.value === 'autre' || event.target.value === 'null') {
      this.savForm.get('sav').get('descriptionText').setValue('');
      this.savForm.get('sav').get('numeroSerieInput').setValue(null);
      this.savForm.get('sav').get('manufacturerSelect').setValue(null);
      this.checkInputHide(event.target.value);
      this.hideNone = true;
      this.hideSerials = false;
    }  else if ( event.target.value !== 'autre' && event.target.value !== 'null') {
      this.hideInputs = false;
      this.hideNone = false;
      this.hideSerials = true;
      this.manufacturer = " - ";
      const selectedHardwarePI = this.savForm.get('sav').get('serialSelect').value;
     if(!isNullOrUndefined(selectedHardwarePI)){
       if(!isNullOrUndefined(selectedHardwarePI.manufacturerId)){
        this.manufacturer = this.manufacturers.find((x) => x.id ===  selectedHardwarePI.manufacturerId).name;
       }
      this.description = selectedHardwarePI.productLabel;
      if(!isNullOrUndefined(this.cartSav) && !isNullOrUndefined(selectedHardwarePI.subscriptionDate)){
        this.dateBuy = this.datePipe.transform(selectedHardwarePI.subscriptionDate, datePattern);
      }
      this.parcours = selectedHardwarePI.requestType;
     }
   
    }
  }

  checkInputHide(key): void {
    if(key === 'null') {
      this.hideInputs = false;
    } else {
      this.hideInputs = true;
    }
  }

  private notifyWhenSavFromIsChanged() {
    this.savForm.get('sav').valueChanges.subscribe((data) => {
      if(this.savForm.get('sav').dirty){
        this.onCheckSavModification.emit(true);
        console.log('notifyWhenSavFromIsChanged ');
        this.notificationService.setShowButton(false);
      } 
     
    });
  }
 
  cancelFormChanges(){
  this.initDataCartSav();
  this.initLigneDesParc();
  this.clickCancelBtn = false;
  }
}
