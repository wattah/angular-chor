import { TypeDocumentService } from './../../../_core/services/type-document-service';
import { catchError } from 'rxjs/operators';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { TypeDocument } from '../../../_core/models/Type-Document';
import { DocumentVO } from '../../../_core/models/documentVO';
import { DocumentService } from '../../../_core/services/documents-service';
import { getCustomerIdFromURL } from '../customer-dashboard-utils';
import { of } from 'rxjs';
import { getDecryptedValue } from 'src/app/_core/utils/functions-utils';

@Component({
  selector: 'app-customer-document',
  templateUrl: './customer-document.component.html',
  styleUrls: ['./customer-document.component.scss']
})
export class CustomerDocumentComponent implements OnInit {
  typeDocumentId: number;

  typeDocuments: TypeDocument[];

  documents: DocumentVO[];

  @Input()
  years: number[];
 
  @Input()
  isParticular: boolean;

  year: number;

  download: any[];

  @Input()
  nicheIdentif: string;

  customerId: string;

  isFirstAcces = false;
  isEmptyDocuments: boolean = false;
  inCompleteCall: boolean = true;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private documentService: DocumentService,
              private typeDocumentService: TypeDocumentService) {}
  setFisrtAcces(): void {
      this.typeDocumentId = 16;
      this.year = 0;
      if(this.documents.length !== 0) {
        this.isFirstAcces = false;
      } else {
        this.isFirstAcces = true;
      }
  }

  ngOnInit(): void {
    this.getDocumentsType();
    this.typeDocumentId = 16;
    this.year = 0;
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
      this.getDocuments();
    });
    this.isFirstAcces = true;
  }
  getDocumentsType() {
    this.typeDocumentService.getDocumentsTypeDocs()
    .pipe(catchError(() => of([])))
    .subscribe(
      (types) => this.typeDocuments = types,
      (error)=>{this.inCompleteCall = false;},
      ()=>{this.inCompleteCall = false;}
    );
  }
  getDocuments() {
    this.inCompleteCall = true;
    this.documentService.getDocumentsBy(this.customerId, 16 , '' )
    .pipe(catchError(() => of([])))
    .subscribe(
      (documents) => {
        this.documents = documents;
        this.isEmptyDocuments = documents.length === 0;
      },
      (error) => {
        this.isEmptyDocuments = false;
        this.inCompleteCall = false;
      },
      () => {
        this.setFisrtAcces();
        this.inCompleteCall = false;
      }
    );
  }
  
  downloadDocument(fileName: string): void {
    this.documentService.downloadFile(fileName, this.nicheIdentif).subscribe(
        (data) => {
          const type = data.headers.get('Content-Type');
          const file = new Blob([data.body], { type });     
          if ( type !== 'application/octet-stream') {
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          } else {
            const element = document.createElement('a');
            element.target = '_blank';
            element.href = URL.createObjectURL(file);
            element.download = fileName;
            document.body.appendChild(element);
            element.click();
          }
        }, 
        (error) => {
          this.router.navigate(['customer-dashboard/not-found-document'], { queryParams: { fileName: fileName } });
        }
      );   
  } 

  onChangeSelected(newValue: number): void {
    this.typeDocumentId = newValue;
    if (String(this.typeDocumentId) === '16') {
      this.typeDocumentId = 16;
    }
    if (isNullOrUndefined(this.year)) {
      this.year = 0;
    }
    this.isFirstAcces = false;
    this.getDocumentsCustomer(this.typeDocumentId, this.year);
  }

  onChangeSelectedYear(value: number): void {
    this.year = value;
    if (isNullOrUndefined(this.typeDocumentId) || String(this.typeDocumentId) === '16') {
      this.typeDocumentId = 16;
    }
    if (isNullOrUndefined(this.year)) {
      this.year = 0;
    }
    this.isFirstAcces = false;
    this.getDocumentsCustomer(this.typeDocumentId, this.year);
  }

  getDocumentsCustomer(value: number, year: number): void {
    const customerIdNumber = getDecryptedValue(this.customerId);
    if (!isNullOrUndefined(customerIdNumber) && customerIdNumber > 0) {
      if (String(year) === '0') {
        this.documentService.getDocumentsBy(this.customerId, value, '').subscribe(data => (this.documents = data));
      } else {
        this.documentService.getDocumentsBy(this.customerId, value, String(year)).subscribe(data => (this.documents = data));
      }
    } else {
      this.router.navigate(['error']);
    }
  }

  getImageByFormat(ext: string): string {
    const imageList = {
      pdf: 'pdf',
      doc: 'doc',
      png: 'png',
      jpg: 'jpg',
      ppt: 'ppt',
      xls: 'xls',
      txt: 'txt',
      zip: 'zip',
      default: 'other'
    };
    return imageList[ext] ? imageList[ext] : imageList['default'];
  } 
  
}
