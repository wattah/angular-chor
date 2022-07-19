import { RedirectionService } from './../../../../_core/services/redirection.service';
import { NotificationService } from './../../../../_core/services/notification.service';
import { isNullOrUndefined } from 'src/app/_core/utils/string-utils';
import { catchError } from 'rxjs/operators';
import { ParcLigneService } from './../../../../_core/services/parc-ligne.service';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomerParcServiceVO } from '../../../../_core/models/customer-parc-service-vo';
import { DateFormatPipeFrench } from '../../../../_shared/pipes';
import { CONSTANTS } from '../../../../_core/constants/constants';
import { getDefaultStringEmptyValue } from '../../../../_core/utils/string-utils';
import { dateComparator } from '../../../../_core/utils/date-utils';
import { getCustomerIdFromURL } from '../../customer-dashboard-utils';
import { of } from 'rxjs';

@Component({
  selector: 'app-parc-services',
  templateUrl: './parc-services.component.html',
  styleUrls: ['./parc-services.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParcServicesComponent implements OnInit {
  parcServices: CustomerParcServiceVO[];

  @Input()
  isEntreprise: boolean;

  @Input()
  isParticular: boolean;

  @Input()
  seeMore: boolean;

  customerId: string;
  rowData: any = [];
  columnDefs: any[];
  defaultSortModel: any[];
  isEmptyParcServices: boolean = false;
  inCompleteCall: boolean = true;
  iconePenHtml:any = '<span class="icon pen"></span>';
  classStyleIconePen : any = 'text-right cell-wrap-text';
  params: { force: boolean; suppressFlash: boolean; };
  showInactifs: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly parcLigneService: ParcLigneService,
    private readonly notificationService: NotificationService,
    private readonly redirectionService: RedirectionService
  ) {
    this.notificationService.setPreviousUrl(router.url);
  }

  ngOnInit(): void {
    this.seeMore = Boolean(this.route.snapshot.data['showDetail']);
    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
    });
    this.defaultSortModel = [{ colId: 'dateFacturation', sort: 'desc' }];
    const typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    if (this.seeMore) {
      if (typeCustomer !== null) {
        this.isEntreprise = typeCustomer === CONSTANTS.TYPE_COMPANY;
      } else {
        this.isEntreprise = Boolean(this.route.snapshot.data['isEntreprise']);
      }
      this.route.data.subscribe(resolversData => {
        this.parcServices = resolversData['parcServices'];
        this.inCompleteCall = false;
      });
      this.setColumnRefSeeMore();
    } else {
      this.getParcServicesFro360();
      this.setColumnRef();
    }
    this.redirectionService.getAgGridLoader().subscribe(
      (load)=>{
        if(load){
          this.params =  {
            force: true,
            suppressFlash: true,
          };
        }
      }
    )
    this.notificationService.setParcServices(this.parcServices);
  }
  getParcServicesFro360() {
    this.route.queryParamMap.subscribe(
      (data)=>{
      if(data.get('typeCustomer') === CONSTANTS.TYPE_COMPANY){
        this.getEntrepriseParcServices();
      }else{
        this.getParcServices();
      }
      }
    )
  }
  getEntrepriseParcServices() {
    let customerId = getCustomerIdFromURL(this.route);
    this.route.params.subscribe(params => {
      this.inCompleteCall = true;
      this.customerId = params['customerId'];
      this.customerId = isNullOrUndefined(this.customerId) ? getCustomerIdFromURL(this.route):this.customerId
    this.parcLigneService
      .getParcServicesByCustomerEntreprise(this.customerId)
      .pipe(catchError(() => of([])))
      .subscribe(
        parcServices => this.onSuccess(parcServices),
        error => this.onError(error),
        () => {
          this.onComplete();
          this.notificationService.setParcServices(this.parcServices);
        }
      );
      }); 
  }
  getParcServices() {
    let customerId = getCustomerIdFromURL(this.route);
    this.route.params.subscribe(params => {
      this.inCompleteCall = true;
      this.customerId = params['customerId'];
      this.customerId = isNullOrUndefined(this.customerId) ? getCustomerIdFromURL(this.route):this.customerId
    this.parcLigneService
      .getParcServicesByCustomer(this.customerId)
      .pipe(catchError(() => of([])))
      .subscribe(
        parcServices => this.onSuccess(parcServices),
        error => this.onError(error),
        () => {
          this.onComplete();
          this.notificationService.setParcServices(this.parcServices);
        }
      );
      }); 
  }
  onError(error: any): void {
    console.log(error);
    this.isEmptyParcServices = false;
    this.inCompleteCall = false;
  }
  onComplete(): void {
    this.isEmptyParcServices = this.parcServices.length === 0;
    this.inCompleteCall = false;
    this.notificationService.setParcServices([...this.parcServices]);
  }
  onSuccess(parcServices: CustomerParcServiceVO[]): void {
    this.parcServices = [...parcServices];
  }

  getImage(type: string): string {
    return type === 'ACTIF' ? 'status-green' : 'status-red';
  }

  getRecurrent(type: boolean): string {
    if (type === true) {
      return 'icon arrow-circular';
    }
  }
  clickedCell(params: any): void {
    console.log("---------------------------------------------------ici clickcell");
    if (params.column.colId === 'update' && this.redirectionService.hasPermission('modifier_service_materiel')) {
      this.router.navigate(
        ['/customer-dashboard', this.customerId , 'hardware-park-item','update'],
        { 
          queryParams: { hardwardId: params.data.id},    
          queryParamsHandling: 'merge',
        }
      );
    } else {
      this.router.navigate(
        [
          '/customer-dashboard',
          this.customerId,
          'see-all',
          'parc-services-details',
          params.data.id
        ],
        { queryParamsHandling: 'merge' }
      );
    }
  }
  setColumnRef(): void {
    if (
      this.route.snapshot.queryParamMap.get('typeCustomer') ===
      CONSTANTS.TYPE_COMPANY
    ) {
      this.columnDefs = [
        {
          headerName: 'FAMILLE',
          headerTooltip: 'FAMILLE',
          field: 'productSubFamille',
          cellClass: 'cell-wrap-text',
          valueGetter: params =>
            getDefaultStringEmptyValue(params.data.productSubFamille),
          width: 150,
          autoHeight: true
        },
        {
          headerName: 'ARTICLE',
          headerTooltip: 'ARTICLE',
          field: 'produit',
          cellClass: 'cell-wrap-text',
          valueGetter: params =>
            getDefaultStringEmptyValue(params.data.produit),
          width: 250,
          autoHeight: true
        },
        {
          headerName: 'BÉNÉFICIAIRE',
          headerTooltip: 'BÉNÉFICIAIRE',
          field: 'beneficiaire',
          cellClass: 'cell-wrap-text',
          autoHeight: true,
          width: 180
        },
        {
          headerName: 'FACTURATION',
          headerTooltip: 'FACTURATION',
          field: 'dateFacturation',
          comparator: dateComparator,
          valueGetter: params =>
            this.dateFormatPipeFrench.transform(params.data.dateFacturation),
          width: 180,
    
        },
        {
          headerName: 'STATUT',
          headerTooltip: 'STATUT',
          field: 'status',
          comparator: this.typeComparator,
          cellRenderer: params =>
            `<span class='icon ${this.getImage(params.data.status)}' ></span>`,
          cellClass: 'text-center',
          width: 130,
     
        },
        {
          headerName: '',
          headerTooltip: '',
          field: 'update',
          colId: 'update',
          cellRenderer: params => {
            if(this.redirectionService.hasPermission('modifier_service_materiel')){
              return this.iconePenHtml;
            }
            return '';
          },
          cellClass: this.classStyleIconePen,
          sortable: false,
          width: 60
        }
      ];
    } else {
      this.columnDefs = [
        {
          headerName: 'FAMILLE',
          headerTooltip: 'FAMILLE',
          field: 'productSubFamille',
          cellClass: 'cell-wrap-text',
          valueGetter: params =>
            getDefaultStringEmptyValue(params.data.productSubFamille),
          width: 120,
          autoHeight: true
        },
        {
          headerName: 'ARTICLE',
          headerTooltip: 'ARTICLE',
          field: 'produit',
          cellClass: 'cell-wrap-text',
          valueGetter: params =>
            getDefaultStringEmptyValue(params.data.produit),
          width: 300,
          autoHeight: true
        },
        {
          headerName: 'FACTURATION',
          headerTooltip: 'FACTURATION',
          field: 'dateFacturation',
          comparator: dateComparator,
          valueGetter: params =>
          this.dateFormatPipeFrench.transform(params.data.dateFacturation),
          width: 150,
       
        },
        {
          headerName: 'STATUT',
          headerTooltip: 'STATUT',
          field: 'status',
          comparator: this.typeComparator,
          cellRenderer: params =>
            `<span class='icon ${this.getImage(params.data.status)}' ></span>`,
          cellClass: 'text-center',
          width: 110,
      
        },
        /*{
          headerName: 'FACTURATION',
          headerTooltip: 'FACTURATION',
          field: 'dateFacturation',
          comparator: dateComparator,
          valueGetter: params => this.dateFormatPipeFrench.transform(params.data.dateFacturation),
          width: 130,
          sort: 'desc'
        },*/
      
        {
          headerName: '',
          headerTooltip: '',
          field: 'update',
          colId: 'update',
          cellRenderer: params => {
            return this.redirectionService.hasPermission('modifier_service_materiel') ? this.iconePenHtml : '';
          },
          cellClass: this.classStyleIconePen,
          sortable: false,
          width: 60
        }
      ];
    }
  }

  setColumnRefSeeMore(): void {
    this.defaultSortModel = [{ colId: 'recurrent', sort: 'desc' }];
    if (
      this.route.snapshot.queryParamMap.get('typeCustomer') ===
      CONSTANTS.TYPE_COMPANY
    ) {
      this.columnDefs = [
        {
          headerName: 'FAMILLE',
          headerTooltip: 'FAMILLE',
          field: 'productSubFamille',
          cellClass: 'cell-wrap-text',
          valueGetter: params =>
            getDefaultStringEmptyValue(params.data.productSubFamille),
          width: 150,
          autoHeight: true
        },
        {
          headerName: 'ARTICLE',
          headerTooltip: 'ARTICLE',
          field: 'produit',
          cellClass: 'cell-wrap-text',
          valueGetter: params =>
            getDefaultStringEmptyValue(params.data.produit),
          width: 260,
          autoHeight: true
        },
        {
          headerName: 'BÉNÉFICIAIRE',
          headerTooltip: 'BÉNÉFICIAIRE',
          field: 'beneficiaire',
          cellClass: 'cell-wrap-text',
          autoHeight: true,
          width: 180
        },
        {
          headerName: 'RÉCURRENT',
          headerTooltip: 'RÉCURRENT',
          field: 'recurrent',
          cellRenderer: params =>
            `<span class='icon ${this.getRecurrent(
              params.data.recurrent
            )}' ></span>`,
          cellClass: 'text-center',
          width: 100,
    
        },
        {
          headerName: 'FACTURATION',
          headerTooltip: 'FACTURATION',
          field: 'dateFacturation',
          comparator: dateComparator,
          valueGetter: params =>
            this.dateFormatPipeFrench.transform(params.data.dateFacturation),
          width: 130,
    
        },
        {
          headerName: 'STATUT',
          headerTooltip: 'STATUT',
          field: 'status',
          comparator: this.typeComparator,
          cellRenderer: params =>
            `<span class='icon ${this.getImage(params.data.status)}' ></span>`,
          cellClass: 'text-center',
          width: 80,
   
        },
    
        {
          headerName: '',
          headerTooltip: '',
          field: 'update',
          cellRenderer: params => {
              return this.redirectionService.hasPermission('modifier_service_materiel') ? this.iconePenHtml:``;
          },
          cellClass: this.classStyleIconePen,
          sortable: false,
          width: 60
        }
      ];
    } else {
      this.columnDefs = [
        {
          headerName: 'FAMILLE',
          headerTooltip: 'FAMILLE',
          field: 'productSubFamille',
          cellClass: 'cell-wrap-text',
          valueGetter: params =>
            getDefaultStringEmptyValue(params.data.productSubFamille),
          width: 150,
          autoHeight: true
        },
        {
          headerName: 'ARTICLE',
          headerTooltip: 'ARTICLE',
          field: 'produit',
          cellClass: 'cell-wrap-text',
          valueGetter: params =>
            getDefaultStringEmptyValue(params.data.produit),
          width: 300,
          autoHeight: true
        },
        {
          headerName: 'RÉCURRENT',
          headerTooltip: 'RÉCURRENT',
          field: 'recurrent',
          cellRenderer: params =>
            `<span class='icon ${this.getRecurrent(
              params.data.recurrent
            )}' ></span>`,
          cellClass: 'text-center',
          width: 80,
        
        },
        {
          headerName: 'FACTURATION',
          headerTooltip: 'FACTURATION',
          field: 'dateFacturation',
          comparator: dateComparator,
          valueGetter: params =>
            this.dateFormatPipeFrench.transform(params.data.dateFacturation),
          width: 110,
     
        },
        {
          headerName: 'STATUT',
          headerTooltip: 'STATUT',
          field: 'status',
          comparator: this.typeComparator,
          cellRenderer: params =>
            `<span class='icon ${this.getImage(params.data.status)}' ></span>`,
          cellClass: 'text-center',
          width: 80,
         
        },
        {
          headerName: '',
          cellRenderer: 'searchBtnRendererComponent',
          cellClass: 'text-center',
          sortable: false,
          width: 120
        },
        {
          headerName: '',
          headerTooltip: '',
          field: 'update',
          cellRenderer: params => {
              return this.redirectionService.hasPermission('modifier_service_materiel') ? this.iconePenHtml:``;
          },
          cellClass: this.classStyleIconePen,
          sortable: false,
          width: 60
        }
      ];
    }
  }

  getArrowImage(rangRenewal: string): string {
    return rangRenewal === 'unauthorized'
      ? 'arrow-right-black'
      : 'arrow-left-black';
  }

  typeComparator(type1: string, type2: string): number {
    return type1.localeCompare(type2) * -1;
  }

  showInactifHardwareParkItem(): void {
    this.showInactifs = !this.showInactifs;
    this.inCompleteCall = true;
    if (this.isEntreprise ) {
      this.parcLigneService.getParcServicesDetailsByCustomerEntreprise(this.customerId, this.showInactifs)
      .subscribe( 
        data => this.onSuccess(data),
        error => this.onError(error),
        () => this.onComplete()
      );
    } else {
      this.parcLigneService.getParcServicesHardwareFullByCustomer(this.customerId, this.showInactifs)
      .subscribe( 
        data => this.onSuccess(data),
        error => this.onError(error),
        () => this.onComplete()
      );
    }
  }
}
