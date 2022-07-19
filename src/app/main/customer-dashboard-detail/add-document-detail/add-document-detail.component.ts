import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

import { getDecryptedValue } from '../../../_core/utils/functions-utils';
import { InteractionService } from '../interaction.service';
import { getCustomerIdFromURL } from '../../customer-dashboard/customer-dashboard-utils';
import { HomologationService } from '../../../_core/services/homologation.service';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { ApprovalDocumentVO } from '../../../_core/models/homologation/approval-document-vo';
import { DocumentTitleVO, DocumentTypeVO, FileUploadVO } from '../../../_core/models/models';
import { DocumentService } from '../../../_core/services/documents-service';
import { ApplicationUserVO } from '../../../_core/models/application-user';
import { AuthTokenService } from '../../../_core/services/auth_token';
import { NotificationService } from '../../../_core/services/notification.service';
import { HomologationVO } from '../../../_core/models/homologation/homologation-vo';

@Component({
  selector: 'app-add-document-detail',
  templateUrl: './add-document-detail.component.html',
  styleUrls: ['./add-document-detail.component.scss']
})
export class AddDocumentDetailComponent implements OnInit {
  files: File[] = [];
  isSowLink360: boolean;
  customerId: string ;
  typeCustomer: string ;
  docToUpload: ApprovalDocumentVO;
  doubleDash = '--';
  documentsTitleList: DocumentTitleVO[] = [];
  documentsTypeList: DocumentTypeVO[] = [];
  documentTitleByType: DocumentTitleVO[] = [];
  documentToSave: ApprovalDocumentVO;
  connectedUser: ApplicationUserVO = {} as ApplicationUserVO;
  fileUpload: FileUploadVO = {} as FileUploadVO;

  homologation: HomologationVO = {} as HomologationVO;

    /*-------- Auto-completion filters------*/
  filteredType: Observable<any[]>;
  filteredTitle: Observable<any[]>;
  
    /*-------- Auto-completion lists controls------*/
  typeDocumentControl = new FormControl();
  titreDocumentControl = new FormControl(); 
  
  /*--------Form validation------------*/
  addApprovalDocumentForm: FormGroup;
  isTypeValid = true;
  isTitleValid = true;
  isFileValid = true;

  constructor(private readonly _snackBar: MatSnackBar, readonly router: Router, 
    private readonly route: ActivatedRoute, readonly service: InteractionService,
     readonly homologationService: HomologationService, private readonly fb: FormBuilder,
      readonly documentService: DocumentService, readonly authTokenService: AuthTokenService,
      readonly notificationService: NotificationService) { 
    this.addApprovalDocumentForm = this.createFormGroup();
  }
 
  createFormGroup(): FormGroup {
    return this.fb.group({
      typeDocumentControl: this.fb.control(this.doubleDash, [Validators.required]),
      titreDocumentControl: this.fb.control(this.doubleDash, [Validators.required]),
      file: this.fb.control(null, [Validators.required])
    });
  }

  ngOnInit(): void {

    this.homologation = this.notificationService.getHomologation();
    this.connectedUser = this.authTokenService.applicationUser;
    this.docToUpload = this.homologationService.getDocumentToEdit();
    
    this.route.data.subscribe(resolversData => {
      this.documentsTitleList = resolversData['documentsTitle'];
      this.documentsTypeList = resolversData['documentsType'];
    });

    this.customerId = getCustomerIdFromURL(this.route);
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.service.changeValueShowLink360(true);

    this.initValues();
   
   /*------------------Filtre sur liste des types ---------------------------*/
    this.filteredType = this.typeDocumentControl.valueChanges
   .pipe(
     startWith(''),
     map(option => option ? this._filterType(option) : this.documentsTypeList.slice())
   );

   /*------------------Filtre sur liste des titres ---------------------------*/
    this.filteredTitle = this.titreDocumentControl.valueChanges
 .pipe(
   startWith(''),
   map(option => option ? this._filterTitle(option) : this.documentTitleByType.slice())
 );
  }

  initValues(): any {
    if ( !isNullOrUndefined(this.docToUpload.documentTitleName) ) {
      this.titreDocumentControl.setValue(this.docToUpload.documentTitleName);
      this.titreDocumentControl.disable();
    } else {
      this.titreDocumentControl.setValue(this.doubleDash);
    }
    if ( !isNullOrUndefined(this.docToUpload.documentTitleTypeId) ) {
      for ( const item of this.documentsTitleList) {
        if ( item.documentTypeId === this.docToUpload.documentTitleTypeId ) {
          this.typeDocumentControl.setValue(item.documentTypeName);
          this.typeDocumentControl.disable();
        }
      }
    } else {
      this.typeDocumentControl.setValue(this.doubleDash);
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

  checkTypeAndTitleList(): void {
    if ( this.files.length === 0 ) {
      this.isFileValid = false;
    }
    if (isNullOrUndefined(this.typeDocumentControl.value) || this.typeDocumentControl.value === '--' 
    || this.typeDocumentControl.value === '') {
      this.isTypeValid = false;
    }

    if (isNullOrUndefined(this.titreDocumentControl.value) || this.titreDocumentControl.value === '--'
    || this.titreDocumentControl.value === '') {
      this.isTitleValid = false;
    }
  }

  save(): void {
    this.checkTypeAndTitleList();
    if ( this.isTitleValid && this.isTypeValid && this.isFileValid) {

      const userId = getDecryptedValue(this.customerId);
      this.fileUpload.documentTitle = this.titreDocumentControl.value;
      this.fileUpload.documentType = this.typeDocumentControl.value;
      this.fileUpload.file = this.files[0];
      this.fileUpload.originalFilename = this.files[0].name;
    
      for ( const ele of this.documentsTitleList) {
        if ( ele.documentTitle === this.titreDocumentControl.value) {
          this.fileUpload.documentTitleId = ele.id;
        }
      }

      for ( const ele of this.documentsTypeList) {
        if ( ele.documentTypeName === this.typeDocumentControl.value) {
          this.fileUpload.documentTypeId = ele.id;
        }
      }

      this.docToUpload.id = this.docToUpload.id;
      this.docToUpload.filename = this.fileUpload.originalFilename;
      this.docToUpload.isUploaded = true;
      this.docToUpload.uploadedAt = new Date();
      this.docToUpload.documentTitleName = this.fileUpload.documentTitle;
      this.docToUpload.documentTypeName = this.fileUpload.documentType;
      this.docToUpload.documentTitleId = this.fileUpload.documentTitleId;
      this.docToUpload.documentTypeId = this.fileUpload.documentTypeId;

      this.documentService.uploadTmpDocument(userId, this.fileUpload.file).subscribe((response) => {
      },
      (error) => {},
      () => {   
        this.openSnackBar('Votre document a bien été enregistré', undefined);
        this.notificationService.setTmpDoc(this.docToUpload);
        this.goToHomologation() ;
        this.addDocumentsToList(this.docToUpload);
      });
    }
  }

  addDocumentsToList(newDocument: ApprovalDocumentVO): any {
    if (!isNullOrUndefined(this.homologation.approvalDocuments)) {
      const updateItem = this.homologation.approvalDocuments.find(this.findIndexOfDocument, newDocument.id);
      const index = this.homologation.approvalDocuments.indexOf(updateItem);
      this.homologation.approvalDocuments[index] = newDocument;
    }
  }

  findIndexOfDocument(document: any): any { 
    return document.id === this;
  }

  goToHomologation(): void {   
    this.router.navigate(
      ['/customer-dashboard', this.customerId, 'detail', 'homologation'],
      {
        queryParams: { typeCustomer: this.typeCustomer },    
        queryParamsHandling: 'merge'
      }
    );
  }

  prepareFieldsToSave(): any {

    this.documentToSave.id = 0;
    getDecryptedValue(this.customerId);
   
  }

  getSelectedType(): any {
    for ( const item of this.documentsTitleList) {
      if ( item.documentTypeName === this.typeDocumentControl.value ) {
        this.documentTitleByType.push(item);
      }
    }
    if ( this.typeDocumentControl.value !== '--') {
      this.isTypeValid = true;
    } else {
      this.isTypeValid = false;
    }
  }

  private _filterType(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.documentsTypeList.filter(option => option.documentTypeName !== undefined)
    .filter(option => option.documentTypeName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterTitle(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.documentTitleByType.filter(option => option.documentTitle !== undefined)
    .filter(option => option.documentTitle.toLowerCase().indexOf(filterValue) === 0);
  }

}
