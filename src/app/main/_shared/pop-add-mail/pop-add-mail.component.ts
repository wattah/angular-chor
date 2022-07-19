import { Component, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactMethodService} from '../../../_core/services';
import { TYPE_CM_INTERLOCUTOR } from '../../../_core/constants/constants';
import { ContactMethodNew } from '../../../_core/models/interlocutor/crud/contact-methode-new';
import { CM_MEDIA_REF } from '../../../_core/constants/constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedPopupService } from '../shared-popup.service';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { BTN_CANCEL_TEXT, BTN_OK_TEXT, COMMENT,
  ERROR_POPUP, TITLE } from '../../../_core/constants/shared-popup-constant';
import { emailIsValid } from '../../../_core/utils/string-utils';

@Component({
  selector: 'app-pop-add-mail',
  templateUrl: './pop-add-mail.component.html',
  styleUrls: ['./pop-add-mail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopAddMailComponent {

  @Input()
  typeCustomer: string;

  @Input()
  customerId: string;

  @Output()
  resultMail = new EventEmitter();

  MAIL = "mail";
  MESSAGE_SUCCESS = "Email temporaire a bien été enregistrée";
  mailNotValid = false;
  mailFormatNotValid = false;
  form: FormGroup = this.fb.group({
    mail: '',
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly activeModal: NgbActiveModal,
    private readonly contactMethodService: ContactMethodService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly sharedPopupService:SharedPopupService 
    ) {
  }

  annuler(): void {
    this.confirmationDialogService.confirm(TITLE, COMMENT, BTN_OK_TEXT, BTN_CANCEL_TEXT, 'lg',true)
      .then((isConfirmed) => {
        if(isConfirmed) {
          this.activeModal.close(false);
        }
        }).catch(() => console.log(ERROR_POPUP));
  }

  checkMailValid(): void {
    this.mailNotValid = (this.form.get(this.MAIL).value === null || this.form.get(this.MAIL).value === '');
    if(!this.mailNotValid){
      this.validEmailFormat();
    }
  }

  validEmailFormat(){
    this.mailFormatNotValid = !emailIsValid(this.form.get(this.MAIL).value);
  }


  save(): void {
    this.checkMailValid();
    if(!this.mailNotValid && !this.mailFormatNotValid) {
      this.contactMethodService.saveMailTemporary(this.customerId, this.preparedObjetToSave()).subscribe(data => {
        if(data != null) {
          this.resultMail.emit(data);
          this.sharedPopupService.openSnackBar(this.MESSAGE_SUCCESS);
          this.activeModal.close(true);
        }
      },
      (error) => {
        console.log(error)
      })
      }
    }

  preparedObjetToSave(): ContactMethodNew {
    return new ContactMethodNew(null,TYPE_CM_INTERLOCUTOR.TEMPORAIRE.key,this.form.get(this.MAIL).value ,CM_MEDIA_REF.EMAIL, null,false);
  }
}
