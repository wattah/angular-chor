import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DocumentVO } from '../../../../../_core/models/documentVO';
import { DocumentService } from '../../../../../_core/services/documents-service';
import { dateComparator } from '../../../../../_core/utils/date-utils';
import { getDefaultStringEmptyValue, isNullOrUndefined } from '../../../../../_core/utils/string-utils';
import { DateFormatPipeFrench } from '../../../../../_shared/pipes';
import { DocumentListService } from '../../../../customer-dashboard/_shared/document-full-list/document-list.service';
import { CSS_CLASS_NAME } from '../../../../../_core/constants/constants';

@Component({
  selector: 'app-detail-request-document-list',
  templateUrl: './detail-request-document-list.component.html',
  styleUrls: ['./detail-request-document-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailRequestDocumentListComponent {

  @Input() customerId: number;
  @Input() idRequest: number;
  @Input() documents = [];

  defaultSortModel = [
    { colId: 'addDate', sort: 'desc' }
  ];
  columnDefs = [
    {
      headerName: 'portail', headerTooltip: 'Visible portail', filed: 'isAccessibleFromPortal',
      comparator: this.visibilityComparator,
      colId: 'portail', cellRenderer: 'checkboxCellRendererComponent',
      width: 100 , cellClass: CSS_CLASS_NAME.TEXT_CENTER
    },
    {
      headerName: 'FORMAT', headerTooltip: 'FORMAT', colId: 'format',
      field: 'fileName',
      comparator: this.formatComparator,
      cellRenderer: (params) => {
        if(params.data.fileName){
          let extension = params.data.fileName.split('.')[1].toLowerCase();
          extension = this.getImageByFormat(extension);
          return `<span class='icon icon-max ${extension}'></span>`;
        }
        return ``;
      },
      cellClass:  CSS_CLASS_NAME.TEXT_CENTER, width: 100, autoHeight: true
    },
    {
      headerName: 'TYPE', headerTooltip: 'TYPE', field: 'typeDocument',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 180, autoHeight: true,
      valueGetter: params => (!isNullOrUndefined(params.data)) ? getDefaultStringEmptyValue(params.data.typeDocument) : ''
    },
    {
      headerName: 'TITRE DU DOCUMENT', headerTooltip: 'TITRE DU DOCUMENT', field: 'title',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, autoHeight: true, width: 200,
      valueGetter: params => (!isNullOrUndefined(params.data)) ? 
        (!isNullOrUndefined(params.data.titreDocument)) ? params.data.titreDocument : getDefaultStringEmptyValue(params.data.title)
        : ''
    },
    {
      headerName: 'AJOUTÉ LE', headerTooltip: 'AJOUTÉ LE', field: 'addDate', comparator: dateComparator,
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 140 , autoHeight: true,
      valueGetter: params => (!isNullOrUndefined(params.data)) ? this.dateFormatPipeFrench.transform(params.data.addDate) : '',
    },
    {
      headerName: '', headerTooltip: '', colId: 'download',
      width: 50, autoHeight: true, sortable: false,
      cellRenderer: () => `<span class='icon download' ></span>`
    },
    {
      headerName: '', headerTooltip: '', colId: 'delete',
      width: 50, autoHeight: true, sortable: false,
      cellRenderer: () => `<span class='icon del'></span>`
    }
  ];  
  
  constructor(private readonly route: ActivatedRoute, private readonly documentListService: DocumentListService,
    private readonly documentService: DocumentService, private readonly dateFormatPipeFrench: DateFormatPipeFrench) {}
  
  clickedCell(params: any ): void {
    const colId = params.column.colId;
    if ( colId === 'download') {
      this.documentListService.downloadDocument(params.data); 
    } else if ( colId === 'delete') {
      this.documentListService.showPopUpDeleteDocument(params.data, () => this.fetchDocuments());
    } 
  }

  changeProtailVisibility(doc: DocumentVO): void {
    this.documentListService.changeProtailVisibility(doc, () => this.fetchDocuments());
  }

  getImageByFormat(ext: string): string {
    return this.documentListService.getImageByFormat(ext);
  }

  formatComparator(fileName1: string, fileName2: string): number {
    const format1 = fileName1.split('.')[1];
    const format2 = fileName2.split('.')[1];
    return format1.localeCompare(format2) * -1;
  }

  visibilityComparator(_vis1: boolean , _vis2: boolean, d1: any , d2: any): number {
    const v1 = Boolean(d1.data.isAccessibleFromPortal);
    const v2 = Boolean(d2.data.isAccessibleFromPortal);
    const acc1 = Boolean(d1.data.isAnAuthorizedType);
    const acc2 = Boolean(d2.data.isAnAuthorizedType);
    if (!acc1 || ! acc2) { 
      return 1; 
    }
    return String(v1).localeCompare(String(v2));
  }

  fetchDocuments(): void {
    this.documentService.getRequestDocuments(this.idRequest).subscribe( data => this.documents = data);
  }

}
