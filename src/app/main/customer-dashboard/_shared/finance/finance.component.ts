import { GassiMockLoginService } from './../../../../_core/services/gassi-mock-login.service';
import { CustomerTotalsDebtService } from './../../../../_core/services/customer-totals-debt.service';
import { CustomerDashboardService } from './../../customer-dashboard.service';
import { CustomerDebtService } from './../../../../_core/services/customer-debt.service';
import { catchError } from 'rxjs/operators';
import { PersonNoteService } from 'src/app/_core/services/person-note.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonNoteVo } from 'src/app/_core/models/person-note';
import { CustomerTotalsDebt } from 'src/app/_core/models/customer-totals-debt';
import { getCustomerIdFromURL } from '../../customer-dashboard-utils';
import { of } from 'rxjs';
import { DebteService } from '../../../../_core/services/debt.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {
  infoFacturation: PersonNoteVo;

  @Input() nicheValue: string;

  @Input()
  totalDebt: CustomerTotalsDebt[];
  @Input()
  dateRecouvrement: Date;

  personIdNote: number;

  @Input()
  isEntreprise: boolean;

  @Input()
  customerId;
  boolean;

  @Input()
  isParticular: boolean;
  inCompleteCall: boolean = false;
  jiraUrl: string;
  selectedRow = 0;
  nicheId : string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly personNoteService: PersonNoteService,
    private readonly customerDebt: CustomerDebtService,
    private readonly debtService: DebteService,
    private readonly totalDebtServie: CustomerTotalsDebtService,
    private readonly mockLoginService: GassiMockLoginService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
      this.getInfoFacturation();
    });
    this.getCustomerTotalDebts();
    this.mockLoginService.getJiraUrl().subscribe(
      (url)=> this.jiraUrl = url
    );
  }
  getCustomerTotalDebts() {
    let customerId = getCustomerIdFromURL(this.route);
    this.route.params.subscribe(params => {
      customerId = params['customerId'];
    this.totalDebtServie.getTotalsDebt(customerId)
      .pipe(catchError(() => {
        this.debtService.errorInBill$.next(true);
        return of(null);
      })).subscribe(data => {
        this.totalDebt = data ;
        this.inCompleteCall = false;
      });
    });
  }
  getDateRecouvrement() {
    let customerId = getCustomerIdFromURL(this.route);
    this.route.params.subscribe(params => {
      customerId = params['customerId'];
    this.customerDebt
      .getRecoveryDate(customerId)
      .pipe(catchError(() => of(null)))
      .subscribe(
        (dateRecouvrement) => this.dateRecouvrement = dateRecouvrement
      );
    });
  }
  getInfoFacturation() {
    this.personNoteService.getInfoFacturation(this.customerId).subscribe(
      infoFacturation => {
        this.infoFacturation = infoFacturation;
        if (infoFacturation !== null) {
          this.personIdNote = infoFacturation.personId;
        }
      },
      _error=>{
        this.inCompleteCall = false;
      },
      ()=>{
        this.inCompleteCall = false;
      });
  }
  
  getRowIndexOfSelectedDebt(event: any): void {
    this.selectedRow = event;
  }
  
}
