import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BillingService } from '../../../_core/services/billing.service';
import { DocumentService } from '../../../_core/services/documents-service';

import { CSS_CLASS_NAME } from '../../../_core/constants/constants';
import { CODE_NICHE_PARNASS,
         MESSAGE_EXCEL50D_WITH_ERROR, MESSAGE_EXCEL50D_WITHOUT_ERROR} from  '../../../_core/constants/bill-constant';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { DateFormatPipeFrench } from '../../../_shared/pipes';
import { LoadingFiftyRendererComponent } from '../loading-fifty-renderer/loading-fifty-renderer.component';
import { LoadingFiftyService } from './loading-fifty.service';

@Component({
  selector: 'app-loading-fifty-d',
  templateUrl: './loading-fifty-d.component.html',
  styleUrls: ['./loading-fifty-d.component.scss'],
  providers: [LoadingFiftyService],
  encapsulation: ViewEncapsulation.None
})
export class LoadingFiftyDComponent implements OnInit {

  rowData =[];
  getRowHeight ;
  loading = false;
  params: any;
  files: File[] = [];
  isError = false;
  error  = '';
  frameworkComponents: Object;
  detailCellRenderer: any;

  columnDefs = [
    {
      headerName: ' ',
      headerTooltip: 'arrow',
      cellRenderer: 'agGroupCellRenderer',
      sortable: false,
      field: 'arrow',
      minWidth: 35,
      maxWidth: 35,
    },
    {
      headerName: '',
      field: 'arrow',
      cellStyle: { 'margin-top': '2px' },
      minWidth: 45,
      maxWidth: 45,
      sortable: false,
    },
    {
      headerName: 'Date d’ajout',
      field: 'addDate',
      valueGetter: params => this.dateFormatPipeFrench.transform(params.data.addDate, 'dd MMM yyyy'),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      minWidth: 150,
      maxWidth: 150,
      sortable: false,
    },
    {
      headerName: 'Nom du fichier',
      field: 'fileName',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      minWidth: 250,
      maxWidth: 250,
      sortable: false,
    },
    {
      headerName: 'Nombre de factures OK',
      field: 'nbBillsSuccess',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      minWidth: 200,
      maxWidth: 200,
      sortable: false,
    },
    {
      headerName: 'Nombre de factures ko',
      field: 'nbBillsErrors',
      cellClass: 'ml-1',
      minWidth: 180,
      maxWidth: 180,
      sortable: false,
    },
    {
      headerName: 'Etat du fichier',
      headerTooltip: '',
      field: 'statut',
      cellRenderer: (params) =>  `<span class="icon ${this.loadingFiftyService.getIconStatus(params.data.nbBillsErrors)}"></span>`,
      minWidth: 150,
      maxWidth: 150,
      headerClass:['centerText'],
      cellClass: CSS_CLASS_NAME.TEXT_CENTER,
      sortable: false,
    },
    {
      headerName: '',
      headerTooltip: '',
      cellClass: 'ml-2',
      minWidth: 220,
      maxWidth: 220,
      sortable: false,
    },
    {
      headerName: '',
      headerTooltip: '',
      field: 'download',
      colId: 'download',
      cellRenderer: _params => '<span class="icon download"></span>',
      minWidth: 50,
      maxWidth: 50,
      headerClass: 'yess',
      cellClass: 'yess',
      sortable: false,
    },
  ];

  constructor(private readonly billService: BillingService,
    private readonly dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly documentService: DocumentService,
    private readonly loadingFiftyService:LoadingFiftyService) {
    this.calculateRowHeight();
    this.detailCellRenderer = 'detailCellRenderer';
    this.frameworkComponents = {
      detailCellRenderer: LoadingFiftyRendererComponent,

    };
  }

  ngOnInit(): void {
    this.getListExcel50D();
  }

  isRowMaster = (data) => {
    return !isNullOrUndefined(data) &&
    !isNullOrUndefined(data.nbBillsErrors) &&
    data.nbBillsErrors > 0 ;
  }

  getListExcel50D(): void {
    this.billService.getExcel50DByCodeNiche(CODE_NICHE_PARNASS).subscribe(data => {
      this.rowData = data;
      if(!isNullOrUndefined(data)) {
        this.rowData.forEach(item=> {
          item.arrow = '';
        });
      }
    },
    (error) => {
         this.rowData = [];
    },
    () => {
        this.initRerfreshAgGrid();
    });
  }

  onSelectFile(event): void {
    this.files.push(...event.addedFiles);
    this.loading = true;
    this.billService.saveFileExcel50D(this.files[0], this.files[0].name).subscribe(data => {
      if(!isNullOrUndefined(data) &&
         !isNullOrUndefined(data.excel50Djson) &&
         !isNullOrUndefined(data.excel50Djson.excel50D.errorMessage)) {
        this.isError = true;
        const message = data.excel50Djson.excel50D.errorMessage;
        if(message === this.loadingFiftyService.getMessageAlreadyExist(this.files[0].name, false)) {
          this.error = this.loadingFiftyService.getMessageAlreadyExist(this.files[0].name, true);
        } else if( message === this.loadingFiftyService.getMessageCheckCodeNiche(
           this.files[0].name.substring(16,19), true)){
           this.error  = this.loadingFiftyService.getMessageCheckCodeNiche(
           this.files[0].name.substring(16,19), false);
        } else {
          this.error = message;
        }
      } else if(!isNullOrUndefined(data) &&
                !isNullOrUndefined(data.excel50Djson) &&
                !isNullOrUndefined(data.excel50Djson.excel50D)){
                this.isError = false;
                this.error = '';
                if(data.excel50Djson.excel50D.nbBillsErrors > 0) {
                this.loadingFiftyService.openSnackBarError(MESSAGE_EXCEL50D_WITH_ERROR);
                } else {
                this.loadingFiftyService.openSnackBarSuccess(MESSAGE_EXCEL50D_WITHOUT_ERROR);
               }
        this.getListExcel50D();
      }
    },
    (error) => {
      this.loading = false;
      this.files = [];
    },
    () => {
      this.loading = false;
      this.files = [];
    });
  }

  onRemoveFile(file: File): void {
    this.files.splice(this.files.indexOf(file), 1);
  }

  calculateRowHeight(): void {
    this.getRowHeight = (params) => {
      if (params.node && params.node.level === 0) {
        return 35;
      }
      return null;
    };
  }

private initRerfreshAgGrid(){
  this.params = {
    force: true,
    suppressFlash: true,
  };
}


downloadExcel50D(filName: string): void  {
  this.documentService.downloadExcel50D(filName).subscribe(data => {
    this.documentService.onSsuccessFileTreatement(data, filName)
  },
    (error) => {
     this.documentService.onErrorFileTreatement();
  });
  }

  clickCell(event: any): void {
    if (event.column.colId === 'download') {
      this.downloadExcel50D(event.data.fileName);
    }
  }

}
