import { Component, Input, ViewEncapsulation, OnInit, EventEmitter, Output } from '@angular/core';

import { CSS_CLASS_NAME } from '../../../../_core/constants/constants';
import { fullNameFormatter } from '../../../../_core/utils/formatter-utils';
import { DatePickerComponent } from '../../../../_shared/components/athena-ag-grid/date-renderer.component';
import { RadioButtonRendererComponent } from '../../../../_shared/components/athena-ag-grid/radio-button-renderer.component';
import { isNullOrUndefined, getDefaultStringEmptyValue } from '../../../../_core/utils/string-utils';
import { HomologationParticipantVO, HomologationVO } from '../../../../_core/models';


@Component({
  selector: 'app-homologation-commitee-selection',
  templateUrl: './homologation-commitee-selection.component.html',
  styleUrls: ['./homologation-commitee-selection.component.scss']
})
export class HomologationCommiteeSelectionComponent implements OnInit {

  @Output() onChangebeneficiaries = new EventEmitter<Partial<HomologationParticipantVO>[]>();

  @Input()  homologation: HomologationVO;
  
  redrawDetailsRows;

  resize;
  listBeneficiairesNull = []
  params: any;
  
  frameworkComponents: Object;
  
  columnDefs = [
    {
          headerName: 'Membre',
          headerClass: ['borderRight'],
          cellClass: ['borderRight'],
          sortable: false,
          valueFormatter: (params) => fullNameFormatter(null, params.data.firstname, params.data.lastname),
          width: 160       
      
    },
    {      
          headerName: 'validé',
          headerClass: 'centerText', 
          cellStyle: {'display': 'flex','justify-content':'center'}, 
          field: 'commiteeDecisionValid',
          colId: 'commitee-decision-valide',
          cellClass: CSS_CLASS_NAME.TEXT_CENTER, 
          sortable: false,
          valueFormatter: params => (isNullOrUndefined(params.data.commiteeSelectionRequest)) ? null : params.data.commiteeSelectionRequest,
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
          headerClass: 'centerText',  
          field: 'commiteeDecisionInvalid',
          colId: 'commitee-decision-invalide',
          cellClass: CSS_CLASS_NAME.TEXT_CENTER,
          sortable: false,
          valueFormatter: params => (isNullOrUndefined(params.data.commiteeSelectionRequest)) ? null : !params.data.commiteeSelectionRequest,
          cellRenderer: 'radioButton',
          cellRendererParams: {
            prefixId: 'homo-in-valide',
            prefixName: 'homo',
            returnedValue: false
          },
          width: 80
        },
        {
          headerName: 'Date',
          field: 'commiteeSelectionDate',
          sortable: false,
          cellStyle: { 'border-right': '1px solid #dadada !important' },
          cellRenderer: 'datePicker',
          width: 130
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
    
    if ( params.column.colId === 'commitee-decision-valide' || params.column.colId === 'commitee-decision-invalide' ) {
      this.homologation.beneficiaires = this.updateBeneficiaryLineInChangeRadio(params.rowIndex, params.returnedValue); 
    }
    
    if (params.column.colId === 'commiteeSeleccommiteeSelectionDatetionDate' ) {
      this.onChangebeneficiaries.emit(this.homologation.beneficiaires);
    }

    this.params = { force: true, suppressFlash: true };
  }

  updateBeneficiaryLineInChangeRadio(rowIndex: number, returnedValue: any): HomologationParticipantVO[] {
    return this.homologation.beneficiaires.map( (row, index) => {
      if (index === rowIndex) {
        
          return { ...row, commiteeSelectionDate : new Date() , commiteeSelectionRequest: Boolean(returnedValue) };
      }
      return row;
    });
  }

  suppressKeyboardEvent(params: any): boolean {
    const keyCode = params.event.key;
    return params.editing && keyCode === 'Enter';
  }


}

