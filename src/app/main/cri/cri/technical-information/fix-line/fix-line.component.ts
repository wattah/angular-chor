import { FormsService } from './../forms.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InterventionLandLine } from './../../../../../_core/models/cri/intervention-landline';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-fix-line',
  templateUrl: './fix-line.component.html',
  styleUrls: ['./fix-line.component.scss']
})
export class FixLineComponent implements OnInit , OnChanges {
  @Input() index: number;
  @Input() interventionLandLine: InterventionLandLine;
  @Input() interventionLandLinesLength: number;
  @Input() isManadatoryFields: boolean;
  @Input() allowedToModifyTechnicalInformationTab;
  @Output() onRemoveLandLine = new EventEmitter<number>();
  @Input() tabchangedOrSave;
  @Input() isVisibleLandLineBlock;
  form: FormGroup;
  //
  ndInvalid = false;
  dtiLocationInvalid = false;
  suplementInfoInvalid = false;
  isRequired = false;
  constructor(private readonly formBuilder: FormBuilder ,
              private readonly formsService: FormsService,
              private readonly notificationService: NotificationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['interventionLandLine'] && this.interventionLandLine){
      this.form = this.buildForm();
      this.formsService.landLineForms.push(this.form);
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
      console.log('isVisibleLandLineBlock ',this.isVisibleLandLineBlock)
      if(this.isVisibleLandLineBlock){
        this.initValidators();
        this.validateLandLine(this.form);
      } 
    }
    this.setRestrictions();
  }
  
  ngOnInit() {
    this.observeLandLine();
    this.setRestrictions();
  }
  
  buildForm(): FormGroup {
    return this.formBuilder.group({
      nd: this.formBuilder.control(this.interventionLandLine.nd),
      dtiLocation: this.formBuilder.control(this.interventionLandLine.dtiLocation),
      sucloc: this.formBuilder.control(this.interventionLandLine.sucloc),
      suplementInfo: this.formBuilder.control(this.interventionLandLine.suplementInfo),
      comment: this.formBuilder.control(this.interventionLandLine.comment),
    });
  }

  setRestrictions(){
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.form.disable();
    }else{
      this.form.enable();
    }
  }

  removeLandLine(){
    this.onRemoveLandLine.emit(this.index-1);
  }

observeLandLine(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          console.log('observeLandLine');
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      }
    );
  }

 //==============================validation ======================================
 validateLandLine(form){ 
    const controls = form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
          switch (name) {
            case 'nd':
              this.ndInvalid = true;
            break;
            case 'dtiLocation':
              this.dtiLocationInvalid = true;
            break;
            case 'suplementInfo':
              this.suplementInfoInvalid = true;
            break;
     
            default:
            console.log('valide Ligne Fixe');
             break;}}
        }  
  }
  
  initValidators(){
    this.ndInvalid = false;
    this.dtiLocationInvalid = false;
    this.suplementInfoInvalid = false;
  }
}
