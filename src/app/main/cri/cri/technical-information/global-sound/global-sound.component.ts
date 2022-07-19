import { InterventionSonos } from './../../../../../_core/models/cri/intervention-sonos';
import { FormsService } from './../forms.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-global-sound',
  templateUrl: './global-sound.component.html',
  styleUrls: ['./global-sound.component.scss']
})
export class GlobalSoundComponent implements OnInit, OnChanges {

  @Input() interventionSonos: InterventionSonos;
  @Input() soundTypes;
  @Input() soundConnectionTypes;
  @Input() isManadatoryFields;
  @Input() locationTypes;
  @Input() allowedToModifyTechnicalInformationTab;
  @Output() onRemoveSound = new EventEmitter<number>();
  @Output() onAddSound = new EventEmitter<boolean>();
  form: FormGroup;
  interventionSonosDetails: any;
  showLocationWithComment: any;
  isVisiblePrecesionFiled: boolean;
  @Input() tabchangedOrSave;
  @Input() isVisibleSoundBlock;
  //VALIDATION FIELD
  isTplinkInvalid = false;
  identifiantSonosInvalid = false;
  passwordSonosInvalid = false;
  refTplinkLocationTypeInvalid = false;
  isRequired = false;
//========================================================================================
  constructor(private readonly formBuilder: FormBuilder,
              private readonly formsService: FormsService,
              private readonly notificationService: NotificationService) { }

  ngOnChanges(change: SimpleChanges){
    if(change['interventionSonos'] && this.interventionSonos){
      this.form = this.buildForm();
      this.interventionSonosDetails = this.interventionSonos && this.interventionSonos.interventionSonosDetail ? this.interventionSonos.interventionSonosDetail:[{}];
      this.observeIsTplink();
      this.formsService.globalSoundForms.push(this.form)
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
      console.log('isVisibleSoundBlock ',this.isVisibleSoundBlock)
      if(this.isVisibleSoundBlock){
        this.initValidators();
        this.validateSound(this.form);
      } 
    }
    this.setRestrictions();
  }

  ngOnInit() {
    this.interventionSonosDetails = this.interventionSonos && this.interventionSonos.interventionSonosDetail ? this.interventionSonos.interventionSonosDetail:[{}];
    this.showLocationWithComment = this.interventionSonos.isTplink;
    if(this.showLocationWithComment){
      this.addControls();
      this.setLocationType();
      this.observeLocationType();
      this.initPrecision();
    }
    this.observeGlobalSound();
    this.observeIsTplink();
    this.observeIsTPlink();
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
      isTplink: this.formBuilder.control(this.interventionSonos.isTplink),
      identifiantSonos: this.formBuilder.control(this.interventionSonos.identifiantSonos),
      passwordSonos: this.formBuilder.control(this.interventionSonos.passwordSonos),
      comment: this.formBuilder.control(this.interventionSonos.comment),
    });
  }
  onRemoveSoundEvent(id){
    this.onRemoveSound.emit(id)
  }
  addSound(event){
    event.preventDefault();
    this.onAddSound.emit(true);
    this.interventionSonosDetails = this.interventionSonos.interventionSonosDetail;
  }

  observeGlobalSound(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          console.log('observeGlobalSound');
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      }
    );
  }

  observeIsTplink() {
    this.form.get('isTplink').valueChanges.subscribe(
      (isTplink) => {
        if(isTplink && !this.form.get('refTplinkLocationType')){
          this.addControls();
          this.setLocationType();
          this.observeLocationType();
          this.initPrecision();
          if(this.isManadatoryFields){
            this.formsService.setRestrictionOnFormByField(this.form,'refTplinkLocationType');
            this.validateSound(this.form);
          }
        }
        else{
          if(this.form.get('refTplinkLocationType') && !this.isManadatoryFields){
            this.initValidators();
            this.formsService.clearRestrictionOnFormByField(this.form,'refTplinkLocationType');
            this.refTplinkLocationTypeInvalid = false;
          }
        }
        this.showLocationWithComment = isTplink;
      }
    );
  }
  addControls() {
    this.form.addControl('refTplinkLocationType' , this.formBuilder.control(this.interventionSonos.refTplinkLocationType));
    this.form.addControl('tplinkLocationComment' , this.formBuilder.control(this.interventionSonos.tplinkLocationComment));
  }

  setLocationType() {
    this.formsService.setValueInFormControl(
      this.interventionSonos.refTplinkLocationType,
      'refTplinkLocationType',
      this.locationTypes,
      this.form
    );
  }
  observeLocationType() {
    this.form.get('refTplinkLocationType').valueChanges.subscribe(
      (location)=> {
        this.interventionSonos.refTplinkLocationType = location;
        this.isVisiblePrecesionFiled = location ? location.label.indexOf('Autre') !== -1 : false;
        if(this.isVisiblePrecesionFiled){
          this.form.addControl('autreEmplacement' , this.formBuilder.control(this.interventionSonos.autreEmplacement));
        }
      }
    );
  }
  initPrecision() {
    const ref = this.interventionSonos.refTplinkLocationType;
    if(ref && ref.label.indexOf('Autre') !== -1){
      this.form.addControl('autreEmplacement' , this.formBuilder.control(this.interventionSonos.autreEmplacement));
      this.isVisiblePrecesionFiled = true;
    }
  }
  
  observeIsTPlink() {
    this.form.get('isTplink').valueChanges.subscribe(
      (tpLink)=> {
        console.log('tpLinkk ',tpLink);
        this.interventionSonos.isTplink = tpLink;
      }
  
    );
  }

//==============================validation ======================================
  validateSound(form){ 
    const controls = form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
          switch (name) {
            case 'isTplink':
              this.isTplinkInvalid = true;
            break;
            case 'identifiantSonos':
            this.identifiantSonosInvalid = true;
            break; 
            case 'passwordSonos':
            this.passwordSonosInvalid = true;
            break;
            case 'refTplinkLocationType':
            this.refTplinkLocationTypeInvalid = true;
            break;
            default:
            console.log('valide sound');
            break;}}
        }  
  }
  
  initValidators(){
    this.isTplinkInvalid = false;
    this.identifiantSonosInvalid = false;
    this.passwordSonosInvalid = false;
    this.refTplinkLocationTypeInvalid = false;
  }
}
