import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { DocumentTitleVO } from '../../../../_core/models/document-title-vo';
import { DocumentVO } from '../../../../_core/models/documentVO';
import { DocumentTypeVO } from '../../../../_core/models/models';
import { InterventionReportService } from '../../../../_core/services/intervention-report.service';
import { DocumentService } from '../../../../_core/services/documents-service';
import { TARGET_TYPE_DOCUMENT, CONSTANTS } from '../../../../_core/constants/constants';
import { FileUploadVO } from '../../../../_core/models/file-upload-vo';
import { AuthTokenService } from '../../../../_core/services/auth_token';
import { ApplicationUserVO } from '../../../../_core/models/application-user';
import { formatNumber } from '../../../../_core/utils/functions-utils';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { InterventionReportVO } from '../../../../_core/models/cri/intervention-report-vo';
import { ConfirmationDialogService } from './../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit,OnChanges {
  
  @Input() interventionReport: InterventionReportVO;
  @Input() allowedToModifyTechnicalInformationTab;

  taskId: number;
  requestId: number;
  interventionId: number;
  connectedUser: ApplicationUserVO = {} as ApplicationUserVO;
  ListCriDocuments: DocumentVO[];
  extension: any;

  files: File[] = [];
  documentsTitleList: DocumentTitleVO[] = [];
  documentsTypeList: DocumentTypeVO[] = [];
  documentsTitleByType: DocumentTitleVO[] = [];

  ListOfAddedCriDocument: DocumentVO[] = [];
  addedCriDocument: DocumentVO = {} as DocumentVO;
  responseDocument: DocumentVO = {} as DocumentVO;
  fileToUpload: FileUploadVO = {} as FileUploadVO;

  showDocuments: boolean;

  addCriDocumentForm: FormGroup;
  isTypeValid = true;
  isTitleValid = true;
  isFileValid = true;
  @Output() isFromCriAndCriChangeOut = new EventEmitter<boolean>();
  @Input() isCancel;

  MESSAGE_ERREUR_TAILLE__FICHIER_DEPASSE_10_MO = 'Erreur Serveur : la taille du fichier chargé dépasse 10Mo';
  MESSAGE_ERREUR_CHEMIN_INTROUVABLE = 'Erreur technique: le chemin d’accès spécifié est introuvable';
  ERREUR_SERVER_UPLOAD_DOCUMENT = 'Erreur';

  CONTENT_TYPE = 'Content-Type';
  TYPE_OCTET_STREAM = 'application/octet-stream';
  BLANK = '_blank';

//================================Constructeur======================================
  constructor(private readonly _snackBar: MatSnackBar, private readonly fb: FormBuilder, readonly route: ActivatedRoute,
     readonly interventionService: InterventionReportService, readonly authTokenService: AuthTokenService,
      readonly datePipe: DatePipe, readonly documentService: DocumentService,
      public parentCRIForm: FormGroupDirective, readonly confirmationDialogService: ConfirmationDialogService,) { }

  createFormGroup(): FormGroup {
    return this.fb.group({
      documentType: this.fb.control(null, [Validators.required]),
      documentTitle: this.fb.control(null, [Validators.required]),
      file: this.fb.control(null, [Validators.required])
    });
  }
    
  ngOnChanges(change: SimpleChanges){
    if(this.addCriDocumentForm){
      this.setRestrictions();
    }
    if(change['isCancel']
    && !change['isCancel'].firstChange){
          console.log('cancel  document');
          this.initDocument();
          if ( this.ListOfAddedCriDocument.length > 0 ) {
            this.showDocuments = true;
          } else {
            this.showDocuments = false;
          }
    }
  }
  ngOnInit() {
    this.addCriDocumentForm = new   FormGroup({});
    this.parentCRIForm.form.addControl('criForm', new FormGroup({ 
      criDocuments: this.fb.control(this.ListOfAddedCriDocument),
    }))
    this.taskId = Number(this.route.snapshot.paramMap.get('idTask'));
    this.requestId = Number(this.route.snapshot.paramMap.get('idRequest'));
    this.connectedUser = this.authTokenService.applicationUser;
    this.initDocument();
    this.route.data.subscribe(resolversData => {
      this.documentsTitleList = resolversData['documentsTitle'];
      this.documentsTypeList = resolversData['documentsType'];
    });

    this.addCriDocumentForm = this.createFormGroup();
    this.initValues();
    this.isFromCriAndCriChangeOut.emit(false);
    this.setRestrictions();
  }


  setRestrictions() {
    if(this.allowedToModifyTechnicalInformationTab === false){
      this.addCriDocumentForm.disable();  
    }
    else{
      this.addCriDocumentForm.enable();
    }
  }

  initDocument(){
    if ( isNullOrUndefined(this.interventionReport.additionalDocuments)) {
      this.interventionReport.additionalDocuments = [];
      this.ListOfAddedCriDocument = [];}
    else{
      this.ListOfAddedCriDocument = JSON.parse(JSON.stringify(this.interventionReport.additionalDocuments));
    }
  }
  checkTypeValues(): any {
    for (const item of this.documentsTypeList) {
      if ( item.documentTypeName === 'Relation Client') {
        this.addCriDocumentForm.get('documentType').setValue(item);
      }
      if ( item.documentTypeName === '--') {
        const index = this.documentsTypeList.indexOf(item, 0);
        if (index > -1) {
          this.documentsTypeList.splice(index, 1);
        }
      }
    }
  }

  fillTypeList(): any {
    this.checkTypeValues();
    for (const item of this.documentsTitleList) {
      if ( item.documentTypeName === this.addCriDocumentForm.get('documentType').value.documentTypeName ) {
        this.documentsTitleByType.push(item);
      } 
      for ( const elm of this.documentsTitleByType ) {
        if (elm.documentTypeName !== this.addCriDocumentForm.get('documentType').value.documentTypeName) {
          const index = this.documentsTitleByType.indexOf(elm, 0);
          if (index > -1) {
            this.documentsTitleByType.splice(index, 1);
          }
        }
      }
    }
  }

  initValues(): void {
    if ( this.ListOfAddedCriDocument.length > 0 ) {
      this.showDocuments = true;
    } else {
      this.showDocuments = false;
    }
    this.fillTypeList();
    for (const index of this.documentsTitleByType) {
      if (index.documentTitle === 'CR Intervention complément' ) {
        this.addCriDocumentForm.get('documentTitle').setValue(index);
      }
    }
  }

  onSelectFile(event: any): void {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.isFileValid = true;
  }

  onRemoveFile(event: any): void {
    this.files.splice(this.files.indexOf(event), 1);
    this.isFileValid = false;
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['center-snackbar', 'snack-bar-container']
    });
  }

  onTypeChange(): any {
    this.documentsTitleByType = [];
    for ( const item of this.documentsTitleList) {
      if ( item.documentTypeName === this.addCriDocumentForm.get('documentType').value.documentTypeName ) {
        this.documentsTitleByType.push(item);
      }
    }
  }

  
  openConfirmationDialog(comment): any {
    const title = 'Erreur!';
    if(isNullOrUndefined(comment)){
      comment = this.MESSAGE_ERREUR_TAILLE__FICHIER_DEPASSE_10_MO;
    }else{
      comment = this.MESSAGE_ERREUR_CHEMIN_INTROUVABLE;
    }
    
    const btnOkText = 'OK';
    this.confirmationDialogService.confirm(title, comment, btnOkText, null, 'lg', false)
    // tslint:disable-next-line: no-console
    .then((confirmed) => console.log('User confirmed:', confirmed))
    // tslint:disable-next-line: no-console
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  prepareDocumentForUpload(): any {
    this.addedCriDocument.targetId = this.requestId;
    this.addedCriDocument.targetType = TARGET_TYPE_DOCUMENT.REQUEST;
    this.addedCriDocument.documentTypeId = this.addCriDocumentForm.get('documentType').value.id;
    this.addedCriDocument.typeDocument = this.addCriDocumentForm.get('documentTitle').value.documentTypeName;
    this.addedCriDocument.documentTitleId = this.addCriDocumentForm.get('documentTitle').value.id;
    this.addedCriDocument.titreDocument = this.addCriDocumentForm.get('documentTitle').value.documentTitle;
    this.addedCriDocument.category = CONSTANTS.CAT_COMPTE_RENDU_INTERVENTION;
    this.addedCriDocument.addDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy');

    this.fileToUpload.documentTypeId = this.addCriDocumentForm.get('documentType').value.id;
    this.fileToUpload.documentType = this.addCriDocumentForm.get('documentTitle').value.documentTypeName;
    this.fileToUpload.documentTitleId = this.addCriDocumentForm.get('documentTitle').value.id;
    this.fileToUpload.documentTitle = this.addCriDocumentForm.get('documentTitle').value.documentTitle;
    this.fileToUpload.file = this.files[0];
    this.fileToUpload.originalFilename = this.files[0].name;

    if (this.addCriDocumentForm.get('documentTitle').value.documentTitle !== 'Autre') {
      const trigram = `${this.addCriDocumentForm.get('documentTitle').value.trigram}_${formatNumber(this.connectedUser.coachId)}`;
      this.fileToUpload.customizedName = `${trigram}_${ + this.datePipe.transform(new Date(), 'yyyyMMdd')}`;
    }
    this.addedCriDocument.file = this.fileToUpload;
  }
  
  onSave(): void {
    this.isFromCriAndCriChangeOut.emit(true);
    if ( this.files.length === 0 ) {
      this.isFileValid = false;
    }
    if (isNullOrUndefined(this.addCriDocumentForm.get('documentTitle').value.documentTypeName)) {
      this.isTypeValid = false;
    }
    if (isNullOrUndefined(this.addCriDocumentForm.get('documentTitle').value.documentTitle)) {
      this.isTitleValid = false;
    }
    if ( this.isTitleValid && this.isTypeValid && this.isFileValid) {
      this.prepareDocumentForUpload();
      this.documentService.uploadTmpFiles(this.connectedUser.coachId, this.fileToUpload.documentTitleId,
        this.fileToUpload.documentType, this.fileToUpload.documentTitle, this.fileToUpload.documentTypeId,
        this.fileToUpload.file, this.fileToUpload.originalFilename, this.fileToUpload.customizedName,
          this.addedCriDocument.targetId).subscribe((response) => {
            this.responseDocument = response;
           
            this.files = [];
          },
          (error) => {
            // tslint:disable-next-line: no-console
            console.log('error adding document', error);
            if(!isNullOrUndefined(error.error)){
              this.openConfirmationDialog(error.error.message);
            }else{
              this.openConfirmationDialog(this.ERREUR_SERVER_UPLOAD_DOCUMENT);
            }
            
          },
          () => {
            if (!isNullOrUndefined(this.responseDocument)) { 
              this.responseDocument.file =  this.fileToUpload;
              this.openSnackBar('Votre document a bien été chargé', undefined);  
              this.showDocuments = true;
              this.ListOfAddedCriDocument.push(this.responseDocument);
              this.parentCRIForm.form.get('criForm').get('criDocuments').setValue(this.ListOfAddedCriDocument);

              
            }
          });
      console.log('saved cri ', this.interventionReport);
    }
  }
  
  download(f: any): void {
    if(isNullOrUndefined(f.id)){
      this.documentService.showTmpDocument(this.connectedUser.coachId, f.name).subscribe( (data) => {
            const type = data.headers.get(this.CONTENT_TYPE);
            const file = new Blob([data.body], { type });     
            if ( type !== this.TYPE_OCTET_STREAM) {
              const fileURL = URL.createObjectURL(file);
              window.open(fileURL);
            } else {
              const element = document.createElement('a');
              element.target = this.BLANK;
              element.href = URL.createObjectURL(file);
              element.download = f.name;
              document.body.appendChild(element);
              element.click();
            }
          });
    }else{
      this.documentService.showAndDownloadFile(this.interventionReport.customer.nicheIdentifier, f.fileName).subscribe( (data) => {
        const type = data.headers.get(this.CONTENT_TYPE);
        const file = new Blob([data.body], { type });     
        if ( type !== this.TYPE_OCTET_STREAM) {
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        } else {
          const element = document.createElement('a');
          element.target =  this.BLANK;
          element.href = URL.createObjectURL(file);
          element.download = f.name;
          document.body.appendChild(element);
          element.click();
        }
      });
    }
  }

   
delete(file: DocumentVO): void {
  this.isFromCriAndCriChangeOut.emit(true);
  if (!isNullOrUndefined(file.id)) {
    this.documentService.deleteSavedDocumentCri(file.id).subscribe((res) => {
      console.log('saved document cri was deleted', res);},
      (er) => {},
  () => {
    this.ListOfAddedCriDocument.splice(this.ListOfAddedCriDocument.indexOf(file), 1);
     if(this.ListOfAddedCriDocument.length === 0) {
      this.showDocuments = false;}
      const document = this.interventionReport.additionalDocuments.find((document) => document.id === file.id)
      console.log('document ',document);
      console.log('this.interventionReport.additionalDocuments  before',this.interventionReport.additionalDocuments);
      this.interventionReport.additionalDocuments.splice(this.interventionReport.additionalDocuments.indexOf(document), 1);
      console.log('this.interventionReport.additionalDocuments after',this.interventionReport.additionalDocuments); 
    });
} else {
     this.documentService.deleteTmpDocument(file.file.file, file.name, this.connectedUser.coachId).subscribe((res) => {  
     console.log('tmp document cri was deleted');},
     (er) => {},
     () => {
       this.ListOfAddedCriDocument.splice(this.ListOfAddedCriDocument.indexOf(file), 1);
       if ( this.ListOfAddedCriDocument.length === 0 ) {
          this.showDocuments = false;}
        });}
        this.parentCRIForm.form.get('criForm').get('criDocuments').setValue(this.ListOfAddedCriDocument);
    }

  onCancel(): void {
    for (const typeIndex of this.documentsTypeList) {
      if ( typeIndex.documentTypeName === 'Relation Client') {
        this.addCriDocumentForm.get('documentType').setValue(typeIndex);
      }
    }
    this.fillTypeList();
    for (const titleIndex of this.documentsTitleByType) {
      if (titleIndex.documentTitle === 'CR Intervention complément' ) {
        this.addCriDocumentForm.get('documentTitle').setValue(titleIndex);
      }
    }
    this.files = [];
  }
}
