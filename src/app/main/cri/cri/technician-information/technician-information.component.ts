import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
  
@Component({
  selector: 'app-technician-information',
  templateUrl: './technician-information.component.html',
  styleUrls: ['./technician-information.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class TechnicianInformationComponent implements OnInit, OnChanges  {
  
  @Input() interventionReport;
  @Input() tabchangedOrSave;
  form: FormGroup;
  technicianForm: FormGroup;
  technicianCommentInvalid = false;
   
  constructor(readonly fb: FormBuilder, public parent: FormGroupDirective) { 
    this.technicianForm  = new   FormGroup({});
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['tabchangedOrSave'] && !changes['tabchangedOrSave'].firstChange  ){
      this.initValidation();
      this.addClassErrorToInValidControls();
    }
  }
  
  
  ngOnInit() : any {
    this.formController();
  }
  formController(): void{
    this.technicianForm = this.parent.form;
    this.technicianForm .addControl('technicianInformation', new FormGroup({
      technicianComment: this.fb.control(null, [Validators.required]),
    }));
  }

  initValidation(){
    this.technicianCommentInvalid = false;
  }
  addClassErrorToInValidControls(){ 
    if ( this.technicianForm.controls.technicianInformation.get('technicianComment').invalid) {
      this.technicianCommentInvalid = true;
    }
  }

}

