import { FormGroup } from '@angular/forms';
import { HostListener, Directive } from '@angular/core';

@Directive()
export abstract class ComponentCanDeactivate {
 
  abstract get form(): FormGroup;
  abstract get submitted(): boolean;
  canceled: boolean;

  message;
  btnOkText;
  btnCancelText;

  constructor() {
    this.initializeTextPopUp();
  }

  canDeactivate(): boolean | Promise<boolean> {
    console.log(this.canceled, this.form);
    if (this.canceled || !this.form) { 
      this.canceled = false; 
      return true; 
    }
    return !this.submitted && this.form.dirty;
  }

  @HostListener('window:beforeunload', ['$event'])
  onbeforeunload(event: any ): void {
    event.preventDefault();
    event.returnValue = true;
  }

  doSomethingBeforeLeavePage(): void {}

  initializeTextPopUp(): void {
    this.message = 'Êtes-vous sûr de vouloir annuler votre saisie ?';
    this.btnOkText = 'Oui';
    this.btnCancelText = 'Non';
  }
 
}
