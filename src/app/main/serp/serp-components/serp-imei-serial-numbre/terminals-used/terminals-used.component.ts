import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CSS_CLASS_NAME } from '../../../../../_core/constants/constants';
import { CustomerParkItemTerminalMobileVO } from '../../../../../_core/models/models';
import { ProductService } from '../../../../../_core/services';
import { getDefaultStringEmptyValue } from '../../../../../_core/utils/string-utils';
import { SerpImeiService } from '../serp-imei.service';



@Component({
  selector: 'app-terminals-used',
  templateUrl: './terminals-used.component.html',
  styleUrls: ['./terminals-used.component.scss']
})
export class TerminalsUsedComponent implements OnInit {
  paginationPageSize = 5;
  defaultSortModel: any[];

  searchPattern : String;
  serpAll;
  productId : string = "";
  productSourceTable : string = "";
  listCustomerParkItemTerminalMobileBySerial : CustomerParkItemTerminalMobileVO[];

  columnDefs = [
    {
      headerName: 'Client',
      headerTooltip: 'client',
      field: 'customerName',
      valueGetter: params => this.serpImeiService.buildName(params.data.customerFirstName, params.data.customerLastName),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 120,
      cellStyle: { 'text-decoration': 'underline'},
    },
    {
      headerName: 'Ligne ',
      field: 'webServiceIdentifier',
      valueGetter: params => getDefaultStringEmptyValue(params.data.webServiceIdentifier),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 120,
    },
    {
      headerName: 'Matériel  ',
      field: 'description',
      valueGetter: params => getDefaultStringEmptyValue(params.data.description),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 140,
    },
    {
      headerName: 'Achat Orange ',
      field: 'isBought',
      valueGetter: params => (params.data.isBought) ? 'OUI' : 'NON',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 140,
    },
    {
      headerName: "Origine Achat",
      field: 'origin',
      valueGetter: params => getDefaultStringEmptyValue(params.data.origin),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 140,
    },
    
    {
      headerName: "Date d'achat",
      field: 'dateBuy',
      valueGetter: params => this.serpImeiService.getFormattedDate(params.data.dateBuy),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 140,
    },
    {
      headerName: "Date de 1ère utilisation",
      field: 'dateFirstUse',
      valueGetter: params => this.serpImeiService.getFormattedDate(params.data.dateFirstUse),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 200,
    },
    {
      headerName: "IMEI",
      field: 'numImei',
      valueGetter: params => getDefaultStringEmptyValue(params.data.numImei),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 140,
    }
    ];

  constructor(private readonly route: ActivatedRoute, private readonly productService : ProductService,
    private readonly serpImeiService : SerpImeiService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.listCustomerParkItemTerminalMobileBySerial = [];
      this.searchPattern = queryParams.get('search_pattern');
      this.serpAll =  queryParams.get('serpAll');
      if(this.serpAll == "false"){
        this.productId = queryParams.get('id');
        this.productSourceTable = queryParams.get('productSourceTable');
      }
      if((this.serpAll == "false" && this.productSourceTable == "cpitm") || this.serpAll == "true"){
        this.getListCustomerParkItemTerminalMobileBySerialPart();
      }
  });

    
  }

  getListCustomerParkItemTerminalMobileBySerialPart(){
    this.productService.listCustomerParkItemTerminalMobileBySerialPart(this.searchPattern, this.serpAll, this.productId, this.productSourceTable).subscribe( data => {
      this.listCustomerParkItemTerminalMobileBySerial = data;
    });
  }

    clickCell(params: any): void {
    if(params.column.colId === 'customerName'){
      this.serpImeiService.goToCustomerDashbordPage(params);         
    }
    
    }

}
