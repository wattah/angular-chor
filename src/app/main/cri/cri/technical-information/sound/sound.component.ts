import { FormsService } from './../forms.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-sound',
  templateUrl: './sound.component.html',
  styleUrls: ['./sound.component.scss']
})
export class SoundComponent implements OnInit , OnChanges {

  @Input() interventionSonosDetail;
  @Input() soundTypes;
  @Input() soundConnectionTypes;
  @Input() index;
  @Input() isManadatoryFields;
  @Input() interventionSonosDetailsLength;
  @Input() allowedToModifyTechnicalInformationTab;
  @Output() onRemoveSound = new EventEmitter<number>();
  @Input() tabchangedOrSave;
  @Input() isVisibleSoundBlock;
  refSonosTypeInvalid = false;
  refSonosConnectionTypeInvalid = false;
  isRequired = false;
  form: FormGroup

  constructor(private readonly formBuilder: FormBuilder, 
              private readonly formsService: FormsService,
              private readonly notificationService: NotificationService) { }

  ngOnChanges(change: SimpleChanges){
    if(change['interventionSonosDetail'] && this.interventionSonosDetail){
      this.form = this.buildForm();
      this.formsService.soundForms.push(this.form);
    }
    if(change['soundTypes'] && this.soundTypes){
      this.setSoundType();
    }
    if(change['soundConnectionTypes'] && this.soundConnectionTypes){
      this.setSoundConnectionType();
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
      if(this.isVisibleSoundBlock){
        this.initValidators();
        this.validateSound(this.form);
      } 
    }
    this.setRestrictions();
  }

  ngOnInit() {
    this.observeRefSonosType();
    this.observeRefSonosConnectionType();
    this.observeSound();
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
      refSonosType: this.formBuilder.control(this.interventionSonosDetail.refSonosType),
      refSonosConnectionType:this.formBuilder.control(this.interventionSonosDetail.refSonosConnectionType),
      complementInfo:this.formBuilder.control(this.interventionSonosDetail.complementInfo),
      adresseIp:this.formBuilder.control(this.interventionSonosDetail.adresseIp),
    });
  }

  setSoundType() {
    this.formsService.setValueInFormControl(
      this.interventionSonosDetail.refSonosType,
      'refSonosType',
      this.soundTypes,
      this.form
    );
  }

  setSoundConnectionType() {
    this.formsService.setValueInFormControl(
      this.interventionSonosDetail.refSonosConnectionType,
      'refSonosConnectionType',
      this.soundConnectionTypes,
      this.form
    );
  }

removeSound(){
  this.onRemoveSound.emit(this.index-1)
}

observeRefSonosConnectionType() {
  this.form.get('refSonosType').valueChanges.subscribe(
    (type)=>{
      this.interventionSonosDetail.refSonosType = type;
    }
  );
}
observeRefSonosType() {
  this.form.get('refSonosConnectionType').valueChanges.subscribe(
    (type)=>{
      this.interventionSonosDetail.refSonosConnectionType = type;
    }
  );
}

observeSound(){
  this.form.valueChanges.subscribe(
    (value)=> {
      if(this.form.dirty){
        console.log('observeSound 2');
        this.notificationService.setIsFromCriAndCriChange(true);
      }
    }
  );
}

//==============================validation Sound ======================================
validateSound(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'refSonosType':
            this.refSonosTypeInvalid = true;
          break;
          case 'refSonosConnectionType':
          this.refSonosConnectionTypeInvalid = true;
          break; 
          default:
          console.log('valide sound');
          break;}}
      }  
}

initValidators(){
  this.refSonosTypeInvalid = false;
  this.refSonosConnectionTypeInvalid = false;
}
}
