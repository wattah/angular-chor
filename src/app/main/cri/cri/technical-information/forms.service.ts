import { ReferenceDataVO } from './../../../../_core/models/reference-data-vo';
import { Validators, FormGroup } from '@angular/forms';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class FormsService{
  
    opticalFiberForms: FormGroup[] = [];
    adslVdslForms: FormGroup[] = [];
    landLineForms: FormGroup[] = [];
    formMobile : FormGroup [] = [];
    decodeurForms : FormGroup [] = [];
    globalSoundForms  : FormGroup [] = [];
    nasForms  : FormGroup [] = [];
    usersNas : FormGroup [] = [];
    wifiForms  : FormGroup [] = [];
    femetocellForms : FormGroup [] = [];
    soundForms : FormGroup [] = [];
    multimediaInfoForm  : FormGroup [] = [];
    accessPointsForms : FormGroup [] = [];
    locationForms : FormGroup [] = [];

    setRestrictionOnFormFields(form) {
      
        Object.keys(form.controls).forEach(key => {
          form.controls[key].setValidators([Validators.required]);
          form.controls[key].updateValueAndValidity();
        });
    
      }
    
    clearRestrictionOnFormFields(form) {
        Object.keys(form.controls).forEach(key => {
          form.controls[key].clearValidators();
          form.controls[key].updateValueAndValidity();
        });
      //  console.log('form ' , form)
    }

    setValueInFormControl(ref: ReferenceDataVO, control: string, refs: ReferenceDataVO[] , form) {
        if(!ref){
            form.get(control).setValue(null);
          }else{
            refs.forEach(
              (r)=>{
                if(r.label === ref.label){
                  form.get(control).setValue(r);
                }
              }
            );
        }
    }

    
    setRestrictionOnFormByField(form,key) {
      form.controls[key].setValidators([Validators.required]);
      form.controls[key].updateValueAndValidity();
  }


  clearRestrictionOnFormByField(form,key) {
      form.controls[key].clearValidators();
      form.controls[key].updateValueAndValidity();
}
}
