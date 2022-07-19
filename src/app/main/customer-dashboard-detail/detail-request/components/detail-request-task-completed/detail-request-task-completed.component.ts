import { TaskAnwsersHolderService } from './task-anwsers-holder.service';
import { TaskCompletedAnwserCellRenderComponent } from './task-completed-anwser-cell-render/task-completed-anwser-cell-render.component';
import { Router } from '@angular/router';
import { fullNameFormatter } from './../../../../../_core/utils/formatter-utils';
import { dateComparator } from './../../../../../_core/utils/date-utils';
import { TaskAnswerVO } from './../../../../../_core/models';
import { TaskLight } from './../../../../../_core/models/task-customer-vo';
import { DatePipe } from '@angular/common';
import { DateFormatPipeFrench } from './../../../../../_shared/pipes';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { getDefaultStringEmptyValue, isNullOrUndefined } from './../../../../../_core/utils/string-utils';
import { ToggleLinkTaskCompletedRendererComponent } from '../toggle-link-task-completed-renderer/toggle-link-task-completed-renderer.component';
import { TaskAnswersService } from './../../../../../_core/services';


@Component({
  selector: 'app-detail-request-task-completed',
  templateUrl: './detail-request-task-completed.component.html',
  styleUrls: ['./detail-request-task-completed.component.scss'],
  providers: [TaskAnwsersHolderService]
})
export class DetailRequestTaskCompletedComponent implements OnInit , OnChanges {
  defaultSortModel;
  params: any;
  frameworkComponents: any;
  @Input() completedTasks: TaskLight[];
  @Input() customerId: number;
  @Input() idRequest: number;
  @Input() requestStatus: string;
  @Input() isClosed: boolean;
  @Input() hasIncompletedTasks: boolean;
  tasksAnwsers: TaskAnswerVO[];
  private readonly realEndDateColId = 'realEndDate';

  private readonly sortModeDesc = 'desc';
  private readonly addTaskClassName = 'add-task';
  private readonly customerDashboard = '/customer-dashboard';
  isDetailRequestReady: boolean;
  private readonly pendingStatus = 'PENDING';
  detailCellRenderer = 'detailCellRenderer';
  constructor(private readonly dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly datePipe: DatePipe,
    private readonly taskAnswerService: TaskAnswersService,
    private readonly router: Router) {
     this.frameworkComponents = { 
      ToggleLinkCellRenderer: ToggleLinkTaskCompletedRendererComponent,
      detailCellRenderer: TaskCompletedAnwserCellRenderComponent
     }
   }

  ngOnChanges(changes: SimpleChanges){
    if ((changes['customerId'] && !isNullOrUndefined(this.customerId)) && (changes['idRequest'] && !isNullOrUndefined(this.idRequest))) {
      this.isDetailRequestReady = true;
    }
    if(changes['isClosed'] && this.isClosed){
      this.requestStatus = this.pendingStatus;
    }
  }


  ngOnInit() {
    this.defaultSortModel = [
      { colId: this.realEndDateColId, sort: this.sortModeDesc }
    ];
    
  }

  columnDefs = [
    {
      headerName: 'CRÉÉE LE',
      headerTooltip: 'CRÉÉE LE',
      field: 'createdDate',
      valueGetter: params => this.formatDate(params.data.createdDate),
      autoHeight: true,
      cellClass:['unselectable','cell-wrap-text'],
      width: 75,
    },
    {
      headerName: 'TÂCHE',
      headerTooltip: 'TÂCHE',
      field: 'tache',
      width: 100,
      autoHeight: true,
      cellClass:['unselectable','cell-wrap-text'],
      cellRenderer: params => this.addPlusIconBeforeManualleTaskName(params),
      sortable: false,
    },
    {
      headerName: 'Cloturée par',
      headerTooltip: 'Cloturée par',
      field: 'cloturePar',
      width: 120,
      autoHeight: true,
      cellClass:['unselectable','cell-wrap-text'],
      sortable: false,
      valueGetter: params => {
          const fullName = fullNameFormatter(
        null,
    params.data.closedByFirstName,
    params.data.closedByLastName
      );
      return fullName && fullName.trim().length !== 0 ? fullName:'-'
    }
    },
    {
      headerName: 'Cloturée le',
      headerTooltip: 'Cloturée le',
      field: this.realEndDateColId,
      valueGetter: params => this.formatDate(params.data.realEndDate),
      comparator: dateComparator,
      width: 100,
      cellClass:['unselectable','cell-wrap-text'],
      autoHeight: true,
    },
    {
      headerName: 'Détail',
      headerTooltip: 'Détail',
      width: 160,
      autoHeight: true,
      cellRenderer: 'ToggleLinkCellRenderer',
      field: 'detail',
      sortable: false,
      cellRendererParams: {
      clicked: function() {
      }
     }
    }
  ];

  clickCell(params: any): void {
    if (params.column.colId === 'detail') {
      params.node.setExpanded(!params.node.expanded)
    }else{
      this.router.navigate(
        [this.customerDashboard, this.customerId, 'request', this.idRequest, 'task-details', params.data.id],
        { queryParamsHandling: 'merge' }
      );
    }
  }

  formatDate(date: string) {
    if (!date) {
      return '-';
    }
    return `${this.dateFormatPipeFrench.transform(date, 'dd MMM yyyy')}
      - 
      ${this.datePipe.transform(date , "HH'h'mm")}`;
  }

  addPlusIconBeforeManualleTaskName(params: any) {
    const icon = params.data.thetisTaskId
    const taskName = getDefaultStringEmptyValue(params.data.taskPending);
    return !icon ? `${this.createSpanElement(this.addTaskClassName)} ${taskName}`:taskName;
  }

  createSpanElement(className: string) {
    return `<span class="icon ${className}"></span>`;
  }
}
