import { ABANDONED_COMMAND_ORDER_STATUS, CANCELED_COMMAND_ORDER_STATUS } from './../../../_core/constants/constants';
import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';

import { RedirectionService } from './../../../_core/services/redirection.service';

import { CSS_CLASS_NAME } from '../../../_core/constants/constants';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { ParcLigneService } from '../../../_core/services';
import { CustomerParkItemVO } from '../../../_core/models/customer-park-item-vo';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined, isEmpty } from '../../../_core/utils/string-utils';
import { DateFormatPipeFrench } from '../../../_shared/pipes';
import { ParkItemListParticularService } from './park-item-list-particular.service';
import { UserVo } from '../../../_core/models/user-vo';
import { CartService } from '../../../_core//services/cart.service';
import { UNIVERS_MOBILE } from '../../../_core/constants/bill-constant';



@Component({
  selector: 'app-park-item-list-particular',
  templateUrl: './park-item-list-particular.component.html',
  styleUrls: ['./park-item-list-particular.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParkItemListParticularComponent implements OnInit {


  parkItems: CustomerParkItemVO[];
  userConnecte: UserVo;
  incompleteCall = true;
  datePattern =  "dd MMM yyyy";
  space = '  ';
  heur = "h";
  FIXE = 'FIXE';
  cartId = null;
  public isEmpty = isEmpty;
  categorieList=["Assurance" , "Produit" , "Renouvellement Annuel","SAV"];
  rowData: any[];
  customerId: string;
  defaultSortModel: any[];
  typeClient: string;
  billDownload = "billDownload";
  detailCellRendererParams = {
    
    detailGridOptions: {
      columnDefs: [],
      defaultColDef: { flex: 1 }
    },
    getDetailRowData: (params) => {
      console.log(params);
      // simulate delayed supply of data to the detail pane
      setTimeout( () => {
       
        params.successCallback([]);
      }, 1000);
    },
    template: (_params: any) => {
      return ` <div   style="height: 100%; margin-left: 40px; padding: 0 20px 0 20px; box-sizing: border-box;">

       
        <div class="row" > 
        <div class="col-12">
          <ul class="ath-summary">
          <li> <strong class="athena " >  Titulaire : </strong>  ${_params.data.name}</li>
          <li> <strong class="athena " >  Utilisateur :  </strong>${this.parkItemListParticularService.
            getLineHolderTypeAndName(_params.data.lineHolder,_params.data.lineHolderName)}</li>
          <li> <strong class="athena " >  Remise attribuée : </strong>${this.parkItemListParticularService.
            getTypeRenouvellementOrRemise(_params.data.renewalMobileClassification, true)}</li>
          <li> <strong class="athena " >  Type de renouvellement : </strong>${this.parkItemListParticularService.
            getTypeRenouvellementOrRemise(_params.data.renewalMobileClassification, false)}</li>
            <li> <strong class="athena " >  Dernier Rafraichissement : </strong> ${this.getTime(_params.data.lastUpdatedDate)}</li>
            ${ (_params.data.linkedParkItemLabel) ? `<li><strong class="athena " > ligne liée :  </strong> ${_params.data.linkedParkItemLabel}</li>` : ``} 
           </ul>
           </div>
          ${this.renderBlocDetail(_params.data)}
         </div>
        </div>
      </div>
      `;
    }
  };
  params: { force: boolean; suppressFlash: boolean; };

  columnDefs = [
    {
      headerName: '',
      headerTooltip: '',  
      cellRenderer: 'agGroupCellRenderer',
      width: 45,
      field: 'id',
      resizable: false,
      sortable: false
    },
    {
      headerName: 'LIGNE',
      headerTooltip: 'LIGNE',
      colId: 'ligne',
      field: 'webServiceIdentifier',
      valueGetter: params => 
      this.parkItemListParticularService.ligne(params.data.webServiceIdentifier),
      cellClass: params => { 
        return params.data.universe === this.FIXE ? `${CSS_CLASS_NAME.CELL_WRAP_TEXT} no-cursor` : CSS_CLASS_NAME.CELL_WRAP_TEXT
      },
      width: 120,
      autoHeight: true
    },
    {
      headerName: 'TYPE',
      headerTooltip: 'TYPE',
      field: 'universe',
      colId: 'type',
      cellRenderer: params => {
        if(!isNullOrUndefined(params.data.linkedParkItemId)) {
          return  `<span class='icon multisim' ></span>` 
        }
        return `<span class='icon ${this.parkItemListParticularService.getTypeImage(
          params.data.universe)}' ></span>`;
      },
      width: 110,
      cellClass: params => { 
        return params.data.universe === this.FIXE ? `${CSS_CLASS_NAME.TEXT_CENTER} no-cursor` : CSS_CLASS_NAME.TEXT_CENTER
      },
    },
    {
      headerName: 'FORFAIT',
      headerTooltip: 'FORFAIT',
      field: 'libelleContract',
      colId: 'forfait',
      comparator: this.comparatorForfait,
      valueGetter: params => 
         this.parkItemListParticularService.formatOffreCodeoffre(params.data.codeContract, params.data.libelleContract),
      cellClass: params => { 
          return params.data.universe === this.FIXE ? `${CSS_CLASS_NAME.CELL_WRAP_TEXT} no-cursor` : CSS_CLASS_NAME.CELL_WRAP_TEXT
      },
      width: 130,
      autoHeight: true
    },
    {
      headerName: 'STATUT',
      headerTooltip: 'STATUT',
      field: 'nicheContractStatus',
      colId: 'status',
      cellRenderer: params => 
        `<span class='icon ${this.parkItemListParticularService.getStatut(params.data.nicheContractStatus)}' ></span>`,
      cellClass: params => { 
          return params.data.universe === this.FIXE ? `${CSS_CLASS_NAME.TEXT_CENTER} no-cursor` : CSS_CLASS_NAME.TEXT_CENTER
      },
      width: 110
    },
    {
      headerName: 'Opérateur',
      headerTooltip: 'Opérateur',
      field: 'lineOrigin.label',
      colId: 'operator',
      valueGetter: params => 
          this.parkItemListParticularService.getOperateur(params.data.lineOrigin),
      cellClass: params => { 
        return params.data.universe === this.FIXE ? `${CSS_CLASS_NAME.CELL_WRAP_TEXT} no-cursor` : CSS_CLASS_NAME.CELL_WRAP_TEXT
      },
      width: 120
    },
    {
      headerName: 'STATUT RENOUV.',
      headerTooltip: 'STATUT RENOUV.',
      field: 'rangRenewal',
      colId: 'renouvStatut',
      comparator: this.parkItemListParticularService.statusRenewalComparator,
      cellRenderer: _params => {
      let val = '';
      if(!isNullOrUndefined(_params.data) && _params.data.universe === 'MOBILE') {
        val = `<span class="icon ${this.parkItemListParticularService.getStatutRenouv(_params.data.rangRenewal)} "></span> `
      }
      return val;
    },
    cellClass: params => { 
      return params.data.universe === this.FIXE ? `${CSS_CLASS_NAME.TEXT_CENTER} no-cursor` : CSS_CLASS_NAME.TEXT_CENTER
    },
    width: 140
    },
    {
      headerName: 'PROCHAIN RENOUV.',
      headerTooltip: 'PROCHAIN RENOUV.',
      field: 'dateRenewal',
      colId: 'dateRenouvellement',
      comparator: (d1, d2, p1, p2) => this.parkItemListParticularService.dateRenewalComparator(d1, d2, p1, p2),
      cellRenderer: params => {
        if (!isNullOrUndefined(params.data.dateRenewal) && params.data.universe === 'MOBILE'
         && params.data.rangRenewal === 'unauthorized') {
          return this.datePipe.transform(params.data.dateRenewal, this.datePattern);
        }
        return '-';
      },
      cellClass: params => { 
        return params.data.universe === this.FIXE ? `${CSS_CLASS_NAME.CELL_WRAP_TEXT} no-cursor` : CSS_CLASS_NAME.CELL_WRAP_TEXT
      },
      headerClass: 'text-right',
      width: 165,
      autoHeight: true
    },
    {
      headerName: 'HORS-FORFAIT(€)',
      headerTooltip: 'HORS-FORFAIT (€)',
      field: 'horsForfait',
      colId: 'horForfait',
      comparator: this.parkItemListParticularService.horsForfaitComparator,
      cellRenderer: _params => {
        let val = '-';
        if (!isNullOrUndefined(_params.data.horsForfait)) {
          val = `<span class='text-right cell-wrap-text' >
          <strong><span class="red cell-wrap-text">${_params.data.horsForfait}</span>`;
        }
        return val;
      },
      cellClass: params => { 
        return params.data.universe === this.FIXE ? 'text-right cell-wrap-text no-cursor' : 'text-right cell-wrap-text'
      },
      width: 140,
      autoHeight: true
    },
    {
      headerName: '', headerTooltip: '', width: 70, field: 'adv',
      cellRenderer: params => {
        if (params.data.universe !== 'INTERNET') {
          return `<span class='link' > ADV </span>`;
        }
        return ``;
      },
      autoHeight: true, sortable: false 
    },
    {
      headerName: '', headerTooltip: '', width: 60, colId: 'suspend',
      cellRenderer: params => {
        if(!isNullOrUndefined(params.data.customerParkItemContract) && this.redirectionService.hasPermission('suspendre_ligne')) {
          return this.parkItemListParticularService.getLabelSuspend(params.data);
        }
        return '';
      },  
        autoHeight: true, sortable: false
    },
    {
      headerName: '', headerTooltip: '', width: 60, colId: 'update',
      cellRenderer: () => {return this.redirectionService.hasPermission('modifier_ligne') ? `<span class='icon pen' ></span>`:``},
      autoHeight: true, sortable: false 
    },
    {
      headerName: '', headerTooltip: '', width: 60, colId: 'actualiser',
      cellRenderer: params => {
        if(this.parkItemListParticularService.isVisibleBtnRefresh(params.data.nicheContractStatus) && this.redirectionService.hasPermission('retablir_ligne')) {
          return `<span class='icon refresh' ></span>`;
        }
        return ``;
      }, 
      autoHeight: true
    },
    {
      headerName: '', headerTooltip: '', width: 60, colId: 'delete',
      cellRenderer: () => {return this.redirectionService.hasPermission('supprimer_ligne') ? `<span class='icon del' ></span>`:``},
      autoHeight: true, sortable: false
    },
    {
      headerName: '', headerTooltip: '', width: 60, colId: 'bloquer',
      cellRenderer: params => {
        if(!isNullOrUndefined(params.data.customerParkItemContract) && this.parkItemListParticularService.isVisibleOrActiveUnlock(params.data) &&
          this.redirectionService.hasPermission('debloquer_ligne')) {
          return `<span class='icon cadenas' ></span>`;
        }
        return ``;
      },
      autoHeight: true, sortable: false
    }
  ];


  constructor(private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly parcLigneService: ParcLigneService,
    private readonly parkItemListParticularService: ParkItemListParticularService,
    private readonly route: ActivatedRoute, 
    private readonly datePipe: DateFormatPipeFrench, private readonly router: Router,
    private readonly redirectionService:RedirectionService,
    private readonly cartService: CartService) {}

  ngOnInit(): void {
    this.route.data.subscribe(resolversData => {
      this.userConnecte = resolversData['userConnecte'];
    });

    this .route.parent.paramMap.subscribe(params => {
      this.customerId=params.get('customerId');
    });
    this.typeClient = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.getParkItems();
    this.defaultSortModel = [
      { colId: 'status', sort: 'asc' }
    ];
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

  getParkItems(): void {
    this.parcLigneService.getParkItemsFull(this.customerId).subscribe( data => {
      if(!isNullOrUndefined(data) && data.length > 0) {
        this.parkItems = data; 
      }
    },
      (error) => {
      console.log('error');
        },
      () => {
        this.incompleteCall = false;
        console.log('complete')
      }
     );
    }

  setColumnDef(): void {
    
  }


  comparatorForfait(val: any , val2: any, val3, val4 ): number {
    return val3.data.libelleContract.localeCompare(val4.data.libelleContract);
  }

  clickCell(params: any): void {
    const btnTextAnnuler = 'Non, je ne veux pas';
    let btnTextOk = '';
    let comment = '';
    if (params.data.universe !== this.FIXE && (params.column.colId === 'type' && this.route.snapshot.queryParams['from'] === 'all'
    || params.column.colId ==='ligne' 
    || params.column.colId ==='forfait' || params.column.colId ==='status' || params.column.colId ==='operator' 
    || params.column.colId ==='renouvStatut' || params.column.colId ==='dateRenouvellement' || params.column.colId ==='horForfait')) {
      this.router.navigate(
        [ '/customer-dashboard', this.customerId, 'park-item', params.data.id],
        { 
          queryParamsHandling: 'merge',
          queryParams: { from: 'all'}
       }
      );
  }
    let valueSuspend = '';
    let isSuspend = false
    if(!isNullOrUndefined(params.data.customerParkItemContract)) {
      valueSuspend = this.parkItemListParticularService.getLabelSuspend(params.data);
     isSuspend =  this.parkItemListParticularService.isVisibleBtnSuspend(params.data.nicheContractStatus, params.data.customerParkItemContract.codeStateDoss , true)
    }
    if (params.column.colId === 'suspend' && valueSuspend !== '' && this.redirectionService.hasPermission('suspendre_ligne') ) {
      if(isSuspend) {
        comment = 'Êtes-vous sûr de vouloir suspendre la ligne ?';
        btnTextOk = 'Oui, je veux la suspendre';
      } else {
        comment = 'Voulez-vous réactiver la ligne';
        btnTextOk = 'Oui, je veux la réactiver';
      }
      this.openConfirmationDialog( comment, btnTextOk, btnTextAnnuler, params.column.colId, params.data);
    }
    const isVisibleRefresh = this.parkItemListParticularService.isVisibleBtnRefresh(params.data.nicheContractStatus)
    if (params.column.colId === 'actualiser' && isVisibleRefresh && this.redirectionService.hasPermission('retablir_ligne') ) {
       this.parkItemListParticularService.refreshLigne(params.data.id, this.userConnecte.id).subscribe( data => {
        this.getParkItems();
      }); 
    }
    if (params.column.colId === 'delete' && this.redirectionService.hasPermission('supprimer_ligne')) {
      comment = 'Êtes-vous sûr de vouloir supprimer la ligne ?';
      btnTextOk = 'Oui, je veux la supprimer';
      this.openConfirmationDialog( comment, btnTextOk, btnTextAnnuler, params.column.colId, params.data);
    }
    let isVisibleBloque = false;
    if(!isNullOrUndefined(params.data.customerParkItemContract)) {
      isVisibleBloque = this.parkItemListParticularService.isVisibleOrActiveUnlock(params.data);
    }
    if (params.column.colId === 'bloquer' && isVisibleBloque && this.redirectionService.hasPermission('debloquer_ligne')) {
      comment = 'Êtes-vous sûr de vouloir débloquer la ligne ? ';
      btnTextOk = 'Oui, je veux la débloquer';
      this.openConfirmationDialog( comment, btnTextOk, btnTextAnnuler, params.column.colId, params.data);
    }

    if (params.column.colId === 'update' && this.redirectionService.hasPermission('modifier_ligne')){
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'detail', 'creation-line',  params.data.id,'update'],
      {
        queryParamsHandling: 'merge',
        queryParams: { typeRequest: 'all', from: 'all', modificationLine :  'true', 
        rangRenewal : params.data.rangRenewal }
      }); 
    }
   
  }

  openConfirmationDialog(comment: string, btnOkText: string, btnCancelText: string, action: string, params: any): any {
    this.confirmationDialogService.confirm('', comment, btnOkText, btnCancelText, 'lg')
    .then((confirmed) => {
      if(confirmed && action === 'suspend') {
        let isSuspend = false
        if(!isNullOrUndefined(params.customerParkItemContract)) {
          const code = params.customerParkItemContract.codeStateDoss;
          isSuspend = this.parkItemListParticularService.isVisibleBtnSuspend(params.nicheContractStatus, code, true)
        }
        this.parkItemListParticularService.suspendLine(params.id, isSuspend ).subscribe( data => {
         this.getParkItems();
        });
      } else if (confirmed && action === 'delete') {
       this.parkItemListParticularService.deleteLine(params.id).subscribe( data => {
        this.getParkItems();
       });
      } else if (confirmed && action === 'bloquer') {
        console.log(action)
       this.parkItemListParticularService.unlockParkItem(params.id).subscribe (data => {
        this.getParkItems();
       });
      }
    })
    .catch(() => console.log('exception'));
  }

  dateFormatter(dateIn : any) :string{
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


  renderBlocDetail(data : any) {
    if(isNullOrUndefined(data.customerParkHardwareAssociatedLineVO) 
    || isNullOrUndefined(data.customerParkHardwareAssociatedLineVO?.productCategoryName)
    || !this.categorieList.includes(data.customerParkHardwareAssociatedLineVO?.productCategoryName)
    ||  data.universe !== UNIVERS_MOBILE){

      return '';
    }
   else{
    return `<div class="col-12">
   
    <p class="mt-3"> <strong class="athena " >  Date de livraison du terminal : </strong>${
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
  
}
