import { AbstractControl, FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';


export abstract class BaseForm {

    clearAutoCompleteInputControl(formControl: FormControl | AbstractControl, autoCompleteTrigger: MatAutocompleteTrigger, defaultValue = null): void {
        formControl.setValue(defaultValue);
        formControl.updateValueAndValidity();
        autoCompleteTrigger.openPanel();
    }

}
