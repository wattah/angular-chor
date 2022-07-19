import { ABANDONED_COMMAND_ORDER_STATUS, CANCELED_COMMAND_ORDER_STATUS } from './../../../_core/constants/constants';
import { RedirectionService } from './../../../_core/services/redirection.service';
import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';

import { ParcLigneService } from './../../../_core/services/parc-ligne.service';
import { ReferenceDataVO } from './../../../_core/models/reference-data-vo';
import { UserVo } from './../../../_core/models/user-vo';
import { DateFormatPipeFrench } from './../../../_shared/pipes/dateformat/date-format.pipe';
import { ParkItemListParticularService } from './../park-item-list-particular/park-item-list-particular.service';
import { CustomerParkItemVO } from './../../../_core/models/customer-park-item-vo';
import { firstNameFormatter, toUpperCase } from './../../../_core/utils/formatter-utils';
import { isNullOrUndefined } from './../../../_core/utils/string-utils';
import { CartService } from './../../../_core/services/cart.service';
import { UNIVERS_MOBILE } from '../../../_core/constants/bill-constant';


@Component({
  selector: 'app-park-item-list-enterprise',
  templateUrl: './park-item-list-enterprise.component.html',
  styleUrls: ['./park-item-list-enterprise.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParkItemListEnterpriseComponent implements OnInit {
  
  cellWrap = 'cell-wrap-text';
  centerCell = 'text-center' ;
  userConnecte: UserVo;
  datePattern =  "dd MMM yyyy";
  space = '  ';
  heur = "h";
  FIXE = 'FIXE';
  cartId = null;
  billDownload = 'billDownload'
  categorieList=["Assurance" , "Produit" , "Renouvellement Annuel","SAV"];
  defaultSortModel = [ { colId: 'line', sort: 'asc' } ];
  columnDefs = [
    {
      headerName: '',
      headerTooltip: '',
      width: 40,
      field: 'id',
      cellRenderer: 'agGroupCellRenderer',
      resizable: false,
      sortable: false
    },
    {
      headerName: 'bénéficiaire',
      headerTooltip: 'bénéficiaire',
      colId: 'membre',
      width: 100,
      valueGetter: params => this.getBeneficiaryName(params.data.beneficiaryFirstName, params.data.beneficiaryLastName),
      cellClass: params => { 
        return params.data.universe === this.FIXE ? `${this.cellWrap} no-cursor` : this.cellWrap
      },
      cellStyle: { 'text-decoration': 'underline' }
    },
    {
      headerName: 'ligne',
      headerTooltip: 'ligne',
      colId: 'line',
      field: 'universe',
      comparator: this.lineComparator,
      cellClass: params => { 
        return params.data.universe === this.FIXE ? `${this.cellWrap} no-cursor` : this.cellWrap
      },
      cellRenderer: params => {
        if(!isNullOrUndefined(params.data.linkedParkItemId)) {
          return  `<span class='icon multisim' ></span>${params.data.webServiceIdentifier}` 
        }
        return this.getLineAndType(params);
      },
      width: 100,
      autoHeight: true
    },
    {
      headerName: 'forfait',
      headerTooltip: 'forfait',
      colId: 'forfait',
      width: 120,
      valueGetter: params => 
           params.data.libelleContract ? params.data.libelleContract : '-',      
      autoHeight: true,
      cellClass: params => { 
        return params.data.universe === this.FIXE ? `${this.cellWrap} no-cursor` : this.cellWrap
      },
    },
    {
      headerName: 'statut',
      headerTooltip: 'statut',
      colId: 'status',
      field: 'nicheContractStatus',
      width: 65,
      headerClass: this.centerCell,
      cellClass: params => { 
        return params.data.universe === this.FIXE ? `${this.centerCell} no-cursor` : this.centerCell
      },
      cellRenderer: params => 
          `<span class='icon ${this.parkItemListParticularService.getStatut(params.data.nicheContractStatus)}' ></span>`
    },
    {
      headerName: 'statut renouv.',
      headerTooltip: 'statut renouvellement',
      colId: 'rang',
      field: 'rangRenewal',
      comparator: this.parkItemListParticularService.statusRenewalComparator,
      width: 85,
      headerClass: 'text-right',
      cellClass: params => { 
        return params.data.universe === this.FIXE ? `${this.centerCell} no-cursor` : this.centerCell
      },
      cellRenderer: _params => {
        let val = '';
        if (_params.data && _params.data.universe === 'MOBILE') {
          val = `<span class="icon ${this.parkItemListParticularService.getStatutRenouv(_params.data.rangRenewal)} "></span> `
        }
        return val;
      }
    },
    {
      headerName: 'prochain renouv.',
      headerTooltip: 'prochain renouv',
      field: 'dateRenewal',
      colId: 'dateRenouvellement',
      comparator: (d1, d2, p1, p2) => this.parkItemListParticularService.dateRenewalComparator(d1, d2, p1, p2),
      cellRenderer: params => {
        let renewal = `-`;
        if (params.data.dateRenewal && params.data.universe === 'MOBILE' && params.data.rangRenewal === 'unauthorized') {
          renewal = this.datePipe.transform(params.data.dateRenewal, this.datePattern);
        }
        return renewal;
      },
      cellClass: params => { 
        return params.data.universe === this.FIXE ? `${this.cellWrap} no-cursor` : this.cellWrap
      },
      width: 95
    },
    {
      headerName: 'hors-forfait(€)',
      headerTooltip: 'hors-forfait(€)',
      field: 'horsForfait',
      colId: 'horsF',
      comparator: this.parkItemListParticularService.horsForfaitComparator,
      cellRenderer: _params => {
        let val = '-';
        if (_params.data.horsForfait) {
          val = `<span class='text-right cell-wrap-text' >
          <strong><span class="red cell-wrap-text">${_params.data.horsForfait}</span>`;
        }
        return val;
      },      
      autoHeight: true,
      headerClass: 'text-center',
      cellClass: params => { 
        return params.data.universe === this.FIXE ? 'red cell-wrap-text text-right no-cursor' : 'red cell-wrap-text text-right'
      },
      width: 95
    },
    {
      headerName: '', headerTooltip: '', width: 60, field: 'adv',
      cellClass: params => { 
        return params.data.universe === this.FIXE ? `${this.cellWrap} no-cursor` : this.cellWrap
      },
      cellRenderer: params => {
        if (params.data.universe !== 'INTERNET') {
          return `<span class='link' > ADV </span>`;
        }
        return ``;
      },
      autoHeight: true, 
      sortable: false 
    },
    {
      headerName: '',
      headerTooltip: '',
      colId: 'suspend',
      width: 30,
      cellRenderer: params =>
          this.redirectionService.hasPermission('suspendre_ligne') ?
          this.parkItemListParticularService.getLabelSuspend(params.data):``,
      autoHeight: true, 
      sortable: false
    },
    {
      headerName: '',
      headerTooltip: '',
      colId: 'update',
      width: 30,
      cellRenderer: () => this.redirectionService.hasPermission('modifier_ligne') ? `<span class='icon pen'></span>`:``,
      autoHeight: true, 
      sortable: false
    },
    {
      headerName: '',
      headerTooltip: '',
      colId: 'refresh',
      width: 30,
      cellRenderer: params => {
        if (this.parkItemListParticularService.isVisibleBtnRefresh(params.data.nicheContractStatus) && this.redirectionService.hasPermission('retablir_ligne')) {
          return `<span class='icon refresh' ></span>`;
        }
        return '';
      },
      autoHeight: true, 
      sortable: false
    }
    ,
    {
      headerName: '',
      headerTooltip: '',
      colId: 'delete',
      width: 30,
      cellRenderer: () => this.redirectionService.hasPermission('supprimer_ligne') ? `<span class='icon del'></span>`:``,
      autoHeight: true, 
      sortable: false
    },
    {
      headerName: '',
      headerTooltip: '',
      width: 30,
      colId: 'unlock',
      cellRenderer: params => {
        if (this.parkItemListParticularService.isVisibleOrActiveUnlock(params.data) && this.redirectionService.hasPermission('supprimer_ligne')) {
          return `<span class='icon cadenas' ></span>`;
        }
        return ``;
      },
      autoHeight: true, 
      sortable: false
    }
  ];

  detailCellRendererParams = {
    
    detailGridOptions: {
      columnDefs: [],
      defaultColDef: {
        flex: 1 
      }
    },
    
    getDetailRowData: (params) => {
      // simulate delayed supply of data to the detail pane
      setTimeout( () => {
        params.successCallback([]);
      }, 1000);
    },
    template: (_params: any) => {
      return `<div id="1" style="height: 100%; padding: 20px; box-sizing: border-box;">
          <div id="2" style="height: 10%;"> 
          <div class="row" > 
          <div class="col-12">
          <p class="ml-5"> <strong class="athena" > Opérateur : </strong> 
          ${this.getOperator(_params.data.lineOrigin)} </p>
          <p class="ml-5"> <strong class="athena" > Remise attribuée : </strong> 
          ${this.parkItemListParticularService.
            getTypeRenouvellementOrRemise(_params.data.renewalMobileClassification, true)}</p>
          <p class="ml-5"> <strong class="athena" > Type de renouvellement : </strong> 
          ${this.parkItemListParticularService.
            getTypeRenouvellementOrRemise(_params.data.renewalMobileClassification, false)}</p> 
          <p class="ml-5"> <strong class="athena" > Dernier Rafraichissement : </strong> 
          ${this.getTime(_params.data.lastUpdatedDate)}</p>
          ${(_params.data.linkedParkItemLabel) ? `<strong class="athena ml-5 " > ligne liée :  </strong> ${_params.data.linkedParkItemLabel}` : ``}  
          </div>
          ${this.renderBlocDetail(_params.data)}
          </div>
          </div>
          </div>
          `;
    }
  };
  
  parkItems: CustomerParkItemVO[];
  customerId: string;
  params: { force: boolean; suppressFlash: boolean; };


  constructor(readonly route: ActivatedRoute, readonly router: Router, 
    readonly parcLigneService: ParcLigneService, readonly parkItemListParticularService: ParkItemListParticularService, 
    readonly confirmationDialogService: ConfirmationDialogService, readonly datePipe: DateFormatPipeFrench,
    private readonly redirectionService: RedirectionService,
    private readonly cartService: CartService) { }

  ngOnInit(): void {
    this.route.data.subscribe(resolversData => {
      this.userConnecte = resolversData['userConnecte'];
    });
    
    this.route.parent.paramMap.subscribe(params => {
      this.customerId =params.get('customerId');
    });

    this.route.data.subscribe(resolversData => {
      this.parkItems = resolversData['fullCustomerParkItem'];
    });
    this.redirectionService.getAgGridLoader().subscribe((load) => {
      if (load) {
        this.params = {
          force: true,
          suppressFlash: true,
        };
      }
  });
  }

  getTime(dateTime: any){
    let minutes: any;
    let houres : any
    minutes= new Date(dateTime).getMinutes();
    minutes = ((minutes < 10) ? '0' : '') + minutes;
   houres= new Date(dateTime).getHours()+0;
   houres = ((houres < 10) ? '0' : '') + houres ;
   houres =((houres > 23) ? '00' : houres) + this.heur;
    return !isNullOrUndefined(dateTime)  ? this.datePipe.transform(dateTime, this.datePattern) + this.space + houres + minutes : "-" ;
}

  getBeneficiaryName(firstName: string, lastName: string): string {
    let name = '-';
    if (firstName && lastName) {
      name = `${firstNameFormatter(firstName)} ${toUpperCase(lastName)}`;
    } else if (firstName && !lastName) {
      name = firstNameFormatter(firstName);
    } else if (!firstName && lastName) {
      name = toUpperCase(lastName);
    }
    return name;
  }

  getLineAndType(params: any): any {
    const type = this.parkItemListParticularService.getTypeImage(params.data.universe);
    const line = this.parkItemListParticularService.defaultLigne(params.data.webServiceIdentifier);
    return `<span class="icon ${type}"></span>${line}`;
  }

  lineComparator(t1: string, t2: string, param1: any, param2: any): number {
    if (t1.localeCompare(t2) === 0) {
      return param1.data.webServiceIdentifier.localeCompare(param2.data.webServiceIdentifier);
    }
    return t1.localeCompare(t2);
  }

  getOperator(lineOrigin: ReferenceDataVO): string {
    let operator = '-';
    if (lineOrigin) {
      operator = this.parkItemListParticularService.defaultAffiche(lineOrigin.label);
    }
    return operator;
  }

  clickCell(params: any): void {
    const btnTextAnnuler = 'Non, je ne veux pas';
    let btnTextOk = '';
    let comment = '';
    if (params.data.universe !== this.FIXE && (params.column.colId === 'line'  || params.column.colId ==='forfait'
     || params.column.colId==='status' || params.column.colId ==='rangRenewal'|| params.column.colId ==='rang'
    || params.column.colId ==='dateRenouvellement' || params.column.colId==='horsF' || params.column.colId ==='membre')) {
      this.router.navigate(
        [ '/customer-dashboard', this.customerId, 'park-item', params.data.id],
        { 
          queryParamsHandling: 'merge',
          queryParams: { from: 'all' }
        }
      );
    }
    let valueSuspend = '';
    let isSuspend = false;
    if (params.data.customerParkItemContract) {
      valueSuspend = this.parkItemListParticularService.getLabelSuspend(params.data);
      isSuspend =  this.parkItemListParticularService.isVisibleBtnSuspend(params.data.nicheContractStatus, 
        params.data.customerParkItemContract.codeStateDoss , true)
    }
    if (params.column.colId === 'suspend' && valueSuspend !== '' && this.redirectionService.hasPermission('suspendre_ligne')) {
      if (isSuspend) {
        comment = 'Êtes-vous sûr de vouloir suspendre la ligne ?';
        btnTextOk = 'Oui, je veux la suspendre';
      } else {
        comment = 'Voulez-vous réactiver la ligne';
        btnTextOk = 'Oui, je veux la réactiver';
      }
      this.openConfirmationDialog( comment, btnTextOk, btnTextAnnuler, params.column.colId, params.data);
    }
    
    const isVisibleRefresh = this.parkItemListParticularService.isVisibleBtnRefresh(params.data.nicheContractStatus);
    if (params.column.colId === 'refresh' && isVisibleRefresh && this.redirectionService.hasPermission('retablir_ligne')) {
      this.parkItemListParticularService.refreshLigne(params.data.id, this.userConnecte.id).subscribe( data => {
        this.getParkItems();
      }); 
    }
    if (params.column.colId === 'delete' && this.redirectionService.hasPermission('supprimer_ligne')) {
      comment = 'Êtes-vous sûr de vouloir supprimer la ligne ?';
      btnTextOk = 'Oui, je veux la supprimer';
      this.openConfirmationDialog( comment, btnTextOk, btnTextAnnuler, params.column.colId, params.data);
    }
    const isVisibleBloque = this.parkItemListParticularService.isVisibleOrActiveUnlock(params.data);
    if (params.column.colId === 'unlock' && isVisibleBloque && this.redirectionService.hasPermission('debloquer_ligne')) {
      comment = 'Êtes-vous sûr de vouloir débloquer la ligne ? ';
      btnTextOk = 'Oui, je veux la débloquer';
      this.openConfirmationDialog( comment, btnTextOk, btnTextAnnuler, params.column.colId, params.data);
    }

    if (params.column.colId === 'update' && this.redirectionService.hasPermission('modifier_ligne')){ 
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'detail', 'creation-line',  params.data.id,'update'],
      {
        queryParamsHandling: 'merge',
        queryParams: { typeRequest: 'all',   from: 'all' ,modificationLine :  'true',
         rangRenewal : params.data.rangRenewal }
      }); 
    }
   
  }

  openConfirmationDialog(comment: string, btnOkText: string, btnCancelText: string, action: string, params: any): any {
    this.confirmationDialogService.confirm('', comment, btnOkText, btnCancelText, 'lg')
    .then((confirmed) => {
      if (confirmed && action === 'suspend') {
        this.parkItemListParticularService.suspendLine
        (params.id, this.parkItemListParticularService.isVisibleBtnSuspend(params.nicheContractStatus, 
          params.customerParkItemContract.codeStateDoss, true) ).subscribe( data => {
            this.getParkItems();
          });
      } else if (confirmed && action === 'delete' && this.redirectionService.hasPermission('supprimer_ligne')) {
        this.parkItemListParticularService.deleteLine(params.id).subscribe( data => {
          this.getParkItems();
        });
      } else if (confirmed && action === 'unlock') {
        this.parkItemListParticularService.unlockParkItem(params.id).subscribe (data => {
          this.getParkItems();
        });
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  getParkItems(): void {
    this.parcLigneService.getParkItemsOfBeneficiariesByHolderId(this.customerId).subscribe( data => {
      if (data) {
        this.parkItems = data; 
      }
    },
      (error) => {
        console.log('error');
      }
     );
  }
  dateFormatter(dateIn) :string{
    {
      if (dateIn === 'null' || dateIn == null) {
        return '-';
      }
      
      const hour = dateIn.toString().substring(11, 13);
      const min = dateIn.toString().substring(14, 16);
      const date = this.datePipe.transform(dateIn,this.datePattern);
      return `${date} à ${hour}h${min}`;
    }
  }

  renderBlocDetail(data : any) {
 
    if(isNullOrUndefined(data.customerParkHardwareAssociatedLineVO) 
    || isNullOrUndefined(data.customerParkHardwareAssociatedLineVO?.productCategoryName)
    || !this.categorieList.includes(data.customerParkHardwareAssociatedLineVO?.productCategoryName)
    || data.universe !== UNIVERS_MOBILE){

      return '';
    }
   else{
    return `<div class="col-12">
   
    <p class="mt-2"> <strong class="athena " >  Date de livraison du terminal : </strong>${
   this.parkItemListParticularService.getTimeWithoutHM(data.customerParkHardwareAssociatedLineVO?.dateDelivery)}</p>
   <p class ="d-flex"><strong class="athena " >  Facture service associée : </strong>
        ${ data.customerParkHardwareAssociatedLineVO.commandOrderStatus && ![CANCELED_COMMAND_ORDER_STATUS , ABANDONED_COMMAND_ORDER_STATUS].includes(data.customerParkHardwareAssociatedLineVO.commandOrderStatus) ?
          this.getBill(data.customerParkHardwareAssociatedLineVO?.billAccountId , data.customerParkHardwareAssociatedLineVO?.cartId):'-'}</p>
      <p class=""> 
      <strong class="athena" >  Numéro de ligne utilisé : </strong>${
           this.parkItemListParticularService.getValue(data.customerParkHardwareAssociatedLineVO?.nicheContractStatus,
            data.customerParkHardwareAssociatedLineVO?.dateLastChange)}</p>
        
     </div>

    `
   }
}

getBill(billAccountId : string , cartId :number){
  if(!isNullOrUndefined(billAccountId)){
    this.cartId = cartId
    return '<span id= "billDownload" class = "icon download ml-2" ></span> '
  }
  
  
  return '-';
}
@HostListener('click', ['$event'])
onClick(event) {
    if (event.target.id === this.billDownload) {
      this.cartService.generateCartTinyBill( this.cartId , "true" ).subscribe((data) => {
        const filePdf = this.parkItemListParticularService.blobToArrayBuffer(data.document);
        this.parkItemListParticularService.saveResponseFileAsPdf(data.name, filePdf);
      })
    }
}

}
