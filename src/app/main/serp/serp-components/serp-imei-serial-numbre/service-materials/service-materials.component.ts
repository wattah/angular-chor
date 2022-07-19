import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerHardwareParkItemVO } from '../../../../../_core/models/models';
import { ProductService } from '../../../../../_core/services';
import { CSS_CLASS_NAME } from '../../../../../_core/constants/constants';
import { getDefaultStringEmptyValue } from '../../../../../_core/utils/string-utils';

import { SerpImeiService } from '../serp-imei.service';

@Component({
  selector: 'app-service-materials',
  templateUrl: './service-materials.component.html',
  styleUrls: ['./service-materials.component.scss']
})
export class ServiceMaterialsComponent implements OnInit {
  paginationPageSize = 5;
  defaultSortModel: any[];

  searchPattern : String;
  serpAll;
  productId : string = "";
  productSourceTable : string = "";
  listCustomerParkMaterialsAndServicesBySerial : CustomerHardwareParkItemVO[];

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
      headerName: 'Catégorie  ',
      field: 'canonicalFamily',
      valueGetter: params => getDefaultStringEmptyValue(params.data.canonicalFamily),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 200,
    },
    {
      headerName: 'Matériel  ',
      field: 'productLabel',
      valueGetter: params => getDefaultStringEmptyValue(params.data.productLabel),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 180,
    },
    {
      headerName: 'IMEI',
      field: 'serial',
      valueGetter: params => getDefaultStringEmptyValue(params.data.serial),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 120,
    },
    {
      headerName: "Date de création",
      field: 'createdAt',
      valueGetter: params => this.serpImeiService.getFormattedDate(params.data.createdAt),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 120,
    },
  
    {
      headerName: "Date de facturation",
      field: 'subscriptionDate',
      valueGetter: params => this.serpImeiService.getFormattedDate(params.data.subscriptionDate),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 140,
    },
    {
      headerName: "Type de demande",
      field: 'requestType',
      valueGetter: params => getDefaultStringEmptyValue(params.data.requestType),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      width: 220,
    },
    {
      headerName: "Demande",
      field: 'requestId',
      valueGetter: params => getDefaultStringEmptyValue(params.data.requestId),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
      comparator: (num1: number, num2: number) => {
        return num1 -num2;
      },
      width: 80,
    },
    ];

  constructor(private readonly route: ActivatedRoute, private readonly productService : ProductService,
    private readonly serpImeiService : SerpImeiService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.listCustomerParkMaterialsAndServicesBySerial = [];
      this.searchPattern = queryParams.get('search_pattern');
      this.serpAll =  queryParams.get('serpAll');
      if(this.serpAll == "false"){
        this.productId = queryParams.get('id');
        this.productSourceTable = queryParams.get('productSourceTable');
      }
      if((this.serpAll == "false" && this.productSourceTable == "chpi") || this.serpAll == "true"){
        this.getListHardwareParkItemBySerialPart();
      }
    });  
  }

  getListHardwareParkItemBySerialPart(){
    this.productService.listHardwareParkItemBySerialPart(this.searchPattern, this.serpAll, this.productId, this.productSourceTable).subscribe( data => {
      this.listCustomerParkMaterialsAndServicesBySerial = data;
    });
  }

    clickCell(params: any): void {
      if(params.column.colId === 'customerName'){
        this.serpImeiService.goToCustomerDashbordPage(params); 
      }
    }
}
