import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InteractionsService } from '../../../main/interaction/interactions.service';
import { dateComparator } from '../../../_core/utils/date-utils';
import { fullNameFormatter } from '../../../_core/utils/formatter-utils';
import { getEncryptedValue, getImageByTypeCustomer, getPersonNameOfCustomer, getTypeCustomer } from '../../../_core/utils/functions-utils';
import { getDefaultStringEmptyValue } from '../../../_core/utils/string-utils';
const TYPE = 'TYPE';
@Component({
  selector: 'list-interaction-ag-grid',
  templateUrl: './list-interaction-ag-grid.component.html',
  styleUrls: ['./list-interaction-ag-grid.component.scss']
})

export class ListInteractionAgGridComponent {

  @Input() interactions;

  defaultSortModel = [ { colId: 'createdAt', sort: 'desc' } ];
  picto = 'picto';
 
  columnDefs = [
    {
      headerName: TYPE,
      field: this.picto,
      width: 120,
      minWidth:120,
      sortable: true,
      cellRenderer: params => this.getPathPicto(params),
      comparator: (p1, p2) => this.typeComparator(p1, p2),
    },
    {
      headerName: 'Membre',
      colId: 'membre',
      valueGetter: params => getPersonNameOfCustomer(params.data.categoryCustomer, params.data.crmNameRecipient, params.data.firstNameRecipient, params.data.lastNameRecipient),
      width: 130,
      minWidth: 130,
      cellStyle: { 'text-decoration': 'underline' } ,
    },
    {
      headerName: 'Créée le ',
      field: 'createdAt',
      width: 160,
      minWidth: 160,
      valueGetter: params => this.interactionsService.displayCreationDateOfInteraction(params.data.createdAt),
      comparator: dateComparator,
    },
    {
      headerName: 'Créée par ',
      field: 'lastNameCreator',
      valueGetter: params => fullNameFormatter(null, params.data.firstNameCreator, params.data.lastNameCreator),
      width: 190,
      minWidth: 190,
    },
    {
      headerName: 'N° Demande ',
      field: 'requestId',
      width: 120,
      minWidth: 120,
      cellStyle: { 'text-decoration': 'underline' }
    },
    {
      headerName: "Parcours",
      field: 'requestLabel',
      valueGetter: params => getDefaultStringEmptyValue(params.data.requestLabel),
      width: 150,
      minWidth: 150,
    },
    {
      headerName: "Motif",
      valueGetter: params => this.interactionsService.displayMotifInteraction(params.data.reasonParent, params.data.reason),
      width: 280,
      minWidth:280,
    },
    {
      headerName: '',
      field: 'update',
      colId: 'update',
      Width: 70,
      cellRenderer: params => (!params.data.isAutomatic) ? `<span class='icon pen athena' ></span>` : '',
      cellClass: 'text-center',
    }
  ];
  
  constructor(private readonly interactionsService: InteractionsService, private readonly router: Router ){}

  clickedCell(params: any): void {
    this.interactionsService.openLinkedPagesOfINteractionInNewTab(this.router, params);
  }

  private typeComparator(typePerson1: string, typePerson2: string): number {
    return typePerson1.localeCompare(typePerson2) * -1;
  }
  getPathPicto(params: any) {
    return params && params.data ? `<img src='assets/svg/${params.data.picto}' style="margin-bottom: 5px"  
            alt='${params.data.picto}' title='${params.data.picto}' />`:'-';
  }
}
