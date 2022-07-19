import { CustomerTotalsDebt } from './../../../_core/models/customer-totals-debt';
import { PersonService } from '../../../_core/services';
import { DebtRecouverementService } from './../../../_core/services/debt-recouverement.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';

import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';
import { GoodToKnowResolver } from '../../../_core/resolvers';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { RequestDetailsService } from '../../../_core/services/request-details.service';
import { RequestAnswersService } from '../../../_core/services/request-answers.service';
import { DocumentTitleVO } from '../../../_core/models/document-title-vo';
import { DocumentTypeVO } from '../../../_core/models/models';
import { Document } from '../../../_core/models/document';
import { DocumentVO } from '../../../_core/models/documentVO';
import { FileUploadVO } from '../../../_core/models/file-upload-vo';
import { TARGET_TYPE_DOCUMENT } from '../../../_core/constants/constants';
import { getDecryptedValue } from '../../../_core/utils/functions-utils';
import { DocumentService } from '../../../_core/services/documents-service';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddDocumentComponent implements OnInit {

  customerId: string;
  infoProfil: BeneficiaireView;
  goodToKnow: GoodToKnowResolver;
  recoveryDate: Date;
  typeCustomer: string;
  detailRequest: RequestCustomerVO;
  requestId: any = '';
  isRequestView = false;
  documentsTitleList: DocumentTitleVO[] = [];
  documentsTypeList: DocumentTypeVO[] = [];
  documentsTitleByType: DocumentTitleVO[] = [];
  otherDocument: DocumentTitleVO;
  files: File[] = [];
  isAccessibleFromPortal = false;

  // tslint:disable-next-line: no-as-type-assertion
  newDocumentToSave: DocumentVO = {} as DocumentVO;
  // tslint:disable-next-line: no-as-type-assertion
  uploadedFile: FileUploadVO = {} as FileUploadVO;

  addDocumentForm: FormGroup;
  fromHistory: any;

  /** gestion des erreurs */
  isValidBtn = true;
  typeDocInvalid = false;
  titleDocInvalid = false;
  fileInvalid = false;
  isNotValid = false;
  OHTER = 'Autre';
  totalDebt: CustomerTotalsDebt[];
  nichesWithRemainingGreatThanZero: string[];
  entrepriseRecoveryDate: Date;
  nicheValue: string;
  detteTotalTTC: number;
  detteTotal: number;
  constructor(private readonly route: ActivatedRoute, private readonly _snackBar: MatSnackBar, private readonly fb: FormBuilder,
    readonly requestDetailsService: RequestDetailsService, readonly requestAnswersService: RequestAnswersService,
     private readonly documentService: DocumentService, private readonly datePipe: DatePipe,
     readonly confirmationDialogService: ConfirmationDialogService, readonly _location: Location, readonly router: Router,
    private readonly debtRecouverementService: DebtRecouverementService,
    private readonly personService: PersonService) {
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      documentType: this.fb.control('--', [Validators.required]),
      documentTitle: this.fb.control('--', [Validators.required]),
      file: this.fb.control(null, [Validators.required])
    });
  }

  ngOnInit(): any {
    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
    });

    this.route.queryParams.subscribe(params => {
      this.fromHistory = params['fromHistory'];
    });

    if ( !isNullOrUndefined(this.requestId)) {
      this.isRequestView = true;

      this.requestDetailsService.getDetailsByRquestId(this.requestId).subscribe((response) => {
        this.detailRequest = response;
      });

    }

    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.route.queryParamMap.subscribe( params => {
      this.typeCustomer = params.get('typeCustomer');
    });

    this.route.data.subscribe(resolversData => {
      this.recoveryDate = resolversData['recoveryDate'];
      this.infoProfil = resolversData['infoProfil'];
      this.goodToKnow = resolversData['goodToKnow'];
      this.documentsTitleList = resolversData['documentsTitle'];
      if(!isNullOrUndefined(this.documentsTitleList)) {
        for(const otherDoc of this.documentsTitleList) {
          if(otherDoc.documentTitle === this.OHTER) {
            this.otherDocument = otherDoc;
          }
        }
      }
      this.documentsTypeList = resolversData['documentsType'];
      this.totalDebt = resolversData['totalDebt'];
    });
    this.addDocumentForm = this.createFormGroup();
    this.addDocumentForm.get('documentType').setValue(this.documentsTypeList[0]);
    if (!this.ValidForm()) {
      this.isValidBtn = false;
    }
  }


  onTypeSelect(): any {
    for (const item of this.documentsTitleList) {
      if ( item.documentTypeName === this.addDocumentForm.get('documentType').value.documentTypeName) {
        this.documentsTitleByType.push(item);
      }
      for ( const elm of this.documentsTitleByType ) {
        if (elm.documentTypeName !== this.addDocumentForm.get('documentType').value.documentTypeName) {
          const index = this.documentsTitleByType.indexOf(elm, 0);
          if (index > -1) {
            this.documentsTitleByType.splice(index, 1);
          }
        }
      }
    }
    if (this.addDocumentForm.get('documentType').value.documentTypeName === '--') {
      this.typeDocInvalid = true;
    } else {
      this.documentsTitleByType.push(this.otherDocument);
      this.typeDocInvalid = false;
    }
  }

  onTitleSelect(): any {
    if (this.addDocumentForm.get('documentTitle').value === '--') {
      this.titleDocInvalid = true;
    } else {
      this.titleDocInvalid = false;
    }
  }

  onSelectFile(event: any): void {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.fileInvalid = false;
  }

  onRemoveFile(event: any): void {
    this.files.splice(this.files.indexOf(event), 1);
    this.fileInvalid = true;
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['center-snackbar', 'snack-bar-container']
    });
  }

  openConfirmationDialog(): any {
    const title = 'Erreur!';
    const comment = 'Erreur Serveur : une erreur technique est survenue';
    const btnOkText = 'OK';
    this.confirmationDialogService.confirm(title, comment, btnOkText, null, 'lg', false)
    // tslint:disable-next-line: no-console
    .then((confirmed) => console.log('User confirmed:', confirmed))
    // tslint:disable-next-line: no-console
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  isVisibleOnPortal(event: any): void {
    this.isAccessibleFromPortal = event.checked;
    // tslint:disable-next-line: no-console
    console.log('visible', this.isAccessibleFromPortal);
  }

  onSave(): any {
    // tslint:disable-next-line: no-as-type-assertion
    const document: Document = {} as Document;

    this.newDocumentToSave.typeDocument = this.addDocumentForm.get('documentType').value.documentTypeName;
    this.newDocumentToSave.documentTypeId = this.addDocumentForm.get('documentType').value.id;
    this.newDocumentToSave.titreDocument = this.addDocumentForm.get('documentTitle').value.documentTitle;
    this.newDocumentToSave.documentTitleId = this.addDocumentForm.get('documentTitle').value.id;
    if ( this.addDocumentForm.get('documentTitle').value === 'autre') {
      this.newDocumentToSave.documentTitleId = null;
    }
    if ( this.isRequestView ) {
      this.newDocumentToSave.targetType = TARGET_TYPE_DOCUMENT.REQUEST;
      this.newDocumentToSave.targetId = this.requestId;
    } else {
      this.newDocumentToSave.targetType = TARGET_TYPE_DOCUMENT.CUSTOMER;
      this.newDocumentToSave.targetId = getDecryptedValue(this.customerId);
    }

    this.uploadedFile.originalFilename = this.files[0].name;
    document.documentVo = this.newDocumentToSave;
    document.fileUploadVO = this.uploadedFile;
    document.file = this.files[0];

    const dateCreation: string = this.datePipe.transform(new Date(), 'MM/dd/yyyy');

    this.newDocumentToSave.addDate = dateCreation;

    this.documentService.saveFullDocument(this.addDocumentForm.get('documentTitle').value.id , this.newDocumentToSave.typeDocument,
      this.newDocumentToSave.titreDocument, this.addDocumentForm.get('documentType').value.id,
       document.file, this.newDocumentToSave.targetId.toString(), this.newDocumentToSave.targetType,
        this.isAccessibleFromPortal.toString()).subscribe((response) => {
        // tslint:disable-next-line: no-console
          console.log('response :', response);
        },
      (error) => {
        // tslint:disable-next-line: no-console
        console.log('error adding document', error);
        this.openConfirmationDialog();
      },
      () => {
        this.openSnackBar('Votre document a bien été chargé', undefined);
        this._location.back();
      });
  }

  onCancel(): any {

    if ( this.isRequestView ) {
      this.router.navigate(['customer-dashboard', this.customerId , 'detail', 'request', this.requestId],
       { queryParamsHandling: 'merge' });
    } else if ( this.fromHistory === 'yes') {
      console.log('from history', this.fromHistory);
      this.router.navigate(['customer-dashboard', this.customerId , 'see-all', 'document-full-list'],
       { queryParamsHandling: 'merge' });
    } else if ( this.fromHistory === 'no' && this.typeCustomer === 'company') {
      console.log('from history', this.fromHistory);
      this.router.navigate(['/customer-dashboard/entreprise', this.customerId], { queryParamsHandling: 'merge' });
    } else if (this.fromHistory === 'no' && this.typeCustomer !== 'company' ) {
      this.router.navigate(['/customer-dashboard/particular', this.customerId], { queryParamsHandling: 'merge' });
    }
  }

  ValidForm(): boolean {
    if (!isNullOrUndefined(this.addDocumentForm.get('documentType').value) &&
     this.addDocumentForm.get('documentType').value !== '--') {
      this.typeDocInvalid = false;
    } else {
      this.typeDocInvalid = true;
    }
    if (!isNullOrUndefined(this.addDocumentForm.get('documentType').value) &&
    this.addDocumentForm.get('documentTitle').value !== '--') {
      this.titleDocInvalid = false;
    } else {
      this.titleDocInvalid = true;
    }

    if (this.files !== null && this.files.length !== 0) {
      this.fileInvalid = false;
    } else {
      this.fileInvalid = true;
    }
    return this.isNotValid;
  }
}
