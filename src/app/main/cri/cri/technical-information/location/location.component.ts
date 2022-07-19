import { isNullOrUndefined } from './../../../../../_core/utils/string-utils';
import { FormsService } from './../forms.service';
import { ReferenceDataVO } from './../../../../../_core/models/reference-data-vo';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InterventionWifiLocationVO } from './../../../../../_core/models/cri/intervention-wifi-location-vo';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit , OnChanges {
  @Input() interventionWifiLocation: InterventionWifiLocationVO;
  @Input() index: number;
  @Input() locationWifiTypes: ReferenceDataVO[];
  @Input() wifiConnectionTypes: ReferenceDataVO[];
  @Input() isManadatoryFields;
  @Input() interventionWifiLocationsLength;
  @Output() onRemoveLocation = new EventEmitter<number>();
  @Input() allowedToModifyTechnicalInformationTab;
  form: FormGroup;
  isVisibleAutreField: any;
  isVisibleComment: any;

  refWifiLocationTypeInvalid = false;
  refWifiConnectionTypeInvalid = false;
  isRequired = false;
  @Input() tabchangedOrSave;
  @Input() isVisibleWifiBlock;

  constructor(private readonly formBuilder: FormBuilder, 
              private readonly formsService: FormsService,
              readonly notificationService: NotificationService) { }

  ngOnChanges(change: SimpleChanges){
    if(change['interventionWifiLocation'] && this.interventionWifiLocation){
      this.form = this.buildForm();
      this.formsService.locationForms.push(this.form);
      this.setPoe();
    }
    if(change['locationWifiTypes'] && this.locationWifiTypes && this.form){
      this.setLocationWifiType();
    }
    if(change['wifiConnectionTypes'] && this.wifiConnectionTypes && this.form){
      this.setWifiConnectionType();
    }
    if(change['isManadatoryFields'] && this.isManadatoryFields){
      this.initValidators();
      this.isRequired = true;
      this.formsService.setRestrictionOnFormFields(this.form);
    }
    if(change['isManadatoryFields'] && !this.isManadatoryFields){
      this.initValidators();
      this.isRequired = false;
      this.formsService.clearRestrictionOnFormFields(this.form);
    }
    if(change['tabchangedOrSave']){
      if(this.isVisibleWifiBlock){
        this.initValidators();
        this.validateLocation(this.form);
      } 
    }
    this.setRestrictions();
  }
  
  ngOnInit() {
    this.observeRefWifiLocationType();
    this.observePoe();
    this.observeRefWifiConnectionType();
    this.observeLocation();
    this.setRestrictions();
  }

  setRestrictions(){
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.form.disable();
    }else{
      this.form.enable();
    }
  }
  
  buildForm(): FormGroup {
    return this.formBuilder.group({
      refWifiLocationType: this.formBuilder.control(this.interventionWifiLocation.refWifiLocationType),
      refWifiConnectionType: this.formBuilder.control(this.interventionWifiLocation.refWifiConnectionType),
      locationWifiComment: this.formBuilder.control(this.interventionWifiLocation.locationWifiComment),
      connectionWificomment: this.formBuilder.control(this.interventionWifiLocation.connectionWificomment),
      poeWifiComment: this.formBuilder.control(this.interventionWifiLocation.poeWifiComment),
      isPoe: this.formBuilder.control(this.interventionWifiLocation.isPoe),
      autreEmplacement: this.formBuilder.control(this.interventionWifiLocation.poeWifiComment),
    });
  }

  setLocationWifiType() {
    if(!this.interventionWifiLocation.refWifiLocationType){
      this.form.get('refWifiLocationType').setValue(null);
    }else{
      this.locationWifiTypes.forEach(
        (location)=>{
          if(location.label === this.interventionWifiLocation.refWifiLocationType.label){
            this.form.get('refWifiLocationType').setValue(location);
          }
        }
      );
    }
  }

  setWifiConnectionType() {
    this.formsService.setValueInFormControl(
      this.interventionWifiLocation.refWifiConnectionType,
      'refWifiConnectionType',
      this.wifiConnectionTypes,
      this.form
    )
  }

  removeLocation(){
    this.onRemoveLocation.emit(this.index-1);
  }

  observeRefWifiLocationType() {
    this.form.get('refWifiLocationType').valueChanges.subscribe(
      (emplacement)=> {
        if(emplacement && emplacement.label){
          this.interventionWifiLocation.refWifiLocationType = emplacement;
          this.isVisibleAutreField = emplacement.label.indexOf('Autre') !== -1
        }
      }
    );
  }

  observePoe() {
    this.form.get('isPoe').valueChanges.subscribe(
      (isPoe)=> this.isVisibleComment = isPoe
    );
  }

  observeRefWifiConnectionType() {
    this.form.get('refWifiConnectionType').valueChanges.subscribe(
      (emplacement)=> {
        if(emplacement && emplacement.label){
          this.interventionWifiLocation.refWifiConnectionType = emplacement;
        }
      }
    );
  }
  setPoe() {
    if(isNullOrUndefined(this.interventionWifiLocation.isPoe)){
      this.interventionWifiLocation.isPoe = false;
    }
  }
  observeLocation(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      }
    );
  }

//==============================validation ======================================
validateLocation(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'refWifiLocationType':
            this.refWifiLocationTypeInvalid = true;
          break;
          case 'refWifiConnectionType':
            this.refWifiConnectionTypeInvalid = true;
          break;
          default:
          console.log('valide Location');
           break;}}
      }  
}

initValidators(){
  this.refWifiConnectionTypeInvalid = false;
  this.refWifiLocationTypeInvalid = false;

}
}
