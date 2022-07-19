import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CSS_CLASS_NAME } from '../../../../../_core/constants/constants';
import { RenewalMobileVO } from '../../../../../_core/models/models';
import { ProductService } from '../../../../../_core/services';
import { getDefaultStringEmptyValue } from '../../../../../_core/utils/string-utils';
import { SerpImeiService } from '../serp-imei.service';

@Component({
  selector: 'app-terminals-acquired',
  templateUrl: './terminals-acquired.component.html',
  styleUrls: ['./terminals-acquired.component.scss']
})
export class TerminalsAcquiredComponent implements OnInit {

  searchPattern : String;
  serpAll;
  productId : string = "";
  productSourceTable : string = "";
  listRenewalMobileBySerial : RenewalMobileVO[];

  paginationPageSize = 5;
  defaultSortModel: any[];
  
columnDefs = [
  {
    headerName: 'Client',
    headerTooltip: 'client',
    field: 'customerName',
    valueGetter: params => this.serpImeiService.buildName(params.data.customerFirstName, params.data.customerLastName),
    cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
    width: 120,
    cellStyle: { 'text-decoration': 'underline' } ,
    
  },
  {
    headerName: 'Ligne ',
    field: 'webServiceIdentifier',
    valueGetter: params => getDefaultStringEmptyValue(params.data.webServiceIdentifier),
    cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
    width: 120,
  },
  {
    headerName: 'Information ',
    field: 'comment',
    valueGetter: params => getDefaultStringEmptyValue(params.data.comment),
    cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
    width: 200,
  },
  {
    headerName: 'Date de renouvellement ',
    field: 'renewalDate',
    valueGetter: params => this.serpImeiService.getFormattedDate(params.data.renewalDate),
    cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
    width: 140,
  },
  {
    headerName: "Date d'opération",
    field: 'operationDate',
    valueGetter: params => this.serpImeiService.getFormattedDate(params.data.operationDate),
    cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
    width: 140,
  },
];
  
  constructor(private readonly route: ActivatedRoute, private readonly productService : ProductService ,
    private readonly serpImeiService : SerpImeiService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.listRenewalMobileBySerial = [];
      this.searchPattern = queryParams.get('search_pattern');
      this.serpAll =  queryParams.get('serpAll');
      if(this.serpAll == "false"){
        this.productId = queryParams.get('id');
        this.productSourceTable = queryParams.get('productSourceTable');
      }
      if((this.serpAll == "false" && this.productSourceTable == "rm") || this.serpAll == "true"){
        this.getListRenewalMobileBySerialPart();
      }
      
    });
  }

  getListRenewalMobileBySerialPart(){
    this.productService.listRenewalMobileBySerialPart(this.searchPattern, this.serpAll, this.productId, this.productSourceTable).subscribe( data => {
      this.listRenewalMobileBySerial = data;
    });
  }

   clickCell(params: any): void {
    if(params.column.colId === 'customerName'){
      this.serpImeiService.goToCustomerDashbordPage(params);        
    }
    
   }

}
