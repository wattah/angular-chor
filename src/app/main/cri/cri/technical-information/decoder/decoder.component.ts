import { generateRandomString } from './../../../../../_core/utils/string-utils';
import { FormsService } from './../forms.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReferenceDataVO } from './../../../../../_core/models/reference-data-vo';
import { InterventionTv } from './../../../../../_core/models/cri/intervention-tv';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-decoder',
  templateUrl: './decoder.component.html',
  styleUrls: ['./decoder.component.scss']
})
export class DecoderComponent implements OnInit , OnChanges {
  
  @Input() interventionTv: InterventionTv;
  @Input() connectionTypes: ReferenceDataVO[];
  @Input() decodeurModelTypes: ReferenceDataVO[];
  @Input() locationTypes: ReferenceDataVO[];
  @Input() index;
  @Input() interventionTvsLength: number;
  @Input() isManadatoryFields;
  @Output() onRemoveDecoder = new EventEmitter<number>();
  @Input() allowedToModifyTechnicalInformationTab;
  @Input() tabchangedOrSave;
  @Input() isVisibleDecodorBlock;
  form: FormGroup;
  isVisiblePrecisionField: boolean;
  isCanalRadomName: string;
  isNotCanalRadomName: string;

  //FILED Validation
  refDecoderModelTypeInvalid = false;
  refLocationTypeInvalid = false;
  refConnectionTypeInvalid = false;
  isRequired = false;
  constructor(private readonly formBuilder: FormBuilder , 
              private readonly formService: FormsService,
              private readonly notificationService: NotificationService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['interventionTv'] && this.interventionTv){
      this.form = this.buildFrom();
      this.formService.decodeurForms.push(this.form);
    }
    if(changes['decodeurModelTypes'] && this.decodeurModelTypes){
      this.setDecodeurModelType();
    }
    if(changes['connectionTypes'] && this.connectionTypes){
      this.setConnectionType();
    }
    if(changes['locationTypes'] && this.locationTypes){
      this.setLocationType();
    }
    if(changes['isManadatoryFields'] && this.isManadatoryFields){
      this.initValidators();
      this.isRequired = true;
      this.formService.setRestrictionOnFormFields(this.form);
    }
    if(changes['isManadatoryFields'] && !this.isManadatoryFields){
      this.initValidators();
      this.isRequired = false;
      this.formService.clearRestrictionOnFormFields(this.form);
    }

    if(changes['tabchangedOrSave']){
      if(this.isVisibleDecodorBlock){
        this.initValidators();
        this.validateDecoder(this.form);
      } 
    }
    this.setRestrictions();
  }

  ngOnInit() {
    this.observeRefLocationType();
    this.observeIsCanalPlus();
    this.observeRefDecoderModelType();
    this.observeRefConnectionType();
    this.isCanalRadomName = generateRandomString(5);
    this.isNotCanalRadomName = generateRandomString(5);
    this.observeDecodeur();
    this.setRestrictions();
  }
 
  buildFrom(): FormGroup {
    return this.formBuilder.group({
      refDecoderModelType: this.formBuilder.control(this.interventionTv.refDecoderModelType),
      refLocationType: this.formBuilder.control(this.interventionTv.refLocationType),
      refConnectionType: this.formBuilder.control(this.interventionTv.refConnectionType),
      autreEmplacement: this.formBuilder.control(this.interventionTv.autreEmplacement),
      comment: this.formBuilder.control(this.interventionTv.comment),
      suplementinfo: this.formBuilder.control(this.interventionTv.suplementinfo),
      isCanalPlus: this.formBuilder.control(this.interventionTv.isCanalPlus),
      carteViaccess: this.formBuilder.control(this.interventionTv.carteViaccess)
    });
  }

  setRestrictions(){
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.form.disable();
    }else{
      this.form.enable();
    }
  }

  setLocationType() {
    this.formService.setValueInFormControl(
      this.interventionTv.refLocationType,
      'refLocationType',
      this.locationTypes,
      this.form
    );
    this.observeRefLocationType();
  }
  setConnectionType() {
    this.formService.setValueInFormControl(
      this.interventionTv.refConnectionType,
      'refConnectionType',
      this.connectionTypes,
      this.form
    );
  }
  setDecodeurModelType() {
    this.formService.setValueInFormControl(
      this.interventionTv.refDecoderModelType,
      'refDecoderModelType',
      this.decodeurModelTypes,
      this.form
    );
  }
  removeDecodor(){
    this.onRemoveDecoder.emit(this.index-1);
  }
  observeRefLocationType() {
    this.form.get('refLocationType').valueChanges.subscribe(
      (location)=>{
        if(location && location.label){
          this.interventionTv.refLocationType = location;
          this.isVisiblePrecisionField = location.label.indexOf('Autre') !== -1; 
        }
      }
    );
  }
  observeIsCanalPlus() {
    if(!this.interventionTv.isCanalPlus){
      this.form.get('isCanalPlus').setValue(false);
    }
    this.form.get('isCanalPlus').valueChanges.subscribe(
      (canal)=> {
        this.interventionTv.isCanalPlus = canal;
      }
  
    );
  }

  observeRefConnectionType() {
    this.form.get('refConnectionType').valueChanges.subscribe(
      (connection)=> this.interventionTv.refConnectionType = connection
    );
  }
  observeRefDecoderModelType() {
    this.form.get('refDecoderModelType').valueChanges.subscribe(
      (model)=> this.interventionTv.refDecoderModelType = model
    );
  }
  
  observeDecodeur(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          console.log('observeDecodeur');
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      
      }
    );
  }

//==============================validation ======================================
 validateDecoder(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'refConnectionType':
            this.refConnectionTypeInvalid = true;
          break;
          case 'refDecoderModelType':
            this.refDecoderModelTypeInvalid = true;
          break;
          case 'refLocationType':
            this.refLocationTypeInvalid = true;
          break;
          default:
          console.log('valide decoder');
           break;}}
      }  
}

initValidators(){
  this.refDecoderModelTypeInvalid = false;
  this.refLocationTypeInvalid = false;
  this.refConnectionTypeInvalid = false;
}
}
