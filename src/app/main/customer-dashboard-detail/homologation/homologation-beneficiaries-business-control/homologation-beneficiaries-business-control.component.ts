import { Component, Input, ViewEncapsulation, OnInit, EventEmitter, Output } from '@angular/core';

import { CSS_CLASS_NAME } from '../../../../_core/constants/constants';
import { HomologationParticipantVO, HomologationVO } from '../../../../_core/models';
import { fullNameFormatter } from '../../../../_core/utils/formatter-utils';
import { DatePickerComponent } from '../../../../_shared/components/athena-ag-grid/date-renderer.component';
import { RadioButtonRendererComponent } from '../../../../_shared/components/athena-ag-grid/radio-button-renderer.component';
import { isNullOrUndefined, getDefaultStringEmptyValue } from '../../../../_core/utils/string-utils';

@Component({
  selector: 'app-homologation-beneficiaries-business-control',
  templateUrl: './homologation-beneficiaries-business-control.component.html',
  styleUrls: ['./homologation-beneficiaries-business-control.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomologationBeneficiariesBusinessControlComponent implements OnInit {
  
  @Output() onChangebeneficiaries = new EventEmitter<Partial<HomologationParticipantVO>[]>();

  @Input()  homologation: HomologationVO;
  
  redrawDetailsRows;

  resize;

  params: any;
  
  frameworkComponents: Object;
  
  columnDefs = [
    {
      headerName: '',
      children: [
        {
          headerName: 'Membre',
          headerClass: ['borderRight'],
          cellClass: ['borderRight'],
          sortable: false,
          valueFormatter: (params) => fullNameFormatter(null, params.data.firstname, params.data.lastname),
          width: 200
        }
      ]
    },
    {
      headerName: 'Pré-homologation',
      marryChildren: true,
      children: [
        {
          headerName: 'validé',
          headerClass: ['centerround'],
          field: 'prehomologationDecision',
          colId: 'prehomologation-decision-valide',
          cellClass: CSS_CLASS_NAME.TEXT_CENTER,
          sortable: false,
          valueFormatter: params => (isNullOrUndefined(params.data.prehomologationDecision)) ? null : params.data.prehomologationDecision,
          cellRenderer: 'radioButton',
          cellRendererParams: {
            prefixId: 'pre-homo-valide',
            prefixName: 'pre-homo',
            returnedValue: true
          },
          width: 80
        },
        {
          headerName: 'refusé',
          field: 'prehomologationDecision',
          colId: 'prehomologation-decision-invalide',
          headerClass: 'centerround',
          cellClass: CSS_CLASS_NAME.TEXT_CENTER,
          sortable: false,
          valueFormatter: params => (isNullOrUndefined(params.data.prehomologationDecision)) ? null : !params.data.prehomologationDecision,
          cellRenderer: 'radioButton',
          cellRendererParams: {
            prefixId: 'pre-homo-in-valide',
            prefixName: 'pre-homo',
            returnedValue: false
          },
          width: 80
        },
        {
          headerName: 'Commentaire',
          field: 'prehomologationComment',
          editable: true,
          cellClass: 'break-word',
          sortable: false,
          valueFormatter: params => getDefaultStringEmptyValue(params.data.prehomologationComment),
          cellEditor: 'agLargeTextCellEditor',
          cellEditorParams: (params) => {
            return {
              maxLength: 1000,
              rows: this.calculeRowsInComment(params.data.prehomologationComment),
              cols: 80
            };
          },
          suppressKeyboardEvent: (params) => this.suppressKeyboardEvent(params),
          onCellValueChanged : (_event: any): void => {
            this.resize = this.doResize();
            this.onChangebeneficiaries.emit(this.homologation.beneficiaires);
          },
          width: 240
        },
        {
          headerName: 'Date',
          headerClass: 'borderRight',
          field: 'prehomologationDecisionDate',
          sortable: false,
          cellRenderer: 'datePicker',
          cellStyle: { 'border-right': '1px solid #dadada !important' },
          width: 140
        }
      ]
    },
    {
      headerName: 'Homologation',
      headerClass: 'noborder',
      marryChildren: true,
      children: [
        {
          headerName: 'validé',
          headerClass: 'centerround',
          field: 'homologationDecision',
          colId: 'homologation-decision-valide',
          cellClass: CSS_CLASS_NAME.TEXT_CENTER,
          sortable: false,
          valueFormatter: params => (isNullOrUndefined(params.data.homologationDecision)) ? null : params.data.homologationDecision,
          cellRenderer: 'radioButton',
          cellRendererParams: {
            prefixId: 'homo-valide',
            prefixName: 'homo',
            returnedValue: true
          },
          width: 80
        },
        {
          headerName: 'refusé',
          field: 'homologationDecision',
          colId: 'homologation-decision-invalide',
          headerClass: 'centerround',
          cellClass: CSS_CLASS_NAME.TEXT_CENTER,
          sortable: false,
          valueFormatter: params => (isNullOrUndefined(params.data.homologationDecision)) ? null : !params.data.homologationDecision,
          cellRenderer: 'radioButton',
          cellRendererParams: {
            prefixId: 'homo-in-valide',
            prefixName: 'homo',
            returnedValue: false
          },
          width: 80
        },
        {
          headerName: 'Commentaire',
          field: 'homologationComment',
          editable: true,
          cellClass: 'break-word',
          valueFormatter: params => getDefaultStringEmptyValue(params.data.homologationComment),
          cellEditor: 'agLargeTextCellEditor',
          sortable: false,
          cellEditorParams: (params) => {
            return {
              maxLength: 1000,
              rows: this.calculeRowsInComment(params.data.homologationComment),
              cols: 80
            };
          },
          suppressKeyboardEvent: (params) => this.suppressKeyboardEvent(params),
          onCellValueChanged : (_event: any): void => {
            this.resize = this.doResize();
            this.onChangebeneficiaries.emit(this.homologation.beneficiaires);
          },
          width: 240
        },
        {
          headerName: 'Date',
          field: 'homologationDecisionDate',
          sortable: false,
          cellStyle: { 'border-right': '1px solid #dadada !important' },
          cellRenderer: 'datePicker',
          width: 140
        }
      ]
    }
  ];

  constructor() {
    this.frameworkComponents = { 
      datePicker: DatePickerComponent,
      radioButton: RadioButtonRendererComponent
    };
  }

  ngOnInit(): void {
    this.params = { force: true, suppressFlash: true };
    if(this.homologation && this.homologation.beneficiaires){
      this.onChangebeneficiaries.emit(this.homologation.beneficiaires);
    }
  }

  changeCell(params: any): void { 
    
    if ( params.column.colId === 'prehomologation-decision-valide' || params.column.colId === 'prehomologation-decision-invalide' ) {
      this.homologation.beneficiaires = this.updateBeneficiaryLineInChangeRadio(false, params.rowIndex, params.returnedValue); 
    }

    if ( params.column.colId === 'homologation-decision-valide' || params.column.colId === 'homologation-decision-invalide' ) {
      this.homologation.beneficiaires = this.updateBeneficiaryLineInChangeRadio(true, params.rowIndex, params.returnedValue);
    } 
    
    if (params.column.colId === 'homologationDecisionDate' || params.column.colId === 'prehomologationDecisionDate' ) {
      this.resize = this.doResize();
      this.onChangebeneficiaries.emit(this.homologation.beneficiaires);
    }

    this.params = { force: true, suppressFlash: true };
  }

  /**
   * @description radio valide/ivalide changes 
   * @param isHomologation (true => homologation) ( false => prehomologation)
   * @param rowIndex (index of row)
   * @param returnedValue (newValue to set)
   */
  updateBeneficiaryLineInChangeRadio(isHomologation: boolean, rowIndex: number, returnedValue: any): HomologationParticipantVO[] {
    return this.homologation.beneficiaires.map( (row, index) => {
      if (index === rowIndex) {
        if (isHomologation) { 
          return { ...row, homologationDecisionDate : new Date() , homologationDecision: Boolean(returnedValue) };
        }
        return { ...row, prehomologationDecisionDate : new Date() , prehomologationDecision: Boolean(returnedValue) };
      }
      return row;
    });
  }

  suppressKeyboardEvent(params: any): boolean {
    const keyCode = params.event.key;
    return params.editing && keyCode === 'Enter';
  }

  doResize(): number {
    const crypto = window.crypto;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return Math.floor( array[0] * Math.floor(1000));
  }

  calculeRowsInComment(comment: string): number {

    if ( isNullOrUndefined(comment) ) { 
      return 4; 
    } 

    const nbrCommentLines = comment.split(/\r\n|\r|\n/).length;

    if (nbrCommentLines < 5) { 
      return 4; 
    }

    return nbrCommentLines;
  }
}
