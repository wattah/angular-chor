import { Component, OnInit } from '@angular/core';
import { BillingService } from '../../../_core/services/billing.service';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment  from 'moment';
import  {Moment} from 'moment-business-days';
import { MatDatepicker } from '@angular/material/datepicker';
import { CSS_CLASS_NAME } from '../../../_core/constants/constants';
import { FORMAT_DATE } from '../../../_core/constants/patterns-date';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-invoice-statistics-total',
  templateUrl: './invoice-statistics-total.component.html',
  styleUrls: ['./invoice-statistics-total.component.scss']
})
export class InvoiceStatisticsTotalComponent implements OnInit {
  dateStr: string;
  rowData = [];
  currentDate = new Date();
  date = new FormControl(moment());
  loadingData = false;
  constructor(private readonly billService:BillingService, private readonly datePipe: DatePipe,
    private readonly confirmationDialogService: ConfirmationDialogService) { }
  
  ngOnInit() {
    this.initDate();
    this.getStatFactureMass();
  }

  initDate() : void {
    this.dateStr = this.datePipe.transform(this.currentDate , FORMAT_DATE.YYYY__MM__DD);
   }

   getStatFactureMass(){
     this.loadingData = true;
    this.billService.getStatFactureMass(1, this.dateStr).subscribe(
      data => {
      this.rowData = data;
      this.loadingData = false;
      },
      _error => {
        this.loadingData = false;
        this.rowData = [];
      }
    )
   }

    chosenYearHandler(normalizedYear: Moment) {
      const ctrlValue = this.date.value;
      ctrlValue.year(normalizedYear.year());
      this.date.setValue(ctrlValue);
    }
  
    chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
      const ctrlValue = this.date.value;
      ctrlValue.month(normalizedMonth.month());
      this.date.setValue(ctrlValue);
      datepicker.close();
    }
     getNbFacturesSansErreurs(params : any) : number {
      return (params.nbFacturesExtraitesRecurrentes + params.nbFacturesExtraitesNonRecurrentes - params.nbFacturesEnErreur);
    }

    getnbFacturesRelookeesAutoTotal(params : any) : number {
			return params.nbFacturesRelookeesAutoNonRecurrentes + params.nbFacturesRelookeesAutoRecurrentes;
    }
    
    getnbFacturesRelookeesManuelTotal(params : any) : number {
			return params.nbFacturesRelookeesManuelNonRecurrentes + params.nbFacturesRelookeesManuelRecurrentes;
    }
    /**
   * cette methode permet de calculer le poucentage de la complétude potentielle
   * */
     getPotentiel(params: any) : string {
       const POURCENTAGE ="%";
			let potentiel = 0;
			if (params.nbFacturesPresentes > 0) {
				potentiel = ((params.nbFacturesPresentes / params.nbFacturesAttendues) * 100);
			}
			return potentiel.toFixed(2) + POURCENTAGE;
    }
    /**
   * cette methode permet de calculer le poucentage de la complétude actuelle 
   * */
    getReel(params: any) : string {
      const POURCENTAGE ="%";
			let reel = 0;
			if (params.nbFacturesPresentes > 0) {
				reel = ((params.nbFacturesRelookeesAutoRecurrentes + params.nbFacturesRelookeesManuelRecurrentes) / params.nbFacturesAttendues) * 100;
			}
			return reel.toFixed(2)+ POURCENTAGE;
		}

  params: { force: boolean; suppressFlash: boolean; };
  columnDefs = [
    {
      headerName: '',
      marryChildren: true,
      headerClass: 'd-none ',
      children: [
        {
          headerName: 'univers',
          field: 'univers',
          width: 100,
          headerClass: 'd-none ',
          cellStyle: { 'justify-content': 'start','border-left':'1px solid #dadada !important' },
          cellClass: CSS_CLASS_NAME.BORDER_RIGHT
        },
      ],
    },

    {
      headerName: 'Original',
      headerClass: 'original',
      marryChildren: true,
      children: [
        {
          headerName: 'Attendu',
          width: 120,
          field: 'nbFacturesAttendues',
          headerClass: CSS_CLASS_NAME.BORDER_LEFT,
          cellStyle: CSS_CLASS_NAME.BORDER_RIGHT,
          
        },
        {
          headerName: 'Absent',
          width: 120,
          headerClass: CSS_CLASS_NAME.BORDER_RIGHT,
          field: 'nbFacturesAbsentes',
          cellClass: CSS_CLASS_NAME.BORDER_RIGHT,
          cellStyle: params => (params.data.nbFacturesAbsentes > 0) ? { 'color': '#ed5565' } : { 'color': '#5FA82A' },
        },
      ],
    },

    {
      headerName: 'Données extraites',
      headerClass: 'bordertop',
      marryChildren: true,
      children: [
        {
          headerName: 'Récurrentes ',
          width: 120,
          field: 'nbFacturesExtraitesRecurrentes',
          cellStyle: params => (params.data.nbFacturesExtraitesRecurrentes > 0) ? { 'color':'#5FA82A'} : { 'color': '#ed5565' },
        },
        {
          headerName: 'Non récurrentes',
          width: 150,
          field: 'nbFacturesExtraitesNonRecurrentes',
        },
        {
          headerName: 'Ok',
          width: 86,
          field: 'nbFacturesSansErreurs',
          valueGetter: params => this.getNbFacturesSansErreurs(params.data),
        },
        {
          headerName: 'Ko',
           width: 85,
          headerClass: CSS_CLASS_NAME.BORDER_RIGHT,
          field: 'nbFacturesEnErreur',
          cellClass: CSS_CLASS_NAME.BORDER_RIGHT,
        },
      ],
    },

    {
      headerName: 'Relooking',
      headerClass: 'bordertop',
      marryChildren: true,
      children: [
        {
          headerName: 'Auto',
          width: 120,
          valueGetter: params => this.getnbFacturesRelookeesAutoTotal(params.data),
          cellStyle: params => (this.getnbFacturesRelookeesAutoTotal(params.data) > 0) ? { 'color':'#5FA82A'} : { 'color': '#ed5565' },
        },
        {
          headerName: 'Manuel',
          width: 120,
          headerClass: CSS_CLASS_NAME.BORDER_RIGHT,
          valueGetter: params => this.getnbFacturesRelookeesManuelTotal(params.data),
          cellStyle: params => (this.getnbFacturesRelookeesManuelTotal(params.data) > 0) ? { 'color':'#5FA82A'} : { 'color': '#ed5565' },
        },
      ],
    },

    {
      headerName: "Complétude auto (%)",
      headerClass: 'bordertop',
      marryChildren: true,
      children: [
        {
          headerName: 'Potentiel',
          width: 120,
          valueGetter: params =>this.getPotentiel(params.data),
          cellClass: CSS_CLASS_NAME.BORDER_LEFT,
        },
        {
          headerName: 'Actuel',
          width: 120,
          cellClass: CSS_CLASS_NAME.BORDER_RIGHT,
          headerClass: CSS_CLASS_NAME.BORDER_RIGHT,
          valueGetter: params =>this.getReel(params.data),
        },
      ],
    },

  ];

  onCloseDatePicker() {
    this.dateStr = this.datePipe.transform(this.date.value , FORMAT_DATE.YYYY__MM__DD);
    this.getStatFactureMass();
  }

}
