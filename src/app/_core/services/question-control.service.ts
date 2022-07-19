import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FormFieldVO } from '../models/FormFieldVO';
import { ProcessDefinitionVO } from '../models/ProcessDefinitionVO';

@Injectable({
    providedIn: 'root'
})
export class QuestionControlService{

    constructor(){}

    toFormGroup(questions: FormFieldVO[]){
        let group: any = {}
        questions.forEach(question => {
            if(question.typeName == "Boolean"){
                group[question.id] =  new FormControl(question.value.value || '');
            }else if (question.typeName == "String"){
                group[question.id] =  new FormControl(question.value.value || '' , Validators.required);
            }
            else if(question.typeName == "enum"){
                group[question.id] =  new FormControl(question.value.value || '');
            }
            else{
                group[question.id] =  new FormControl(question.value.value || '');
            }
        });
        return new FormGroup(group);
    }

    toFormGroupProcess(processes: ProcessDefinitionVO[]){
        let group: any = {}
        processes.forEach(process => {
            group[process.name] = new FormControl(process.id || '');
        });
        return new FormGroup(group);
    }
}