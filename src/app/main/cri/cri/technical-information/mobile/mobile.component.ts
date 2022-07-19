import { FormsService } from './../forms.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit , OnChanges {
  @Input() interventionMobile;
  @Input() isManadatoryFields;
  @Input() impactParkItemLines;
  @Input() allowedToModifyTechnicalInformationTab;
  @Input() tabchangedOrSave;
  @Input() isVisibleMobileBlock;
  form: FormGroup
  //VALIDATION FIELD
  marqueInvalid = false;
  modeleInvalid = false;
  capaciteInvalid = false;
  couleurInvalid = false;
  numImeiInvalid = false;
  origineInvalid = false;
  isRequired = false;
  constructor(private readonly formBuilder: FormBuilder ,
              private readonly formsService: FormsService,
              readonly notificationService: NotificationService){ }

  ngOnChanges(change: SimpleChanges){
    if(change['interventionMobile'] && this.interventionMobile){
      this.form = this.buildForm();
      this.setOrigineValue();
      this.impactParkItemLine();
      this.formsService.formMobile.push(this.form);
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
      console.log('isVisibleLandLineBlock ',this.isVisibleMobileBlock)
      if(this.isVisibleMobileBlock){
        this.initValidators();
        this.validateMobile(this.form);
      } 
    }
    this.setRestrictions();
  }

  ngOnInit() {
    this.setOrigineValue();
    this.impactParkItemLine();
    this.observeImpactParkItemLine();
    this.observeIsAssurance();
    this.observeMobile();
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
      marque: this.formBuilder.control(this.interventionMobile.marque),
      modele: this.formBuilder.control(this.interventionMobile.modele),
      capacite: this.formBuilder.control(this.interventionMobile.capacite),
      couleur: this.formBuilder.control(this.interventionMobile.couleur),
      numImei: this.formBuilder.control(this.interventionMobile.numImei),
      comment: this.formBuilder.control(this.interventionMobile.comment),
      otherLine: this.formBuilder.control(this.interventionMobile.otherLine),
      impactedLineId: this.formBuilder.control(this.interventionMobile.impactedLineId),
      isAssurance: this.formBuilder.control(this.interventionMobile.isAssurance),
      isRenouvellement: this.formBuilder.control(this.interventionMobile.isRenouvellement),
      isSav: this.formBuilder.control(this.interventionMobile.isSav),
    });
  }

  setOrigineValue() {
    if(this.interventionMobile.isAssurance){
      this.form.get('isAssurance').setValue('isAssurance');
    }
    if(this.interventionMobile.isRenouvellement){
      this.form.get('isAssurance').setValue('isRenouvellement');
    }
    if(this.interventionMobile.isSav){
      this.form.get('isAssurance').setValue('isSav');
    }
    if(!this.interventionMobile.isSav
      && !this.interventionMobile.isRenouvellement
      && !this.interventionMobile.isAssurance){
      this.form.get('isAssurance').setValue('isRenouvellement');
    }
  }
  impactParkItemLine() {
    if(!this.interventionMobile.impactedLineId){
      this.form.get('impactedLineId').setValue(null);
    }else{
      this.impactParkItemLines.forEach(
        (line)=>{
          if(line.id === this.interventionMobile.impactedLineId){
            this.form.get('impactedLineId').setValue(line);
          }
        }
      );
    }
  }

  observeImpactParkItemLine() {
    this.form.get('impactedLineId').valueChanges.subscribe(
      (line)=>{
        if(line){
          this.interventionMobile.impactedLineId = line.id
        }
      });
  }

  observeIsAssurance() {
    this.form.get('isAssurance').valueChanges.subscribe(
      (value)=>{
        switch(value){
          case 'isAssurance':
            this.interventionMobile.isAssurance = true;
            this.interventionMobile.isRenouvellement = false;
            this.interventionMobile.isSav = false;
          break;
          case 'isRenouvellement':
            this.interventionMobile.isAssurance = false;
            this.interventionMobile.isRenouvellement = true;
            this.interventionMobile.isSav = false;
          break;
          case 'isSav':
            this.interventionMobile.isAssurance = false;
            this.interventionMobile.isRenouvellement = false;
            this.interventionMobile.isSav = true;
          break;
        }
      }
    )
  }

  observeMobile(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          console.log('observeMobile');
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      }
    );
  }

//==============================validation ======================================
 validateMobile(form){ 
  const controls = form.controls;
  let isAssurance = false;
  let isRenouvellement = false;
  let isSav = false;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'marque':
            this.marqueInvalid = true;
          break;
          case 'couleur':
            this.couleurInvalid = true;
          break;
          case 'numImei':
            this.numImeiInvalid = true;
          break;
          case 'capacite':
            this.capaciteInvalid = true;
          break;
          case 'modele':
            this.modeleInvalid = true;
          break;
          case 'isAssurance':
            isAssurance = true;
          break;
          case 'isRenouvellement':
            isRenouvellement = true;
          break;
          case 'isSav':
            isSav = true;
          break;
          default:
          console.log('valide Mobile');
           break;}}
      }  
  if(isAssurance && isSav && isRenouvellement){
    this.origineInvalid = true;
  }

}

initValidators(){
  this.marqueInvalid = false;
  this.modeleInvalid = false;
  this.capaciteInvalid = false;
  this.couleurInvalid = false;
  this.numImeiInvalid = false;
  this.origineInvalid = false;
}
}
