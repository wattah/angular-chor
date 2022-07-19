import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEmpty, isNullOrUndefined } from './../../../../_core/utils/string-utils';
import { CalculeCartPricesService } from './../../../../_core/services/calcule-cart-prices.service';
import { OrderStatus, CartStatus } from './../../../../_core/enum/cart.enum';
import { StocksValue } from './../../../../_core/enum/cart.enum';
import { CommandOrderLineVO } from './../../../../_core/models/command-order-line-vo';
import { TabLogisticsProcessingService } from './tab-logistics-processing.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnChanges, SimpleChanges, HostListener, EventEmitter, Output } from '@angular/core';
import { CommandOrderVo } from './../../../../_core/models/command-order-vo';
import { ORDER_STATUS } from './../../../../_core/constants/constants';
import { DateFormatPipeFrench } from './../../../../_shared/pipes/dateformat/date-format.pipe';
import { RedirectionService } from '../../../../_core/services/redirection.service';
import { HttpCommandOrderService } from '../../../../_core/services/http-command-order.service';
import { AuthTokenService } from '../../../../_core/services/auth_token';
import { CommandOrderResultVO } from './../../../../_core/models/command-order-result-vo';
import { CartConfirmationDialogService } from '../../cart-confirmation-dialog/cart-confirmation-dialog.service';
import { ReinstatementArticlePopUpComponent } from './reinstatement-article-pop-up/reinstatement-article-pop-up.component';
import { GenerateCommandOrderService } from '../../../../_core/services/generate-command-order.service';
import { Observable } from 'rxjs';
import { CatalogeService } from '../../../../_core/services/http-catalog.service';



@Component({
  selector: 'app-tab-logistics-processing',
  templateUrl: './tab-logistics-processing.component.html',
  styleUrls: ['./tab-logistics-processing.component.scss']
})
export class TabLogisticsProcessingComponent implements OnInit , OnChanges {
  
  
  

  iconeDelHtml:any = '<span class="icon del"></span>';
  iconePenHtml:any = '<span class="icon tab_download"></span>';
  static readonly text = 'Vous avez effectué des modifications. <br/>Veuillez enregistrer le panier avant de déclencher la livraison.';
  messageSuccesForUnblocking = 'Le déblocage des articles a bien été effectué';
 
  clickedRowId : any;
  commandOrderLines : CommandOrderLineVO[]=[];
  rowData : any[] = [];
  openedTabCounter = 0;
  customerId: number;
  columnDefs: any[];
  defaultSortModel: any[];
  position = 'left';
  cart;
  @Input() visibleActionsOnLogistic;
  @Input() visibleActionOnUnblocking: boolean;
  newCommandOrder: CommandOrderVo;
  params: { force: boolean; suppressFlash: boolean; };
  newRowData;
  checkIfAOCExists = null;
  @Input() isCartChanged = false;
  @Input() cartResultAfterSave = null;

  @Output() loadingLogisticData = new EventEmitter<boolean>(false);
  commandOrderResultVO:CommandOrderResultVO;
  filteredPersons: Observable<boolean[]>; 
  rowIndexClicked : number;
  detailCellRendererParams = {
    
    detailGridOptions: {
      columnDefs: [],
      defaultColDef: { flex: 1 }
    },
    getDetailRowData: (params) => {
      // simulate delayed supply of data to the detail pane
      setTimeout( () => {
        params.successCallback([]);
      }, 1000);
    },
    refreshStrategy: 'everything',
    template: (_params: any) => {
      this.commandOrderHisto = _params.data.commandOrderHisto;
      const commandOrderHisto = _params.data.commandOrderHisto;
      return ` 
      <div style="height: 100%;padding: 20px; box-sizing: border-box;
      white-space: normal !important;
      word-wrap: break-word !important;">

<div class="row" > 

<div class=" d-none d-md-none d-lg-block col-24" style="user-select: text !important;">
<div> <strong class="athena" >  Stock : </strong>  ${_params.data.stockToUse ? _params.data.stockToUse:'-' } </div>
<div> <strong class="athena" >  Ordre de commande : </strong>  ${_params.data.commandOrderReference ? _params.data.commandOrderReference:'-' } </div>
<div> <strong class="athena" >  Bordereau de livraison: </strong>   ${_params.data.bonLivraison ? _params.data.bonLivraison:'-' } </div>
<div> <strong class="athena" >  Article : </strong> 
<ul class="mb-0 simple w-100" >
${
  _params.data.commandOrderCartItems.map(
    (product)=>this.renderProductField(product)
  ).join('')
}
</ul>
</div>
${
  commandOrderHisto.map(
    (command)=>this.renderDelivryDateProgression(command)
  ).join('')
}
<div class="col-sm-24 p-0 my-2 athena justify-content-left">
${(this.visibleActionsOnLogistic && this.renderDeliverBtn(_params.data)) ? 
  `<button class=" col-form-label btn btn-blue" id="CODeliver" data-COId="${_params.data.id}" > Livrer l'ordre de commande </button>` : ``} 

</div>
</div>

<div class="d-lg-none col-24"> 
<div> <strong class="athena" >  Numéro de suivi:  </strong> ${_params.data.transporterTrackingRef ? _params.data.transporterTrackingRef:'-'} </div>
<div> <strong class="athena" >  Stock : </strong>  ${_params.data.stockToUse ? _params.data.stockToUse:'-' } </div>
<div> <strong class="athena" >  Ordre de commande : </strong>    ${_params.data.commandOrderReference ? _params.data.commandOrderReference:'-' } </div>
<div> <strong class="athena" >  Bordereau de livraison: </strong>   ${_params.data.bonLivraison ? _params.data.bonLivraison:'-' } </div>
<div> <strong class="athena" >  Article : </strong> 
  <ul class="mb-0 simple w-100" > 
  ${
    _params.data.commandOrderCartItems.map(
      (product)=>this.renderProductField(product)
    ).join('')
  }
  </ul>
  </div>
  ${
    commandOrderHisto.map(
      (command)=>this.renderDelivryDateProgression(command)
    ).join('')
  }
</div>

  
      `;
    }
  };

  commandOrders: CommandOrderVo[];
  cartItems: any;
  cartLight:any;
  requestId:any;
  commandOrderHisto: any;
  deliveryBotton: string;
  redrawDetailsRows = false;
  collapseAllRows: boolean;
  counter = 0;
  formCatalog: string;
  expandedAllRows: boolean;
  compteur = 0;
  show = true;
  compteur2 = 0;
  hasItemToDelete = false;
  hasItemToRestore: boolean;
  hasItemsToDelete = [];
  hasItemsToRestore = [];
  COHasNoItemsToReinstate : number[] = [];
  itemsHasBeenReinstated : number[] = [];
  getRowHeight ;
  isBlocked = false;
  constructor(private readonly dateFormatPipeFrench: DateFormatPipeFrench,
              private readonly route: ActivatedRoute,
              private readonly redirectionService: RedirectionService ,
              private readonly commandOrderService: HttpCommandOrderService,
              private readonly authTokenService: AuthTokenService,
              private readonly cartConfirmationDialogComponent: CartConfirmationDialogService,
              private readonly modalService: NgbModal,
              private readonly tabLogisticsProcessingService : TabLogisticsProcessingService,
              private readonly calculeCartPricesService: CalculeCartPricesService,
              private readonly datePipe: DatePipe,
              private readonly generateOcService : GenerateCommandOrderService,
              private readonly catalogManagement: CatalogeService,
              private readonly _snackBar: MatSnackBar) {
                this.calculateRowHeight();
              }

  ngOnChanges(changes: SimpleChanges){
    if(changes['visibleActionsOnLogistic']){
      this.redrawDetailsRows = true;
      if(this.counter % 2 === 0){
        this.collapseAllRows = false;
      }else{
        this.collapseAllRows = true;
      }
      this.counter++;
      this.params =  {
        force: true,
        suppressFlash: true,
      };
    }
    
  }

  @HostListener('click', ['$event'])
  onClick(event) {
      if (event.target.id === 'CODeliver') {
        this.CODelivery(event.srcElement.dataset.coid, event);
      }
  }

  CODelivery(COId : number, event:any){
    this.tabLogisticsProcessingService.showPopUpDeliverCommandOrder(COId, (dataReturned) => this.updateDataAfterDeliverOC(COId,dataReturned,event));
  }

  updateDataAfterDeliverOC(COId: number, dataReturned : any,event : any): void { 
    this.rowData.find( co => co.id === Number(COId)).status =  dataReturned.status;
    this.rowData.find( co => co.id === Number(COId)).statusDate = this.dateFormatter(dataReturned.statusDate);
    let commandOrderHistoNewList : any[] = []
    this.rowData.find( co => co.id === Number(COId)).commandOrderHisto.forEach(COHisto => {
      commandOrderHistoNewList.push(COHisto);
    });
    commandOrderHistoNewList.push(dataReturned);
    this.rowData.find( co => co.id === Number(COId)).commandOrderHisto = commandOrderHistoNewList;
    const row = this.rowData.find( co => co.id === Number(COId));
    this.params = {
      force: true,
      suppressFlash: true,
    };
    event.srcElement.hidden = true;
    this.renderDeliverBtn(row);
  }

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('idRequest');
    this.redirectionService.getAgGridLoader().subscribe(
      (load)=>{
        if(load){
          this.redrawDetailsRows = true;
          this.params =  {
            force: true,
            suppressFlash: true,
          };
        }
      }
    );
    this.route.queryParamMap.subscribe(params => {
      this.formCatalog = params.get('formCatalog');
    });
    this.requestId = this.route.snapshot.paramMap.get('idRequest');
    this.redrawRowsAndDetails();
    this.defaultSortModel = [
      { colId: 'type', sort: 'desc' }
    ];
    
    window.addEventListener('resize', () => {
      setTimeout( () => {
        if (window.innerWidth > 991) {
          this.setColumnDef();
        } else {
          this.columnDefs = [
            {
              headerName: ' ',
              headerTooltip: '',  
              cellRenderer: 'agGroupCellRenderer',
              field: 'arrow',
              resizable: true,
              minWidth: 30,
              maxWidth: 30,
              suppressSizeToFit: true,
        
              cellClass:'whitespace',
            },
            {
              headerName: 'Type',
              headerTooltip: '',  
              field: 'type',
              resizable: true,
              minWidth: 60,
              maxWidth: 60,
              valueGetter: (params)=> this.setType(params.data.type),
              suppressSizeToFit: true,
              hide:false,
              cellClass:'non',
            },
            {
              headerName: 'Date ordre',
              headerTooltip: '',  
              field: 'createdDate',
              minWidth: 90,
              maxWidth: 90,
              valueGetter: (params) => params.data ? this.dateFormatter(params.data.createdDate):'',
              headerClass:'non',
              cellClass:'whitespace',
              resizable: true,
            },
            {
              headerName: "Statut d'expédition",
              headerTooltip: 'N°',
              field: 'statusexp',
              suppressSizeToFit: true,
              valueGetter: (params) => params.data ? this.getStatus(params.data.status):'',
              minWidth: 100,
              maxWidth: 100,
              cellClass:'whitespace',
              resizable: true,
             
            },
            
          ];
        }
      });
    });
    if (window.innerWidth > 991 ) {
      this.setColumnDef();
    }

  }

  
  buildCartItemsOc(){
    if(this.commandOrders){
      this.commandOrders.forEach(commandOrder => {
        commandOrder.commandOrderCartItems = [];
       
      const commandOrderLines = commandOrder.commandOrderLines;
      if(commandOrderLines && this.cartItems){
        commandOrderLines.forEach(line => {
          this.cartItems.forEach(cartItem => {
           if(cartItem.id === line.cartItemId){
             commandOrder.commandOrderCartItems.push(cartItem);
           }
          });
        });
       
      }
      })
    }}
  addArrowsToOrderCommands() {
    if(this.commandOrders){
      this.commandOrders.forEach(
        (command)=>{
          command.arrow = ''
        }
      )
    }
  }
  setType(type: any) {
    return type && type === 'OUT' ? 'Sortie':'Entrée';
  }

  dateFormatter(beginDate) {
    {
      if (isNullOrUndefined(beginDate) || beginDate === 'null') {
        return '-';
      }
      const date = this.dateFormatPipeFrench.transform(
        beginDate,
        'dd MMM yyyy'
      );
      return `${date}  ${this.datePipe.transform(beginDate , "HH'h'mm")}`;
    }
  }

  setColumnDef(): void {
    this.columnDefs = [
      {
        headerName: ' ',
        headerTooltip: 'arrow',  
        cellRenderer: 'agGroupCellRenderer',
        field: 'id',
        minWidth: 35,
   
  
      },
  
  
      {
        headerName: 'Type',
        headerTooltip: '',  
        field: 'type',
        cellClass:'whitespace',
        minWidth: 90,
        valueGetter: (params)=> this.setType(params.data.type),
        suppressSizeToFit: true,
        hide:false,
        headerClass:'non',
  
      },
  
      {
        headerName: 'Date ordre',
        headerTooltip: '',  
        field: 'createdDate',
        minWidth: 100,
        valueGetter: (params) => params.data ? this.dateFormatter(params.data.createdDate):'',
        cellStyle: {'white-space': 'normal' },
        headerClass:'non',
        cellClass:'whitespace',
  
      },
  
      {
        headerName: 'Livraison  souhaitée',
        headerTooltip: 'Livraison  souhaitée',
        field: 'deliveryAt',
        valueGetter: (params) => params.data ? this.dateFormatter(params.data.deliveryAt):'',
        cellStyle: {'white-space': 'normal' },
        minWidth: 100,     
      },
      {
        headerName: 'Date envoi',
        headerTooltip: '',   
        field: 'sendToPublidispatchDate',
        headerClass:'yess',
        valueGetter: (params) => params.data ? this.dateFormatPipeFrench.transform(
          params.data.sendToPublidispatchDate,
          'dd MMM yyyy'
        ):'',
        cellClass:'yess',
        minWidth: 100,
      },
      {
        headerName: "Statut d'expédition",
        headerTooltip: '',
        field: 'status',
        valueGetter: (params) => params.data ? this.getStatus(params.data.status):'',
        suppressSizeToFit: true,
        minWidth: 100,
        headerClass:'non',
        cellClass:'whitespace',
  
       
      },
      {
        headerName: 'Date statut',
        headerTooltip: '',
        field: 'statusDate',
        headerClass:'yess',
        valueGetter: (params) => params.data ? this.getStatusDate(params.data.commandOrderHisto ,params.data.status ):'',
        minWidth: 100,
        cellClass:'whitespace',
      },
      {
        headerName: 'Numéro de suivi ',
        headerTooltip: '',
        field: 'transporterTrackingRef',
         cellClicked:'true',
        headerClass:'yess',
        cellClass:'yess',
        minWidth: 110,
        suppressSizeToFit: true,
        cellRenderer: params => {
          if(params.data.transporterTrackingRef){
            return `<a href=${params.data.flowTrakingUrl} target="_blank">${params.data.transporterTrackingRef} </a>`;
          }
          return '-';          
        }
      },
  
 
      {
        headerName: '',
        headerTooltip: '',
        field: 'reinstate',
        cellRenderer: params => {
            return this.visibleActionsOnLogistic ? this.renderReinstateIconeCell(params.data):''; 
        },
        minWidth: 40,
        headerClass:'yess',
        cellClass:'yess',
      },
  
      {
        headerName: '',
        headerTooltip: '',
        field: 'delete',
      
        cellRenderer: params => { 
            return this.visibleActionsOnLogistic ? this.renderDeleteIconeCell(params.data):''; 
        },
        minWidth: 40,
        headerClass:'yess',
        cellClass:'yess',
    
      },
    ];
  }

  renderDeliverBtn(params){
    if(params.status !== OrderStatus['DELIVERED'] && params.status !== OrderStatus['REJECTED'] &&
     params.status !== OrderStatus['ABANDONED']  && params.status !== OrderStatus['CANCELED']){
      return true;
    }else{
      return false;
    }
}

  renderReinstateIconeCell(params){
    let goAhead = true;
    this.COHasNoItemsToReinstate.forEach(coId=> {
      if(coId === params.id){
        goAhead = false;
        let firstIndexOfCOWithNoItems;
        do{
            this.hasItemsToRestore.forEach(commandO =>{
              firstIndexOfCOWithNoItems = this.hasItemsToRestore.indexOf(this.hasItemsToRestore.find(co => co.id === coId && commandO.id === coId));
              this.hasItemsToRestore.splice(firstIndexOfCOWithNoItems,1);
            });
        }while(!isNullOrUndefined(this.hasItemsToRestore.find(co => co.id === coId)));
      }
    });

    if(goAhead){
      return this.reinstate(params);
    }
    return '';
}

reinstate(params){
  this.hasItemToRestore  = false;
      // Le Type d’OC est Sortie
      if(params.type && params.type === 'OUT'){
        // Le statut d'expédition de l’OC est différent de Rejeté ou Abandonné (*si le statut est égal à En charge, Expédié ou Annulé)*
        if(params.status !== OrderStatus['ABANDONED'] && params.status !== OrderStatus['REJECTED']){
          if(params.stockToUse && this.checkStockToUseOfCOAndStatus(params)){
            // Le statut du panier est différent de"livré", "en constitution" et "abandonné"
            if(this.cartLight.status && this.checkCartStatus(params)){
              // L'OC contient des articles non réintégrés
              params.commandOrderLines.forEach(commandOrderLine => {
                this.cartItems.forEach(cartItem => {
                  if(commandOrderLine.cartItemId === cartItem.id && commandOrderLine.status !== OrderStatus['CANCELED']){
                    this.hasItemsToRestore.push({id: params.id , isRestored: true}); 
                    this.hasItemToRestore = true;
                  }
                });
              });
              if(this.hasItemToRestore){
                return this.iconePenHtml;
              }
            }
          }
        }
      }
}

// Si Le stock choisi lors de la génération de l'oc est différent de Publidispatch 
// on vérifie si le statut est différent de Créé ou à Confirmé (en charge) on affiche le picto de réintégration sinon on ne l'affiche pas
checkStockToUseOfCOAndStatus(params){
  if(params.stockToUse !== StocksValue['PBL01']){
    if(params.status !== OrderStatus['CREATED'] && params.status !== OrderStatus['CONFIRMED']){
      return true;
    }else{
      return false;
    }
  }
  return true;
}

// Si le stock choisi lors de la génération de l'oc est différent de Publidispatch, 
// on vérifie si le statut du panier est différent de : en constitution, livré et abondonné.
checkCartStatus(params){
  if(params.stockToUse !== StocksValue['PBL01']){
    if(this.cartLight.status !== CartStatus['PENDING'] && this.cartLight.status !== CartStatus['DELIVERED'] && this.cartLight.status !== CartStatus['ABANDONED']){
      return true;
    }else{
      return false;
    }
  }
  return true;
}

  renderDeleteIconeCell(params){
    if(params.stockToUse && params.stockToUse === StocksValue['PBL01'] && params.status === OrderStatus['CREATED']){
      if(isNullOrUndefined(this.hasItemsToDelete.find(co=> co.id === params.id))){
        this.hasItemsToDelete.push({id: params.id , isDeleteble: true}); 
      } 
      this.hasItemToDelete = true;
        return this.iconeDelHtml;
      }else if(params.stockToUse && params.stockToUse !== StocksValue['PBL01'] && (params.status === OrderStatus['CREATED'] || params.status === OrderStatus['CONFIRMED'])){
        if(isNullOrUndefined(this.hasItemsToDelete.find(co=> co.id === params.id))){
          this.hasItemsToDelete.push({id: params.id , isDeleteble: true}); 
        } 
        this.hasItemToDelete = true;
        return this.iconeDelHtml;
      }
  }

  isDeletebleItem(params): boolean {
      if(params.stockToUse && params.stockToUse === StocksValue['PBL01'] && params.status === OrderStatus['CREATED']){
        return true;
      }else if(params.stockToUse && params.stockToUse !== StocksValue['PBL01'] && (params.status === OrderStatus['CREATED'] || params.status === OrderStatus['CONFIRMED'])){
        return true;
      }
      return false;

     } 
  
  isRestoredItem(id): boolean {
        const hasItemsToRestoreClone = this.hasItemsToRestore.slice();
        return hasItemsToRestoreClone.filter(item=> item.id === id)[0] ? true : false;
  } 

  getStatusDate(commandOrderHisto: any , status) {
    if(commandOrderHisto && commandOrderHisto.length !== 0){
      
      const command = commandOrderHisto.filter(command=> command.status === status && command.statusDate && isNullOrUndefined(command.updateDate))[0];
      if(command){
        return this.dateFormatter(command.statusDate);
      } else {
        return '';
      }
      
    }
    return '';
  }
  getStatus(status: any) {
    return ORDER_STATUS[status];
  }
  getDateByStatus(status: string) {
    const commandOrderHistoClone = this.commandOrderHisto.slice();
    const command = commandOrderHistoClone.filter(command=>command.status===status)[0];
    return command ? this.dateFormatter(command.statusDate):'';
  }
  checkProductLabel(product: any) {
    return product.productLabel ? product.productLabel:'-';
  }
  checkProductSerial(product: any) {
    return product.serial ? product.serial:'-';
  }
  private renderProductField(product: any) {
    return `<li>${this.checkProductLabel(product)}: ${this.checkProductSerial(product)}</li>`;
  }
  
  private renderDelivryDateProgression(command: any) {
    return `<div> <strong class="athena" > ${this.getStatus(command.status)} le: </strong>   ${this.getDateByStatus(command.status)} </div>`;
  }
  
  setNewRowOC(){
    this.commandOrderResultVO.commandOrder.arrow = '';
    const lines = this.commandOrderResultVO.commandOrder.commandOrderLines
    this.commandOrderResultVO.commandOrder.commandOrderCartItems = [];
    if(lines && this.cartItems){
    lines.forEach(line => {
      this.cartItems.forEach(item => {
       if(item.id === line.cartItemId){
        this.commandOrderResultVO.commandOrder.commandOrderCartItems.push(item);
       }
      }); 
    });}
    if(this.rowData){
      this.rowData.unshift(this.commandOrderResultVO.commandOrder);
    }
    else{
      const commandOrderList = [];
      commandOrderList.push(this.commandOrderResultVO.commandOrder)
      this.rowData = commandOrderList;
    }
    
     this.newRowData =  this.rowData.slice();
        this.params = {
          force: true,
          suppressFlash: true,
        };
     
  }
  
  
  checkIfCartIsSaved ():boolean{
  if(this.isCartChanged){
    return true;
  }
  return false;
  }


  triggerOCandBLWingsm(){
    if(this.cartLight && this.cartLight.id){
      this.loadingLogisticData.emit(true);
       this.generateOcService.checkIfACommandOrderExists(this.cartLight.id).subscribe( data => {
        this.loadingLogisticData.emit(false);
        if(data){
          this.generateOcService.popUpOCExists(GenerateCommandOrderService.comment).subscribe( confirmed => {
           if(confirmed){
            this.launchDelivery();
           }

          });
        }
        else{
          this.launchDelivery();
        }
      }); 
      }
    
   }
    
   launchDelivery(){
    if( !this.checkIfCartIsSaved()){
      this.loadingLogisticData.emit(true);
      this.generateOcService.launchSaveOC(this.requestId).subscribe( commandOrderResVO => {
        this.loadingLogisticData.emit(false);
        if(!isNullOrUndefined(commandOrderResVO)){
          this.commandOrderResultVO = commandOrderResVO ;
          if(!isEmpty(this.commandOrderResultVO.errorOrInfosMessage)){
           this.generateOcService.popUperrorOrInfosMessage(this.commandOrderResultVO.errorOrInfosMessage)
          }
          if(this.commandOrderResultVO.commandOrder != null){
            this.setNewRowOC();
           }
          
        }
      });
      
     }
    else{
  
     this.generateOcService.popUperrorOrInfosMessage(TabLogisticsProcessingComponent.text);
    }
   }
  


  clickCell(params: any): void {
     if (params.column.colId === 'reinstate' && this.visibleActionsOnLogistic && this.isRestoredItem(params.data.id) ) {
      const modalReinstateArticle = this.modalService.open(ReinstatementArticlePopUpComponent,
        { centered: true, size: 'lg' }
      );
      modalReinstateArticle.componentInstance.commandOrderVo = params.data;
      modalReinstateArticle.componentInstance.cartItems = this.cartItems; 
      modalReinstateArticle.componentInstance.cartLight = this.cartLight;
      modalReinstateArticle.componentInstance.requestId = this.requestId;
      modalReinstateArticle.componentInstance.userId = this.authTokenService.applicationUser.coachId;
      modalReinstateArticle.componentInstance.itemsHasBeenReinstated = this.itemsHasBeenReinstated;
      
      modalReinstateArticle.result.then((returnedData) => {
        const listNewCommandOrder = returnedData[0];
        if(listNewCommandOrder && listNewCommandOrder.length !== 0){
          // ajouter les nouvelles lignes dans rowData
          listNewCommandOrder.forEach( co => {
            this.rowData.unshift(co);
            this.newRowData =  this.rowData.slice();
          });
          if(returnedData[1] === 0){
            params.column.visible = false;
            this.COHasNoItemsToReinstate.push(params.data.id);
          }
          if(returnedData[2].length > 0){
            returnedData[2].forEach(item => {
              this.itemsHasBeenReinstated.push(item.id);
            });
          }
          this.params = {
            force: true,
            suppressFlash: true,
          };
          this.redrawRowsAndDetails();
        }
      });  
    }else if(params.column.colId === 'delete' && this.visibleActionsOnLogistic && this.isDeletebleItem(params.data)){
      this.tabLogisticsProcessingService.showPopUpDeleteCommandOrder(params.data,(newdata) => this.updateDataAfterDeleteOC(params,newdata));
    }
  }


  redrawRowsAndDetails(){
    this.route.data.subscribe(resolve=>{
      if(!isNullOrUndefined(this.formCatalog) && this.formCatalog === "yes" && !isNullOrUndefined(this.calculeCartPricesService.cart)){
        this.cart = this.calculeCartPricesService.cart; 
        this.calculeCartPricesService.cart = null;
      } else {
        this.route.data.subscribe((resolve) => {
        this.cart = resolve['carts'][0];
      });
    }
    this.cartItems = this.cart && this.cart.request ? this.cart.request.cartItems:[];
    this.commandOrders = this.cart ? this.cart.commandOrders:[];
    this.cartLight = resolve['cartLight']?resolve['cartLight'][0]: null ;
    if(!isNullOrUndefined(this.cartLight)) {
      this.isBlocked = this.cartLight.blocked;
    }
    if(this.commandOrders && this.cartItems){
      this.buildCartItemsOc();
    }
    this.addArrowsToOrderCommands();
    this.rowData = this.commandOrders;
    })
  }


  replaceAtRow( newData, indexOfDeletedRow): any[]{
    let newRowData = [];
    newRowData  = this.rowData.map((item, index) => { return index === indexOfDeletedRow? newData : item; }); 
    return newRowData ;
  }
  updateDataAfterDeleteOC(params: any, newData : any): void {
    this.rowData = this.replaceAtRow(newData, params.rowIndex);
    this.cart.commandOrders =  JSON.parse(JSON.stringify(this.rowData));
    // update cart aftrt delete 
    this.renderDeleteIconeCell(params.data);
  }

  expandedAll() {
    this.show = false;
    if (this.compteur % 2 === 0) {
      this.expandedAllRows = true;
    } else {
      this.expandedAllRows = false;
    }
    this.compteur++;
  }

  collapseAll() {
    this.show = true;
    if (this.compteur2 % 2 === 0) {
      this.collapseAllRows = true;
    } else {
      this.collapseAllRows = false;
    }
    this.compteur2++;
  }
    calculateRowHeight():number {
        this.getRowHeight = (params) => {
          if (params.node && params.node.level === 0) {
            return 45;
          }
        };
        return null;
      }
    unblockOrder(): void {
      const listCartId = [];
      if(!isNullOrUndefined(this.cartLight)) {
          listCartId.push(this.cartLight.id);
          this.catalogManagement.unblockOrdersByListCartIds(listCartId).subscribe(data => {
            if(!isNullOrUndefined(data) && data.length !== 0) {
              let title = ``;
              for(const error of data) {
                title = title + `${error} <br/>`;
             }
             this.generateOcService.popUperrorOrInfosMessage(title); 
           } else {
             this.isBlocked = false;
            this.openSnackBar(this.messageSuccesForUnblocking);
            this.commandOrderService.findLastComandOrderByCartId(this.cart.id).subscribe( data => {
              if(data != null){
                this.commandOrderResultVO  = data;
                this.setNewRowOC();
               }
            })
           }
        });
      }
    }
    /** SNACK BAR */
    openSnackBar(text: string): void {
      this._snackBar.open(
        text, undefined, 
        { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
    }
}
