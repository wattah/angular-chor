import { RedirectionService } from './../../../../_core/services/redirection.service';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { COLOR_TYPE_CUSTOMER, CSS_CLASS_NAME, DEFAULT_STRING_EMPTY_VALUE, TARGET_TYPE_DOCUMENT } from '../../../../_core/constants/constants';
import { DocumentSearchCriteria } from '../../../../_core/models/document-search-criteria';
import { DocumentVO } from '../../../../_core/models/documentVO';
import { DocumentService } from '../../../../_core/services/documents-service';
import { dateComparator } from '../../../../_core/utils/date-utils';
import { getDecryptedValue } from '../../../../_core/utils/functions-utils';
import { getDefaultStringEmptyValue, isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { CheckboxCellRendererAgGridComponent } from '../../../../_shared/components';
import { DateFormatPipeFrench } from '../../../../_shared/pipes';
import { DocumentListService } from './document-list.service';

@Component({
  selector: 'app-document-full-list',
  templateUrl: './document-full-list.component.html',
  styleUrls: ['./document-full-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentFullListComponent implements OnInit {

  customerId: string;
  
  @Input()
  listDocumentCustomer: DocumentVO[] = [];

  nicheIdentif: string;

  typeCustomer: string;

  types = [];

  documentSearchCriteria: DocumentSearchCriteria;

  frameworkComponents = {
    checkboxCellRendererComponent: CheckboxCellRendererAgGridComponent
  };

  columnDefs = [
    {
      headerName: 'TYPE', headerTooltip: 'TYPE', field: 'typeDocument',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 160, autoHeight: true,
      valueGetter: params => (!isNullOrUndefined(params.data)) ? getDefaultStringEmptyValue(params.data.typeDocument) : ''
    },
    {
      headerName: 'TITRE DU DOCUMENT', headerTooltip: 'TITRE DU DOCUMENT', field: 'title',
      valueGetter: params => (!isNullOrUndefined(params.data)) ? 
        (!isNullOrUndefined(params.data.titreDocument)) ? params.data.titreDocument : getDefaultStringEmptyValue(params.data.title)
        : '',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, autoHeight: true, width: 250
    },
    {
      headerName: 'NOM DU FICHIER', headerTooltip: 'NOM DU FICHIER', field: 'fileName',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 150, autoHeight: true, sortable: false,
      valueGetter: params => (!isNullOrUndefined(params.data)) ? getDefaultStringEmptyValue(params.data.fileName) : ''
    },
    {
      headerName: 'N° demande', headerTooltip: 'N° demande', colId: 'requestId',
      cellClass: (params) => [CSS_CLASS_NAME.CELL_WRAP_TEXT, (!isNullOrUndefined(params.data)) ? (params.data.targetType === TARGET_TYPE_DOCUMENT.REQUEST) ? 'link' : '' : '' ],
      valueGetter: (params) => ((!isNullOrUndefined(params.data)) && params.data.targetType === TARGET_TYPE_DOCUMENT.REQUEST) ? params.data.targetId : DEFAULT_STRING_EMPTY_VALUE,
      width: 130, autoHeight: true, sortable: false
    },
    {
      headerName: 'Parcours', headerTooltip: 'Parcours', cellClass: [CSS_CLASS_NAME.CELL_WRAP_TEXT ],
      valueGetter:  params => (!isNullOrUndefined(params.data)) ? getDefaultStringEmptyValue(params.data.requestType) : '',
      width: 170, autoHeight: true, sortable: false
    },
    {
      headerName: 'AJOUTÉ LE', headerTooltip: 'AJOUTÉ LE', field: 'addDate', comparator: dateComparator,
      valueGetter: params => (!isNullOrUndefined(params.data)) ? this.dateFormatPipeFrench.transform(params.data.addDate) : '',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 140 , autoHeight: true
    },
    {
      headerName: 'Visible portail', headerTooltip: 'Visible portail',
      colId: 'portail', cellRenderer: 'checkboxCellRendererComponent',
      width: 120 , sortable: false, cellClass: CSS_CLASS_NAME.TEXT_CENTER
    },
    {
      headerName: '', headerTooltip: '', colId: 'download',
      width: 50, autoHeight: true, sortable: false,
      cellRenderer: (params) => !isNullOrUndefined(params.data) && this.redirectionService.hasPermission('telechargement_document') ? `<span class='icon download' ></span>` : ``
    },
    {
      headerName: '', headerTooltip: '', colId: 'delete',
      width: 50, autoHeight: true, sortable: false,
      cellRenderer: (params) => this.renderDeleteBotton(params)
    }
  ];

  defaultSortModel: any[];

  datasource: any;

  totalItems = 0;

  paginationPageSize = 20;

  isDataReady;
  params: { force: boolean; suppressFlash: boolean; };
  /**********************************************
  *  TABLE SECTION END                        *
  * ********************************************/

  constructor(private readonly route: ActivatedRoute, private readonly documentListService: DocumentListService,
    private readonly documentService: DocumentService, private readonly dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly redirectionService: RedirectionService) {}

  private renderDeleteBotton(params: any) {
    return (!isNullOrUndefined(params.data) && !params.data.readOnly && this.redirectionService.hasPermission('suppression_document')) ? `<span class='icon del' ></span>` : ``;
  }

  ngOnInit(): void {

    this.defaultSortModel = [
      { colId: 'addDate', sort: 'desc' }
    ];
    this.route.parent.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.route.queryParamMap.subscribe( params => {
      this.typeCustomer = params.get('typeCustomer');
    });
    this.route.data.subscribe(resolversData => {
      this.types = resolversData['documentsType']; 
    });

    this.redirectionService.getAgGridLoader().subscribe((load) => {
      if (load) {
        this.params = {
          force: true,
          suppressFlash: true,
        };
      }
    });

  }

  clickedCell(params: any ): void {
    const colId = params.column.colId;
    if ( colId === 'download' && this.redirectionService.hasPermission('telechargement_document')) {
      this.downloadDocument(params.data);
    } else if ( colId === 'requestId') {
      this.goToRequestDetail(params.data.requestId);
    } else if ( colId === 'delete' && this.redirectionService.hasPermission('suppression_document')) {
      this.showPopUpDeleteDocument(params.data);
    } 
  }

  /**
   * telechargement document
   */
  downloadDocument(doc: DocumentVO): void {
    this.documentListService.downloadDocument(doc);   
  }

  goToRequestDetail(requestId: number): void {
    this.documentListService.goToRequestDetail(requestId, this.customerId, this.typeCustomer );   
  }

  showPopUpDeleteDocument(doc: DocumentVO): void {
    this.documentListService.showPopUpDeleteDocument(doc, () => this.createServerSideDatasource(null));
  }

  changeProtailVisibility(doc: DocumentVO): void {
    this.documentListService.changeProtailVisibility(doc, () => this.createServerSideDatasource(null));
  }

  getClassEnvByTypeCustomer(): string {
    return `env-${COLOR_TYPE_CUSTOMER[this.typeCustomer]}`;
  }

  launchSearch(doc: DocumentSearchCriteria): void {
    this.documentSearchCriteria = {
      ...doc,
      targetId: getDecryptedValue(this.customerId),
      targetType: TARGET_TYPE_DOCUMENT.CUSTOMER
    };
    this.createServerSideDatasource(null);
  }
  createServerSideDatasource(_event: any): void {
    this.isDataReady = false;
    this.datasource = {
      getRows: (params) => {
        const docCR = this.buildDocumentSearchCriteria(params.request);
        this.documentService.documentsMonitoring(docCR).subscribe(data => {
          this.totalItems = data.total;
          this.isDataReady = true;
          params.success({ rowData: data.items, rowCount: data.total });
        },
        (_error) => {
          params.fail();
        }
        );
      }
    };
  }

  buildDocumentSearchCriteria(params: any): DocumentSearchCriteria {
    return {
      ...this.documentSearchCriteria,
      page : params && params.startRow > 0 ? params.startRow / this.paginationPageSize : 0,
      pageSize : this.paginationPageSize,
      sortField : params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].colId : 'addDate',
      sortOrder : params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].sort : 'DESC'
    };
  }
}
