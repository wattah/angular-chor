import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentsTitleService, TypeDocumentService } from '../../../_core/services';
import { TypeDocument } from '../../../_core/models/Type-Document';
import { TARGET_TYPE_DOCUMENT } from '../../../_core/constants/constants';
import { DocumentVO } from '../../../_core/models/documentVO';
import { DocumentService } from '../../../_core/services/documents-service';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { BTN_CANCEL_TEXT, BTN_OK_TEXT, COMMENT,
  ERROR_POPUP, LABEL_CLIENT, LABEL_DEMANDE,
  NEW_DOC, QUITTE_POPUP, TITLE, USER_DISMISSED } from '../../../_core/constants/shared-popup-constant';
import { DocumentTitleVO } from '../../../_core/models/document-title-vo';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pop-add-document',
  templateUrl: './pop-add-document.component.html',
  styleUrls: ['./pop-add-document.component.scss']
})
export class PopAddDocumentComponent implements OnInit {

  @Input() customerId: string;
  @Input() documentsTitle: DocumentTitleVO[];
  @Input() request: RequestCustomerVO;
  @Output() documentsToSend: EventEmitter<DocumentVO[]> = new EventEmitter<DocumentVO[]>();
  selectedDocument: string;
  labelDocument: string;
  documentList: DocumentVO[] = {} as DocumentVO[];
  listFile: DocumentVO[] = [] as DocumentVO[] ;
  isNotExistDocument: boolean;
  files: File[] = [];
  documentsTypeList: TypeDocument[] = [];
  listFilesNamesSelected: string[] = []
  form: FormGroup = this.fb.group({
    documentType: null,
    doc: '',
    document: null,
    file: null,
    titleDoc: null
  });
  CONTROLE_DOCUMENT = 'document';
  CONTROLE_DOC = 'doc';
  CONTROLE_DOCUMENT_TYPE = 'documentType';
  CONTROLE_FILE = 'file';
  CONROLE_TITLE_DOC = 'titleDoc';
  newDoc = NEW_DOC;
  FORMAT_DATE_AFFICHE = 'dd/MM/yyyy';
  FORMAT_DATE_TO_SAVE = 'MM/dd/yyyy';
  MESSAGE_ERROR_FILE_EXIST = "le ou les document(s) que vous souhaitez ajouter n'existent pas sur le serveur : ";
  
  sourceNotValid = false;
  documentNotValid = false;
  titleNotValid = false;
  typeNotValid = false;
  fileNotValid = false;
  formNotValid = false;

  constructor(private readonly documentService: DocumentService,
    private readonly fb: FormBuilder,
    private readonly datePipe: DatePipe,
    private readonly activeModal: NgbActiveModal,
    private readonly typeDocumentService: TypeDocumentService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly documentTitleService:DocumentsTitleService) { }

  ngOnInit() {
    this.typeDocumentService.getDocumentsTypeDocs().subscribe(data => {
      this.documentsTypeList = data;
    });
    this.documentTitleService.getAllTitleDocs().subscribe(data => {
      this.documentsTitle = data;
    });
    this.files = [];
    this.listFile = [];
    this.listFilesNamesSelected = [];
  }

  save() {
    this.formNotValid = this.checkFormIsValid();
    if(!this.formNotValid) {
      if(NEW_DOC === this.selectedDocument) {
        this.saveWithNewDoc();
      } else {
        this.saveWithDocExist();
      }
    }
  }

  saveWithNewDoc(): void {
    const type: string = this.form.get(this.CONTROLE_DOCUMENT_TYPE).value.documentTypeName;
    const typeId: string = this.form.get(this.CONTROLE_DOCUMENT_TYPE).value.id;
    const title: string = this.form.get(this.CONROLE_TITLE_DOC).value.documentTitle;
    const titleId: string = this.form.get(this.CONROLE_TITLE_DOC).value.id; 
    const dateCreation: string = this.datePipe.transform(new Date(), this.FORMAT_DATE_TO_SAVE);
    this.documentService.saveDocumentWithListFiles(titleId,type,title,typeId,this.files,this.customerId,dateCreation).subscribe(docs => {
         this.documentsToSend.emit(docs);
         this.activeModal.close(true);
    })
  }

  saveWithDocExist(): void {
    this.documentService.checkIsExisteFileByListNames(this.customerId,this.listFilesNamesSelected).subscribe(names => {
      if(!isNullOrUndefined(names) && names.length !== 0 ) {
        let title = `${this.MESSAGE_ERROR_FILE_EXIST} <br/>`;
        for(const name of names) {
          this.listFile.forEach(file => {
            if(file.fileName === name) {
                title = title + `${this.datePipe.transform(file.addDate, this.FORMAT_DATE_AFFICHE)} - ${file.titreDocument} <br/>`;
            }
        }); 
       }
       this.openPopupError(title);
      } else {
        this.documentsToSend.emit(this.listFile);
        this.activeModal.close(true);
      }
    })
  }

  checkFormIsValid(): boolean {
    this.initForm();
    if(this.form.get(this.CONTROLE_DOC).value === '') {
      this.sourceNotValid = true;
    }
    if( NEW_DOC !== this.selectedDocument && this.listFile.length === 0) {
      this.documentNotValid = true;
    }
    if(NEW_DOC === this.selectedDocument) {
      if(isNullOrUndefined(this.form.get(this.CONTROLE_DOCUMENT_TYPE).value)) {
        this.typeNotValid = true;
      }
      if(isNullOrUndefined(this.form.get(this.CONROLE_TITLE_DOC).value)) {
        this.titleNotValid = true;
      }
      if(isNullOrUndefined(this.files) || this.files.length === 0) {
        this.fileNotValid = true;
      }
    }
    return this.sourceNotValid || this.documentNotValid ||
           this.typeNotValid || this.titleNotValid ||
           this.fileNotValid;
  }

  initForm(): void {
    this.sourceNotValid = false;
    this.documentNotValid = false;
    this.typeNotValid = false;
    this.titleNotValid = false;
    this.fileNotValid = false;
    this.formNotValid = false;
  }

  onDocumentChange(event: any): void {
    let targetId = this.customerId;
      if ( event.target.value !== '') {
        this.setLabelDocument(event.target.value);
      }
      if (this.selectedDocument !== '' && this.selectedDocument !== NEW_DOC ) {
        targetId = (this.selectedDocument === TARGET_TYPE_DOCUMENT.REQUEST ? this.request.idRequest.toString() : targetId);
        this.documentService.getDocumentFullByTargetType( targetId, this.selectedDocument).subscribe(listDoc => {
          if (listDoc === null || listDoc.length === 0) {
            this.isNotExistDocument = true;
          } else {
            this.isNotExistDocument = false;
          }
          this.documentList = listDoc;
        });
        this.listFilesNamesSelected = [];
        this.listFile = [];
      } else {
        this.documentList = [];
      }
   }

   setLabelDocument(value: string): void {
    this.selectedDocument = value;
      if (this.selectedDocument === TARGET_TYPE_DOCUMENT.CUSTOMER) {
        this.labelDocument = LABEL_CLIENT;
      } else if (this.selectedDocument === TARGET_TYPE_DOCUMENT.REQUEST) {
        this.labelDocument = LABEL_DEMANDE;
      }
    }
   onCheckboxChagenDocument(event: any): void {
    this.listFile = event.value;
    this.listFilesNamesSelected = [];
    for(const fileSelected of this.listFile) {
        this.listFilesNamesSelected.push(fileSelected.fileName);
    }
  }

  destroyPopUpWithConfirmation(): void {
    this.confirmationDialogService.confirm(TITLE, COMMENT, BTN_OK_TEXT, BTN_CANCEL_TEXT, 'lg',true)
      .then((isConfirmed) => {
        if(isConfirmed) {
          this.activeModal.close(false);
        }
        }).catch(() => console.log(ERROR_POPUP));
  }

  onSelect(event: any): void {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any): void {
    this.files.splice(this.files.indexOf(event), 1);
  }

  openPopupError(message: string): any {
    const TITLE_ERROR = 'Erreur';
    const OK_TEXT = 'OK';
    this.confirmationDialogService.confirm(TITLE_ERROR, message, OK_TEXT,null,'lg', false)
    .then((confirmed) => { if(confirmed) {
      console.log(QUITTE_POPUP)
    }})
    .catch(() => console.log(USER_DISMISSED));
  }

}
