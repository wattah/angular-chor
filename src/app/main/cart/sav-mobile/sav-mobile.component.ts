import { ManufacturerVO } from './../../../_core/models/manufacturer-vo';
import { CartSavVO } from './../../../_core/models/models';
import { CartSavService } from './../../../_core/services/http-cart-sav.service';
import { DatePipe } from '@angular/common';
import { ManufacturerService } from './../../../_core/services/manufacturer.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ParcLigneService } from './../../../_core/services/parc-ligne.service';
import { RequestService } from './../../../_core/services/request.service';
import { getCustomerIdFromURL } from './../../customer-dashboard/customer-dashboard-utils';
import { RequestCustomerVO } from './../../../_core/models/request-customer-vo';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Injector, OnInit } from '@angular/core';
import { CustomerHardwareParkService } from './../../../_core/services/customer-hardware-park.service';
import { isNullOrUndefined } from './../../../_core/utils/string-utils';

@Component({
  selector: 'app-sav-mobile',
  templateUrl: './sav-mobile.component.html',
  styleUrls: ['./sav-mobile.component.scss']
})
export class SavMobileComponent implements OnInit {
  detailRequest: RequestCustomerVO;
  customerId: string;
  parkItems;
  sav: CartSavVO;
  hardwareParkItems;
  description;
  hideInputs: boolean;
  hideNone: boolean;
  hideSerials: boolean;
  form: FormGroup;
  selectmanufacturerId: any;
  manufacturers: ManufacturerVO[];
  manufacturerDisabled: boolean;
  manufacturer: string;
  selectHardwareParkItem: any;
  parcours: any;
  dateBuy: any;
  requestAnswers: any;
  datePattern = 'dd MMM yyyy';
  route: ActivatedRoute;
  requestService: RequestService;
  parcLigneService: ParcLigneService;
  customerHardwarePark: CustomerHardwareParkService;
  _formBuilder: FormBuilder;
  manufacturerService: ManufacturerService;
  datePipe: DatePipe;
  cartSavService: CartSavService;
  router: Router
  constructor(private readonly injector : Injector) { 
    this.injectServices();
  }
  injectServices() {
    this.route= this.injector.get<ActivatedRoute>(ActivatedRoute);
    this.requestService= this.injector.get<RequestService>(RequestService);
    this.parcLigneService= this.injector.get<ParcLigneService>(ParcLigneService);
    this.customerHardwarePark= this.injector.get<CustomerHardwareParkService>(CustomerHardwareParkService);
    this._formBuilder= this.injector.get<FormBuilder>(FormBuilder);
    this.manufacturerService= this.injector.get<ManufacturerService>(ManufacturerService);
    this.datePipe= this.injector.get<DatePipe>(DatePipe);
    this.cartSavService= this.injector.get<CartSavService>(CartSavService);
    this.router= this.injector.get<Router>(Router);
  }

  ngOnInit() {
    this.customerId =  getCustomerIdFromURL(this.route);
    this.form = this.buildForm();
    this.initData();
    this.setManufacturer();
    this.observeSerialSelect();
    this.observeParcImpacteSelect();
    this.observeManufacturerSelect();
  }

  private initData() {
    this.route.data.subscribe((resolve) => {
      this.detailRequest = resolve['detailRequest'];
      this.manufacturers = resolve['manufacturers'];
      this.requestAnswers = resolve['requestAnswers'];
      this.sav = resolve['sav'];
      if (!this.sav){
        this.sav =  {} as CartSavVO;
        this.sav.requestId = this.detailRequest.idRequest;
        this.hideInputs = true;
        this.hideNone = true;
        this.hideSerials = false;
      }
      this.getCustomerHardwarePark();
      this.initSAV();
      this.serialInput();
      this.parcLigneService.getParkItemsFull(this.customerId).subscribe((data) => {
        this.parkItems = data;
        this.initLigneDesParc();
      });
    });
  }

  buildForm(): FormGroup {
    return this._formBuilder.group({
      serialSelect: this._formBuilder.control(null),
      parcImpacteSelect: this._formBuilder.control(null),
      manufacturerSelect : this._formBuilder.control('--'),
      descriptionText: this._formBuilder.control(null),
      numeroSerieInput: this._formBuilder.control(null),
      savObject : this._formBuilder.control(null),
    })
  }
  initSAV() {
    if(this.sav && this.sav.hardwareParkItemId === null){
      this.hideNone = true;
      this.hideSerials = false;
      this.form.get('descriptionText').setValue(this.sav.description);
      this.form.get('numeroSerieInput').setValue(this.sav.serial);
      this.form.get('manufacturerSelect').setValue(this.sav.manufacturerId);
      this.selectmanufacturerId = this.sav.manufacturerId;
      this.selectmanufacturerId = this.sav.manufacturerId;
      this.manufacturerDisabled = true;
      if(this.sav.isOtherHardware) {
        this.form.get('serialSelect').setValue('autre');
        this.hideInputs = true;
      } else {
        this.form.get('serialSelect').setValue('null');
        this.hideInputs = false;
      }
    }else {
      this.hideInputs = false;
      this.hideNone = false;
      this.hideSerials = true;
    }
  }   
  initHardwarePI(currentHardwarePI) {
    if(currentHardwarePI){
      this.description = currentHardwarePI.productLabel != null ? currentHardwarePI.productLabel : " ";
      this.selectHardwareParkItem  = currentHardwarePI.id;
      this.form.get('serialSelect').setValue(currentHardwarePI);
      this.parcours = currentHardwarePI.requestType;
      if(this.sav && !isNullOrUndefined(currentHardwarePI.subscriptionDate)){
        this.dateBuy = this.datePipe.transform(currentHardwarePI.subscriptionDate, this.datePattern);
      } else {
        this.dateBuy = '';
      }
    }
  }
    
  getCustomerHardwarePark() {
    this.customerHardwarePark.getAllHardwareParkItems(this.customerId).subscribe((data) => {
      this.hardwareParkItems = data;
      const currentHardwarePI = this.hardwareParkItems.find((x) => x.id ===  this.sav.hardwareParkItemId);
      if(currentHardwarePI){
        this.description = currentHardwarePI.productLabel ? currentHardwarePI.productLabel : '';
      }
     if(currentHardwarePI && currentHardwarePI.manufacturerId){
        const manufacture = this.manufacturers.find((x) => x.id ===  currentHardwarePI.manufacturerId);
        this.manufacturer = manufacture ? manufacture.name : " ";
     }
     this.initHardwarePI(currentHardwarePI);
    });
  }

  initLigneDesParc(){
    if(this.sav) {
      if(!this.sav.parkItemId && this.sav.isOtherParkItem){
        this.form.get('parcImpacteSelect').setValue('autre');
      } else if (this.sav.parkItemId !== null) {
      const currentParkItem = this.parkItems.find((x) => x.id ===  this.sav.parkItemId);
      console.log('currentParkItem ' , this.parkItems);
      this.form.get('parcImpacteSelect').setValue(currentParkItem);
      } else {
        this.form.get('parcImpacteSelect').setValue(null);
      }
    }
  }

  setManufacturer() {
    if(this.sav && this.sav.manufacturerId){
      this.manufacturers.forEach(
       (manufacturer)=> {
         if(manufacturer.id === this.sav.manufacturerId){
          this.form.get('manufacturerSelect').setValue(manufacturer);
         }
       }
      );
    }
  }

  serialChangeHandler(event: any): any {  
    if (event.target.value === 'autre' || event.target.value === 'null') {
      this.form.get('descriptionText').setValue('');
      this.form.get('numeroSerieInput').setValue(null);
      this.form.get('manufacturerSelect').setValue(null);
      this.checkHidInput(event.target.value);
      this.hideNone = true;
      this.hideSerials = false;
      this.dateBuy = null;
    } else if ( event.target.value !== 'autre' && event.target.value !== 'null') {
      this.hideInputs = false;
      this.hideNone = false;
      this.hideSerials = true;
      this.manufacturer = " - ";
      const selectedHardwarePI = this.form.get('serialSelect').value;
     if(selectedHardwarePI){
       if(selectedHardwarePI.manufacturerId){
        this.manufacturer = this.manufacturers.find((x) => x.id ===  selectedHardwarePI.manufacturerId).name;
       }
      this.description = selectedHardwarePI.productLabel;
      if(this.sav && !isNullOrUndefined(selectedHardwarePI.subscriptionDate)){
        this.dateBuy = this.datePipe.transform(selectedHardwarePI.subscriptionDate, this.datePattern);
      } else {
        this.dateBuy = '';
      }
      this.parcours = selectedHardwarePI.requestType;
     }
   
    }
  }

  checkHidInput(key): void {
    if(key === 'null') {
      this.hideInputs = false;
    } else {
      this.hideInputs = true;
    }
  }

  observeManufacturerSelect() {
    this.form.get('manufacturerSelect').valueChanges.subscribe(
      (manufacture)=>{
        if(manufacture){
          this.sav.manufacturerId = manufacture.id;
        } else {
          this.sav.manufacturerId = null;
        }
      }
    );
  }
  observeParcImpacteSelect() {
    this.form.get('parcImpacteSelect').valueChanges.subscribe(
      (parc)=>{
        if(parc === 'autre') {
          this.sav.isOtherParkItem = true;
          this.sav.parkItemId = null;
        } else if(parc){
          this.sav.parkItemId = parc.id;
          this.sav.isOtherParkItem = null;
        } else {
          this.sav.isOtherParkItem = false;
          this.sav.parkItemId = null;
        }
      }
    );
  }
  observeSerialSelect() {
    this.form.get('serialSelect').valueChanges.subscribe(
      (serial)=>{
        if(serial === 'autre'){
          this.sav.hardwareParkItemId = null;
          this.sav.isOtherHardware = true;
          this.sav.serial = null;
          this.sav.description = null;
          this.manufacturer = null;
        } else if(serial){
          this.sav.hardwareParkItemId = serial.id;
          this.sav.serial = serial.serial;
          this.sav.isOtherHardware = false;
          this.sav.manufacturerId = serial.manufacturerId;
          this.sav.description = serial.productLabel;
        } else {
          this.sav.hardwareParkItemId = null;
          this.sav.serial = null;
          this.sav.isOtherHardware = false;
          this.sav.description = null;
          this.manufacturer = null;
        }
      }
    );
  }

  serialInput(): void {
    this.form.get('numeroSerieInput').valueChanges.subscribe(
      (serial)=>{
        if(serial && this.hideInputs) {
          this.sav.serial = serial;
        }
      });
  }

  save(){
    this.cartSavService.saveOrUpdateCartSAV(this.sav).subscribe(
      (data)=>{
        this.toDetailRequest();
      }
    );
  }
  toDetailRequest() {
    this.router.navigate(
      ['/customer-dashboard', this.customerId, 'detail' ,'request', this.detailRequest.idRequest],
      {
        queryParamsHandling: 'merge'
      }        
    );
  }

}
