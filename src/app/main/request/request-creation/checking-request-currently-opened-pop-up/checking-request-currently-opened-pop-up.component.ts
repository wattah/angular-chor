import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CSS_CLASS_NAME } from '../../../../_core/constants/constants';
import { RequestCustomerVO } from '../../../../_core/models/request-customer-vo';
import { dateComparator } from '../../../../_core/utils/date-utils';
import { firstNameFormatter } from '../../../../_core/utils/formatter-utils';
import { getDefaultStringEmptyValue, isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { DateFormatPipeFrench } from '../../../../_shared/pipes';

@Component({
  selector: 'app-checking-request-currently-opened-pop-up',
  templateUrl: './checking-request-currently-opened-pop-up.component.html',
  styleUrls: ['./checking-request-currently-opened-pop-up.component.scss']
})
export class CheckingRequestCurrentlyOpenedPopUpComponent implements OnInit {

  @Input() parcours: string;

  @Input() openRequests: RequestCustomerVO[];

  @Input() customerId: number;

  defaultSortModel = [ { colId: 'createdAt', sort: 'desc' } ];
  columnDefs = [
    {
      headerName: 'DÛ',
      headerTooltip: 'DÛ',
      valueGetter: params => this.dateFormatPipeFrench.transform(params.data.createdAt, 'dd MMM yyyy'),
      field: 'createdAt',
      colId: 'createdAt',
      comparator: dateComparator,
      cellClass: [CSS_CLASS_NAME.CELL_WRAP_TEXT],
      width: 60
    },
    {
      headerName: 'Objet demande',
      headerTooltip: 'Objet demande',
      field: 'title',
      valueGetter: params => getDefaultStringEmptyValue(params.data.title),
      autoHeight: true,
      cellClass: [CSS_CLASS_NAME.CELL_WRAP_TEXT],
      width: 90
    },
    {
      headerName: 'Porteur',
      headerTooltip: 'Porteur',
      field: 'porteur',
      valueGetter: params => {
        const { firstNamePorteur , lastNamePorteur } = params.data;
        let fullName = '';
        fullName += (isNullOrUndefined(firstNamePorteur) || firstNamePorteur.trim().length === 0) 
          ? '' : firstNameFormatter(firstNamePorteur);
        fullName += ' ';
        fullName += (isNullOrUndefined(lastNamePorteur) || lastNamePorteur.trim().length === 0) 
          ? '' : lastNamePorteur.toUpperCase();
        return getDefaultStringEmptyValue( fullName );
      },
      autoHeight: true,
      cellClass: [CSS_CLASS_NAME.CELL_WRAP_TEXT],
      width: 100
    }
  ];
  
  constructor(private readonly activeModal: NgbActiveModal, private readonly router: Router, 
    private readonly dateFormatPipeFrench: DateFormatPipeFrench) { }

  ngOnInit(): void {
  }

  decline(): void {
    this.activeModal.close(true);
  }

  accept(): void {
    this.activeModal.close(false);
  }

  selectRequest(_row: RequestCustomerVO): void {
    this.activeModal.close(false);
    this.router.navigate(
      ['/customer-dashboard', this.customerId, 'detail', 'request', _row.idRequest],
      { queryParamsHandling: 'merge' }
    );
  }

}
