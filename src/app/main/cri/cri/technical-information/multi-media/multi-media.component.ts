import { FormsService } from './../forms.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-multi-media',
  templateUrl: './multi-media.component.html',
  styleUrls: ['./multi-media.component.scss']
})
export class MultiMediaComponent implements OnInit , OnChanges {

  @Input() multimediaInfo: string;
  @Input() isManadatoryFields: string;
  @Input() interventionDetail: any;
  @Input() tabchangedOrSave;
  @Input() isVisibleMultiMediaBlock;
  @Input() allowedToModifyTechnicalInformationTab;
  form: FormGroup;
  multimediaInfoInvalid = false;
  isRequired = false;
  @Output() isMultiMediaValid = new EventEmitter<boolean>();
  constructor(private readonly formBuilder: FormBuilder , 
              private readonly formsService: FormsService,
              private readonly notificationService: NotificationService){
    this.form = this.buildForm();
    this.formsService.multimediaInfoForm.push(this.form);
  }
             

  ngOnChanges(changes: SimpleChanges): void {
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
      if(this.isVisibleMultiMediaBlock){
        this.initValidators();
        this.validateSound(this.form);
      } 
    }
    this.setRestrictions();
  }

  ngOnInit() {
    this.observeMultimedia();
    this.form.valueChanges.subscribe(
      (data)=> console.log(this.interventionDetail)
    );
    this.setRestrictions();
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      multimediaInfo: this.formBuilder.control(this.multimediaInfo)
    });
  }
  
  setRestrictions(){
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.form.disable();
    }else{
      this.form.enable();
    }
  }

  observeMultimedia(){
    this.form.valueChanges.subscribe(
      (value)=> {
        if(this.form.dirty){
          this.notificationService.setIsFromCriAndCriChange(true);
        }
      }
    );
  }
//==============================validation multi ======================================
validateSound(form){ 
  const controls = form.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
        if(name === 'multimediaInfo'){
          this.multimediaInfoInvalid = true;
              this.isMultiMediaValid.emit(true);
          }
          else{  
            this.isMultiMediaValid.emit(false);    
          }
        }
        
       }
}  

initValidators(){
  this.multimediaInfoInvalid = false;
}}