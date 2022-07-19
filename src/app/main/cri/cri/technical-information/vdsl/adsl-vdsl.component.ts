import { FormsService } from './../forms.service';
import { InterventionAdsl } from './../../../../../_core/models/cri/intervention-adsl';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-adsl-vdsl',
  templateUrl: './adsl-vdsl.component.html',
  styleUrls: ['./adsl-vdsl.component.scss']
})
export class AdslVdslComponent implements OnInit , OnChanges {
  @Input() index;
  @Input() interventionAdsl: InterventionAdsl;
  @Input() locationTypes;
  @Input() isManadatoryFields;
  @Input() interventionsAdslLength;
  @Input() allowedToModifyTechnicalInformationTab;
  @Output() onRemoveIntervetionAdsl = new EventEmitter<number>();
  form: FormGroup;
  isVisiblePrecisionRefLocationType: boolean;
  @Input() tabchangedOrSave;
  @Input() isVisibleAdslBlock;
  //=====FIELD VALIDATION
  aidInvalid = false;
  identifiantConnexionInvalid = false;
  refLocationTypeInvalid = false;
  ndVoipInvalid = false;
  passwordConnexionInvalid = false;
  isRequired = false;
  constructor(private readonly formBuilder: FormBuilder ,
              private readonly formsService: FormsService,
              private readonly notificationService: NotificationService) { }
 
  ngOnChanges(change: SimpleChanges){
    if(change['interventionAdsl'] && this.interventionAdsl){
      this.form = this.buildForm();
      this.formsService.adslVdslForms.push(this.form);
    }
    if(change['locationTypes'] && this.locationTypes && this.form){
      this.setLocationType();
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
      console.log('isVisibleAdslBlock ',this.isVisibleAdslBlock)
      if(this.isVisibleAdslBlock){
        this.initValidators();
        this.validateAdslVdsl(this.form);
      } 
    }
    this.setRestrictions();
  }

  ngOnInit() {
    this.observeRefLocationType();
    this.observeADSL();
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
      aid: this.formBuilder.control(this.interventionAdsl.aid),
      identifiantConnexion: this.formBuilder.control(this.interventionAdsl.identifiantConnexion),
      refLocationType: this.formBuilder.control(this.interventionAdsl.refLocationType),
      autreEmplacement: this.formBuilder.control(this.interventionAdsl.autreEmplacement),
      ndVoip: this.formBuilder.control(this.interventionAdsl.ndVoip),
      passwordConnexion: this.formBuilder.control(this.interventionAdsl.passwordConnexion),
      sucloc: this.formBuilder.control(this.interventionAdsl.sucloc),
      isOffrePro: this.formBuilder.control(this.interventionAdsl.isOffrePro),
      comment: this.formBuilder.control(this.interventionAdsl.comment),
    });
  }
  
  setLocationType() {
    this.formsService.setValueInFormControl(
      this.interventionAdsl.refLocationType,
      'refLocationType',
      this.locationTypes,
      this.form
    );
    this.observeRefLocationType();
  }
  removeInterventionAdsl(){
    this.onRemoveIntervetionAdsl.emit(this.index-1);
  }

  observeRefLocationType() {
    this.form.get('refLocationType').valueChanges.subscribe(
      (location)=> {
        if(location && location.label){
          this.interventionAdsl.refLocationType = location;
          this.isVisiblePrecisionRefLocationType = location.label.indexOf('Autre') !== -1
        }
      }
    );
  }
  
  observeADSL(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      
      }
    );
  }

//==============================validation ======================================
  validateAdslVdsl(form){ 
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
          switch (name) {
            case 'aid':
              this.aidInvalid = true;
            break;
            case 'identifiantConnexion':
              this.identifiantConnexionInvalid = true;
            break;
            case 'ndVoip':
              this.ndVoipInvalid = true;
            break; 
            case 'passwordConnexion':
            this.passwordConnexionInvalid = true;
            break; 
            case 'refLocationType':
            this.refLocationTypeInvalid = true;
            break;
            default:
            console.log('valide fibre');
             break;}}
        }
        console.log('invalid in ADSL == ',invalid);   
  }
  
  initValidators(){
    this.aidInvalid = false;
    this.identifiantConnexionInvalid = false;
    this.refLocationTypeInvalid = false;
    this.ndVoipInvalid = false;
    this.passwordConnexionInvalid = false
  }
}
