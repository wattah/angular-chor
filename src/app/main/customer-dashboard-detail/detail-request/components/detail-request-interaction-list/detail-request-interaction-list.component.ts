import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { InteractionLight } from '../../../../../_core/models/interaction-vo';
import { DateFormatPipeFrench } from '../../../../../_shared/pipes';
import { getDefaultStringEmptyValue, isNullOrUndefined } from '../../../../../_core/utils/string-utils';
import { firstNameFormatter, toUpperCase } from '../../../../../_core/utils/formatter-utils';
import { Router } from '@angular/router';
import { RequestCustomerVO } from '../../../../../_core/models/request-customer-vo';
import { RequestAnswersVO } from 'src/app/_core/models/request-answers-vo';
import { InteractionsService } from '../../../../../main/interaction/interactions.service';
import { dateComparator } from 'src/app/_core/utils/date-utils';

@Component({
  selector: 'app-detail-request-interaction-list',
  templateUrl: './detail-request-interaction-list.component.html',
  styleUrls: ['./detail-request-interaction-list.component.scss']
})
export class DetailRequestInteractionListComponent implements OnChanges {

  @Input() interactions: InteractionLight[];
  customerDashboard = '/customer-dashboard';
  @Input() customerId: number;
  @Input() requestAnswers: RequestAnswersVO[];
  @Input()
  detailRequest: RequestCustomerVO;
  idRequest: number;
  requestTypeId: number;
  universId: number;
  defaultSortModel;
  columnDefs;
  isDetailRequestReady: boolean = false;

  constructor(private readonly router: Router,
              private readonly dateFormatPipeFrench: DateFormatPipeFrench,
              private readonly interactionsService: InteractionsService,
              private readonly datePipe: DatePipe) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['detailRequest'] && !isNullOrUndefined(this.detailRequest))) {
      this.requestTypeId = this.detailRequest.requestTypeId;
      this.universId = this.detailRequest.universId;
      this.idRequest = this.detailRequest.idRequest;
        this.defaultSortModel = [
          { colId: 'creeLe', sort: 'desc' }
        ];
      this.setColumnRef();
      this.isDetailRequestReady = true;
    }
  }

  setColumnRef(): void {
    this.columnDefs = [
      {
        headerName: 'CRÉÉE LE',
        headerTooltip: 'CRÉÉE LE',
        field: 'creeLe',
        comparator: dateComparator,
        valueGetter: params => {
          if (params.data.creeLe === 'null') {
            return '-';
          }
          return `${this.dateFormatPipeFrench.transform(params.data.creeLe, 'dd MMM yyyy')}
              - 
            ${this.datePipe.transform(params.data.creeLe , "HH'h'mm")}`;
        },
        cellClass: 'cell-wrap-text',
        autoHeight: true,
        width: 140
      },
      {
        headerName: 'MÉDIA',
        headerTooltip: 'MÉDIA',
        field: 'media',
        valueGetter: params => getDefaultStringEmptyValue(params.data.media),
        width: 140,
        cellClass: 'cell-wrap-text',
        autoHeight: true,
        sortable: false
      },
      {
        headerName: 'INTERACTION (MOTIF)',
        headerTooltip: 'INTERACTION (MOTIF)',
        field: 'interactionMotif',
        valueGetter: params => `${getDefaultStringEmptyValue(params.data.interactionMotifParent)} > ${getDefaultStringEmptyValue(params.data.interactionMotif)}`,
        width: 160,
        cellClass: 'cell-wrap-text',
        autoHeight: true,
        sortable: false
      },
      {
        headerName: 'CRÉÉE PAR',
        headerTooltip: 'CRÉÉE PAR',
        field: 'numberMouvement',
        valueGetter: params => `${toUpperCase(params.data.lastNameCreePar)} ${firstNameFormatter(params.data.firstNameCreePar)}`,
        width: 160,
        cellClass: 'cell-wrap-text',
        autoHeight: true,
        sortable: false
      },
      {
        headerName: '',
        field: 'update',
        cellRenderer: params => (!params.data.isAutomatic) ? `<span class='icon pen athena' ></span>` : '',
        cellClass: 'text-center',
        sortable: false,
        width: 80
      }
    ];
  }

  clickCell(params: any): void {
    if (params.column.colId === 'update') {
      this.interactionsService.navigateToInteractionModificationPage(this.router,this.customerId, this.detailRequest.idRequest, params.data.interactionId, 'request');
    } else {
      this.interactionsService.navigateToDetailInteractionPageByType(this.router,this.customerId, this.detailRequest.idRequest, params.data.interactionId); 
    }
  }

}
