import { FormsService } from './../forms.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InterventionFemtocell } from './../../../../../_core/models/cri/intervention-femtocell';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-femtocell',
  templateUrl: './femtocell.component.html',
  styleUrls: ['./femtocell.component.scss']
})
export class FemtocellComponent implements OnInit , OnChanges {
  
  @Input() index: number;
  @Input() interventionFemtocell: InterventionFemtocell;
  @Input() impactParkItemLines;
  @Input() interventionFemtocellsLength: number;
  @Input() isManadatoryFields: boolean;
  @Input() allowedToModifyTechnicalInformationTab;
  @Output() onRemoveFemtocell = new EventEmitter<number>();
  form: FormGroup
  @Input() tabchangedOrSave;
  @Input() isVisibleFemtocellBlock;
  // VALIDATION FIELD
  numImeiInvalid = false;
  otherNumbersTitulaireInvalid = false;
  emplacementFemtocellInvalid = false;
  isRequired = false;
  constructor(private readonly formBuilder: FormBuilder , 
              private readonly formsService: FormsService,
              private readonly notificationService: NotificationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['interventionFemtocell'] && this.interventionFemtocell){
      this.form = this.buildForm();
      this.formsService.femetocellForms.push(this.form);
      this.setNbTitulaire();
    }
    if(changes['impactParkItemLines'] && this.impactParkItemLines){
      this.impactParkItemLine();
    }
    if(changes['isManadatoryFields'] && this.isManadatoryFields){
      this.initValidators();
      this.isRequired = true;
      this.formsService.setRestrictionOnFormFields(this.form);
    }
    if(changes['isManadatoryFields'] && !this.isManadatoryFields){
      this.initValidators();
      this.isRequired = false;
      this.formsService.clearRestrictionOnFormFields(this.form);
    }
  
    if(changes['tabchangedOrSave']){
      if(this.isVisibleFemtocellBlock){
        this.initValidators();
        this.validateFemTocell(this.form);
      } 
    }
    this.setRestrictions();
  }

  ngOnInit() {
    this.observeOtherNumbersTitulaire();
    this.observeImpactedLineId();
    this.observeFemtocell();
    this.setRestrictions();
  }

  buildForm(){
    return this.formBuilder.group({
      numImei: this.formBuilder.control(this.interventionFemtocell.numImei),
      otherNumbersTitulaire: this.formBuilder.control(null),
      emplacementFemtocell: this.formBuilder.control(this.interventionFemtocell.emplacementFemtocell),
      comment: this.formBuilder.control(this.interventionFemtocell.comment),
      impactedLineId: this.formBuilder.control(this.interventionFemtocell.impactedLineId),
      otherLine: this.formBuilder.control(this.interventionFemtocell.otherLine),
    });
  } 

  setRestrictions(){
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.form.disable();
    }else{
      this.form.enable();
    }
  }
  
  setNbTitulaire() {
    if(this.interventionFemtocell.otherNumbersTitulaire && this.interventionFemtocell.otherNumbersTitulaire.length !== 0){
      this.form.get('otherNumbersTitulaire').setValue(this.interventionFemtocell.otherNumbersTitulaire[0]);
    }
  }

  observeImpactedLineId() {
    this.form.get('impactedLineId').valueChanges.subscribe(
      (line)=>{
        if(line){
          this.interventionFemtocell.impactedLineId = line.id
        }
    });
  }
  observeOtherNumbersTitulaire() {
    this.form.get('otherNumbersTitulaire').valueChanges.subscribe(
      (number)=>{
        if(number){
          this.interventionFemtocell.otherNumbersTitulaire = [number]
        }
    });
  }

  impactParkItemLine() {
    if(!this.interventionFemtocell.impactedLineId){
      this.form.get('impactedLineId').setValue(null);
    }else{
      this.impactParkItemLines.forEach(
        (line)=>{
          if(line.id === this.interventionFemtocell.impactedLineId){
            this.form.get('impactedLineId').setValue(line);
          }
        }
      );
    }
  }

  removeFemtocell(){
    this.onRemoveFemtocell.emit(this.index-1);
  }

  observeFemtocell(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      }
    );
  }

//==============================validation ======================================
  validateFemTocell(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'numImei':
            this.numImeiInvalid = true;
          break;
          case 'otherNumbersTitulaire':
            this.otherNumbersTitulaireInvalid = true;
          break;
          case 'emplacementFemtocell':
            this.emplacementFemtocellInvalid = true;
          break;
          default:
          console.log('valide Femtocell');
           break;}}
      }  
}

initValidators(){
  this.numImeiInvalid = false;
  this.otherNumbersTitulaireInvalid = false;
  this.emplacementFemtocellInvalid = false;
}
}
