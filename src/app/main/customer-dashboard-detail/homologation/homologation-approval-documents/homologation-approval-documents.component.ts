import { FileNotFoundPopupComponent } from './file-not-found-popup/file-not-found-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RadioBottonRenderComponent } from './radio-botton-render/radio-botton-render.component';
import { DatePipe } from '@angular/common';
import { getCustomerIdFromURL } from './../../../../../app/main/customer-dashboard/customer-dashboard-utils';
import { DocumentService } from './../../../../../app/_core/services/documents-service';
import { HomologationService } from './../../../../../app/_core/services/homologation.service';
import { isNullOrUndefined } from './../../../../../app/_core/utils/string-utils';
import { DateFormatPipeFrench } from './../../../../_shared/pipes/dateformat/date-format.pipe';
import { ApprovalDocumentPortalService } from './approval-document-portal.service';
import { ApprovalDocumentType } from './../../../../_core/constants/constants';
import { Router , ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Injector } from '@angular/core';
import { NotificationService } from '../../../../_core/services/notification.service';
import { ApprovalDocumentVO } from '../../../../_core/models/homologation/approval-document-vo';
import { HomologationVO } from '../../../../_core/models';
import { InfoCustomerHomologation } from '../../../../_core/models/info-customer-homologation-vo';
import { CanalMotifHomologation } from '../../../../_core/models/Canal-Motif-homologation-vo';

@Component({
  selector: 'app-homologation-approval-documents',
  templateUrl: './homologation-approval-documents.component.html',
  styleUrls: ['./homologation-approval-documents.component.scss']
})
export class HomologationApprovalDocumentsComponent implements OnInit {

  newUploadedFile: ApprovalDocumentVO = {} as ApprovalDocumentVO;

  @Input() homologation: HomologationVO;
  @Input() infoCustomerHomologation: InfoCustomerHomologation;
  @Input() canalMotifHomologation: CanalMotifHomologation;

   defaultColDef;
   autoGroupColumnDef;
   groupDefaultExpanded;
   getDataPath
   roundcheck:any='';
   typeCustomer
  defaultSortModel = [];
  getRowHeight: any;
  frameworkComponents = {
    radioSelector: RadioBottonRenderComponent
  };
 styleGeneral="'display': 'flex','justify-content':'center'";
 rowData = [];
   columnDefs = [
    {
      headerName: '',
      minWidth: 120,
      maxWidth: 120,
      children: [
        {
          headerName: '',
          field: 'customerFullName',
          colId: 'recu ',
        },
        {
          headerName: 'Reçu le',
          field: 'receivedAt',
          colId: 'recu ',
          minWidth: 150,
          maxWidth: 150,
          valueGetter: (params) => params.data && params.data.receivedAt ? this.dateFormatter(params.data.receivedAt):'-'
        },
        {
          headerName: 'Modifié le',
          field: 'modifiedAt',
          headerClass: 'borderRight ',
          cellStyle: {'border-right': '1px solid #dadada !important'},
          minWidth: 140,
          maxWidth: 140,
          valueGetter: (params) => params.data && params.data.modifiedAt ? this.dateFormatter(params.data.modifiedAt):'-'
        },
      ], 
    },

    {
      headerName: 'Pré-homologation',
      marryChildren: true,
      headerClass: "grid-cell-centered",
      children: [
        {
          headerName:'à préciser',
          field: 'pre-homo-preciser',
          cellStyle: {'display': 'flex','justify-content':'center',
          'border-left': 'none !important'
        },
        cellRenderer: "radioSelector",
        cellRendererParams: {
          prefixId: 'pre-homo-a-preciser',
          returnedValue: null
        },
        width: 80,
        minWidth:90
        },
        {
          headerName:'valide',
          field: 'pre-homo-valide',
          headerClass: 'centerround',
          cellStyle: {'display': 'flex','justify-content':'center'},
          checkboxSelection: false,
          cellRenderer: "radioSelector",
          cellRendererParams: {
            prefixId: 'pre-homo-valid',
            returnedValue: true
          },
          width: 80,
          minWidth:80
        },
        {
          headerName:'Invalide',
          field: 'pre-homo-invalide',
          headerClass: 'border-right ',
          cellStyle: {'border-right': '1px solid #dadada !important',
          'justify-content':'center','display': 'flex'},
          cellRenderer: "radioSelector",
          cellRendererParams: {
            prefixId: 'pre-homo-invalid',
            returnedValue: false
          },
          width: 80,
          minWidth:80
        },
   
      ],
    },
    {
      headerName: 'Homologation',
      headerClass: 'noborder',
      marryChildren: true,
      children: [
        {
          headerName:'à préciser',
          field: 'homo-preciser',
          cellStyle: {'justify-content':'center','display': 'flex'},
          cellRenderer: "radioSelector",
          cellRendererParams: {
            prefixId: 'homo-a-preciser',
            returnedValue: null
          },
          width: 80,
          minWidth:90
        },
        {
          headerName:'Valide',
          field: 'homo-valide',
          headerClass: 'centerround',
          cellStyle: {'justify-content':'center','display': 'flex'},
          cellRenderer: "radioSelector",
          cellRendererParams: {
            prefixId: 'homo-valid',
            returnedValue: true
          },
          width: 80,
          minWidth:80
        },
        {
          headerName:'InValide',
          field: 'homo-invalide',
          cellStyle: {'justify-content':'center','display': 'flex'},
          cellRenderer: "radioSelector",
          cellRendererParams: {
            prefixId: 'homo-invalid',
            returnedValue: false
          },
          width: 80,
          minWidth:80
        }
   
    ],
  },
{
  headerName: '',
  headerClass: 'noborder',
  marryChildren: true,
  children: [
        {
          headerName:'',
          field: 'download',
          minWidth: 40,
          maxWidth: 40,
          cellRenderer: (params) => {
            return  `${params.value}`
        },
        },
        {
          headerName:'',
          field: 'upload',
          minWidth: 40,
          maxWidth: 40,
          cellRenderer: (params) => {
            return  `${params.value}`
        },
        },

        {
          headerName:'',
          field: 'delete',
          minWidth: 40,
          maxWidth: 40,
          cellRenderer: (params) => {
            return params.data.uploadedAt && params.data.filename ? `${params.value}`:``;
        },
        },

      ],
    },
  ];
  CONTRACT_DOCUMENT: any[];
  SUPPORTING_DOCUMENT: any[];
  PRODUCTION_DOCUMENT: any[];
  PROPOSITION_COMMERCIALE: any[];
  customerId: string;
  customerNiche;
  /**
   * to persiste removed document after click on delete botton
   */
  removedDocument: any[] = [];
  fullCustomer: any;
  status: any;
  counter = 0;
  customerStatus: any;
  router: Router;
  route: ActivatedRoute;
  approvalDocumentPortalService: ApprovalDocumentPortalService;
  dateFormatPipeFrench: DateFormatPipeFrench;
  documentService: DocumentService;
  homologatioService: HomologationService;
  notificationService: NotificationService;
  datePipe: DatePipe;
  modalService: NgbModal;
  constructor(private readonly injector : Injector) {
  this.injectServices();
  this.defaultColDef = { flex: 1 };
  this.autoGroupColumnDef = {
    headerName: 'Document',
    headerClass: 'centerround',
    colId:'document',
    width:680,
    cellRendererParams: { suppressCount: true,},
  };
  this.groupDefaultExpanded = -1;
  this.getDataPath = function (data) {
    return  data.docHierarchy;
  }; 
   }
  injectServices() {
    this.router = this.injector.get<Router>(Router);
    this.route = this.injector.get<ActivatedRoute>(ActivatedRoute);
    this.approvalDocumentPortalService = this.injector.get<ApprovalDocumentPortalService>(ApprovalDocumentPortalService);
    this.dateFormatPipeFrench = this.injector.get<DateFormatPipeFrench>(DateFormatPipeFrench);
    this.documentService = this.injector.get<DocumentService>(DocumentService);
    this.homologatioService = this.injector.get<HomologationService>(HomologationService);
    this.notificationService = this.injector.get<NotificationService>(NotificationService);
    this.datePipe = this.injector.get<DatePipe>(DatePipe);
    this.modalService = this.injector.get<NgbModal>(NgbModal);
  }


  ngOnInit() {
    this.newUploadedFile = this.notificationService.getTmpDoc();

    if (!isNullOrUndefined(this.notificationService.getHomologation())) {
      this.homologation = this.notificationService.getHomologation();
      this.canalMotifHomologation = this.notificationService.getcanalMotifHomologation();
      this.notificationService.setHomologation(null);
      this.notificationService.setcanalMotifHomologation(null);
    }
    console.log(' approv homolog: ', this.homologation);
    this.customerId = getCustomerIdFromURL(this.route);
    this.customerNiche = this.infoCustomerHomologation.nicheIdentifier;
    this.setCustomerName();
    this.CONTRACT_DOCUMENT = this.getDocumentsByType(ApprovalDocumentType.CONTRACT_DOCUMENT);
    this.SUPPORTING_DOCUMENT = this.getDocumentsByType(ApprovalDocumentType.SUPPORTING_DOCUMENT);
    this.PRODUCTION_DOCUMENT = this.getDocumentsByType(ApprovalDocumentType.PRODUCTION_DOCUMENT);
    this.PROPOSITION_COMMERCIALE = this.getDocumentsByType(ApprovalDocumentType.PROPOSITION_COMMERCIALE);
    this.formatContractDocument();
    this.formatSupportDocument();
    this.formatProductDocument();
    this.fromatPropositionDocument();
    this.rowData = [...this.CONTRACT_DOCUMENT , ...this.SUPPORTING_DOCUMENT , ...this.PRODUCTION_DOCUMENT , ...this.PROPOSITION_COMMERCIALE];
    this.typeCustomer = this.route.snapshot.queryParamMap.get("typeCustomer");
  }
  private setCustomerName() {
    if(this.homologation && this.homologation.approvalDocuments){
      this.homologation.approvalDocuments.forEach(
        (document)=> document.customerFullName = this.infoCustomerHomologation.lastName
      );
    }
  }

  fromatPropositionDocument() {
    let counter = 0;
    this.PROPOSITION_COMMERCIALE.forEach(
      (document)=>{
        document.docHierarchy = ['Proposition commerciale', document.documentTitleName];
        document.download = `<span class="icon download"></span>`;
        document.upload = ``;
        document.delete = ``;
        counter++;
      }
    );
    if(this.PROPOSITION_COMMERCIALE.length > 0){
      this.addFirstPropositionDocument();
    }
  }
  addFirstPropositionDocument() {
    const document = {} as any;
    document.docHierarchy = ['Proposition commerciale'];
    document.id=0;
    document.valideprehomo = '';
    document.invalideprehomo = '';
    document.preciserprehomo = '';
    document.validehomo = '';
    document.invalidehomo = ''
    document.preciserhomo = '';
    document.download = '';
    document.uplaod = '';
    document.delete = '';
    document.receivedAt = '*';
    document.modifiedAt = '*';
    this.PROPOSITION_COMMERCIALE.unshift(document);
  }
  private formatProductDocument() {
    let counter = this.SUPPORTING_DOCUMENT.length + 1;
    this.PRODUCTION_DOCUMENT.forEach((document) => {
      document.docHierarchy = ['Eléments de production', document.documentTitleName];
      document.download = `<span class="icon download"></span>`;
      document.upload = ``;
      document.delete = ``;
      counter++;
    });
    if(this.PRODUCTION_DOCUMENT.length > 0){
      this.addFirstProductDocument();
    }
  }
  addFirstProductDocument() {
    const document = {} as any;
    document.docHierarchy = ['Eléments de production'];
    document.id=0;
    document.valideprehomo = '';
    document.invalideprehomo = '';
    document.preciserprehomo = '';
    document.validehomo = '';
    document.invalidehomo = ''
    document.preciserhomo = '';
    document.download = '';
    document.upload = '';
    document.delete = '';
    document.receivedAt = '*';
    document.modifiedAt = '*';
    this.PRODUCTION_DOCUMENT.unshift(document);
  }

  private formatContractDocument() {
    let counter = 0;
    const documentPortals = [];
    this.CONTRACT_DOCUMENT.forEach((document) => {
      const portal = this.approvalDocumentPortalService.getValue(document.portalId);
      let documentPortal = portal ? portal : document.documentTitleName;
      documentPortal = this.getDocumentRange(documentPortals, documentPortal);
      document.docHierarchy = ['Eléments contractuels', documentPortal];
      document.download = `<span class="icon download"></span>`;
      document.upload = ``;
      document.delete = ``;
      counter++;
    });
    if(this.CONTRACT_DOCUMENT.length > 0){
      this.addFirstContractDocument();
    }
  }

  private formatSupportDocument() {
    let counter = this.CONTRACT_DOCUMENT.length + 1;
    const documentPortals = [];
    this.SUPPORTING_DOCUMENT.forEach((document) => {
      const portal = this.approvalDocumentPortalService.getValue(document.portalId);
      let documentPortal = this.getDocumentPortal(document, portal);
      documentPortal = this.getDocumentRange(documentPortals, documentPortal);
      document.docHierarchy = ['Pièces Justificatives', documentPortal];
      document.download = `<span class="icon download"></span>`;
      document.upload = `<span class="icon add d-block"></span>`;
      document.delete = `<span class="icon del"></span>`;
      counter++;
    });
    if(this.SUPPORTING_DOCUMENT.length > 0){
      this.addFirstSupportingDocument();
    }
  }
  private getDocumentRange(documentPortals: any[], documentPortal: any) {
    if (documentPortals.includes(documentPortal)) {
      const occurence = this.getDocumentPortalOccurence(documentPortals, documentPortal);
      documentPortals.push(documentPortal);
      documentPortal = `${documentPortal} (${occurence})`;
    }else {
      documentPortals.push(documentPortal);
    }
    return documentPortal;
  }

  getDocumentPortalOccurence(documentPortals: any[], documentPortal: any) {
    const clone = documentPortals.slice();
    return clone.filter(portal=> portal===documentPortal).length;
  }

  addFirstSupportingDocument() {
    const document = {} as any;
    document.docHierarchy = ['Pièces Justificatives'];
    document.id=0;
    document.valideprehomo = '';
    document.invalideprehomo = '';
    document.preciserprehomo = '';
    document.validehomo = '';
    document.invalidehomo = ''
    document.preciserhomo = '';
    document.download = '';
    document.upload = '';
    document.delete = '';
    document.receivedAt = '*';
    document.modifiedAt = '*';
    document.type = ApprovalDocumentType.SUPPORTING_DOCUMENT;
    this.SUPPORTING_DOCUMENT.unshift(document);
  }
  addFirstContractDocument() {
    const document = {} as any;
    document.docHierarchy = ['Eléments contractuels'];
    document.id=0;
    document.valideprehomo = '';
    document.invalideprehomo = '';
    document.preciserprehomo = '';
    document.validehomo = '';
    document.invalidehomo = ''
    document.preciserhomo = '';
    document.download = '';
    document.upload = '';
    document.delete = '';
    document.receivedAt = '*';
    document.modifiedAt = '*';
    this.CONTRACT_DOCUMENT.unshift(document);
  }
  getDocumentPortal(document , portal: string) {
      return portal ? portal:(document.documentTitleName ? document.documentTitleName:document.documentTitleName.documentTypeName);
  }
  getDocumentsByType(type: string){
    if(this.homologation && this.homologation.approvalDocuments){
      const approvalDocuments = this.homologation.approvalDocuments.slice();
      return approvalDocuments.filter(document=> document.type && document.type === type);
    }
    return [];
  }

  calculateRowHeightOfMasterDetail(): void {
    this.getRowHeight = (params) => {
        if (params.node) {
            const offset = 20;
            const lignes = params.data.delete.split(/\r\n|\r|\n/);
            let allDetailRowHeight = lignes.length;

            lignes.forEach((ligne: string) => {
                const snb = ligne.length / 60;
                if (snb > 1) {
                    allDetailRowHeight += snb - 1;
                }
            });
            return allDetailRowHeight * 20 + offset;
        }
        return null;
    };
}
dateFormatter(beginDate) {
  {
    if (beginDate === '*') {
      return ' ';
    }
    const date = this.dateFormatPipeFrench.transform(
      beginDate,
      'dd MMM yyyy'
    );
    return `${date} à ${this.datePipe.transform(beginDate , "HH'h'mm")}`;
  }
}

actionOnFile(param){
  if(param.column.colId === 'download'){
      this.downloadFile(this.customerNiche , param.data.filename);
  }
  if(param.column.colId === 'delete'){
    this.deleteFile(param.data.id);
  }
  if (param.column.colId === 'upload') {
    this.notificationService.setHomologation(this.homologation);
    this.notificationService.setcanalMotifHomologation(this.canalMotifHomologation);
    this.homologatioService.setDocumentToEdit(param.data);
    this.router.navigate(
      ['/customer-dashboard', this.customerId, 'detail', 'addDocumentDetail'],
      {
      queryParams: { typeCustomer: this.typeCustomer },    
      queryParamsHandling: 'merge',
      }
    );
 }
 this.handelClickOnRadioButton(param);
}
handelClickOnRadioButton(param: any) {
    if(param.column.colId === 'pre-homo-preciser' 
    || param.column.colId === 'pre-homo-valide'
    || param.column.colId === 'pre-homo-invalide'){
      this.rowData = this.changePreHomologationRadioButton(param.colDef.cellRendererParams.returnedValue , param.data.id)
    }
    if(param.column.colId === 'homo-preciser'
    || param.column.colId === 'homo-valide'
    || param.column.colId === 'homo-invalide'){
      this.rowData = this.changeHomologationRadioButton(param.colDef.cellRendererParams.returnedValue , param.data.id)
    }
}
changeHomologationRadioButton(returnedValue: any, id: any): any[] {
    return this.rowData.map(document=>{
      if( document && document.id === id){
        this.setNewIsValidatedHomologationInHomologationVO(id, returnedValue);
        return {...document , isValidatedHomologation:returnedValue}
      }
      return document
    });
}
changePreHomologationRadioButton(returnedValue: any, id: any) {
    return this.rowData.map(document=>{
      if( document && document.id === id){
        this.setNewIsValidatedPreHomologationInHomologationVO(id ,returnedValue);
        return {...document , isValidatedPreHomologation:returnedValue}
      }
      return document
    });
}
setNewIsValidatedHomologationInHomologationVO(id: any, returnedValue: any) {
  this.homologation.approvalDocuments.forEach(
    (document)=>{
    if( document && document.id === id){
      document.isValidatedHomologation=returnedValue
    }
  });
}
setNewIsValidatedPreHomologationInHomologationVO(id: any, returnedValue: any) {
    this.homologation.approvalDocuments.forEach(
      (document)=>{
      if( document && document.id === id){
        document.isValidatedPreHomologation=returnedValue;
      }
    });
}
deleteFile(id: any) {
  this.rowData = this.rowData.map(
    (document)=>{
      if(document.id === id){
        document.filename = null;
        document.name = null;
        document.isUploaded = false;
        if (!isNaN(document.documentTypeId) && document.documentTypeId !== 0){
          document.documentTitleId = null;
        }
        return document;
      }
      return document;
    }
  );
    this.addModificationToHomologation(id);
  }
  addModificationToHomologation(id) {
   this.homologation.approvalDocuments.forEach(
      (document)=>{
        if(document.id === id){
          document.filename = null;
          document.name = null;
          document.isUploaded = false;
          if (!isNaN(document.documentTypeId) && document.documentTypeId !== 0){
            document.documentTitleId = null;
          }
        }
      }
    );
  }
  downloadFile(customerNiche: string, fileName: string) {
    this.documentService.showAndDownloadFile(customerNiche , fileName).subscribe(
      (response)=>{
        const fileURL = URL.createObjectURL(response.body);
        window.open(fileURL, '_blank');
      },
      (error)=>{
        this.modalService.open(FileNotFoundPopupComponent, {
          centered: true,
        });
      }
    );
  }


}
