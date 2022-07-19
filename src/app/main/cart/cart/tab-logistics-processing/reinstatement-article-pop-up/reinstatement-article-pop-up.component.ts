import { FormStoreManagementService } from './../../tab-article/from-store-management.service';
import { CatalogeService } from './../../../../../_core/services/http-catalog.service';
import { CartItemVO } from './../../../../../_core/models/cart-item-vo';
import { OrderStatus } from './../../../../../_core/enum/cart.enum';
import { CONSTANTS } from './../../../../../_core/constants/constants';
import { HttpCommandOrderService } from './../../../../../_core/services/http-command-order.service';
import { CommandOrderLineVO } from './../../../../../_core/models/command-order-line-vo';
import { CartVO } from './../../../../../_core/models/cart-vo';
import { CommandOrderVo } from './../../../../../_core/models/command-order-vo';
import { Component, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CSS_CLASS_NAME } from '../../../../../_core/constants/constants';
import { StocksValue } from './../../../../../_core/enum/cart.enum';
import { ConfirmationDialogService } from './../../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reinstatement-article-pop-up',
  templateUrl: './reinstatement-article-pop-up.component.html',
  styleUrls: ['./reinstatement-article-pop-up.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReinstatementArticlePopUpComponent {

  @Input() commandOrderVo : CommandOrderVo;
  @Input() cartItems : any;
  @Input() cartLight : CartVO;
  @Input() requestId : number;
  @Input() userId : number;
  @Input() itemsHasBeenReinstated : number[];
  

  reinstatementStocks : any;
  reinstatementStocksOptions : string[];
  reinstatementStockSelected : any ;
  itemsToRestoreVO : CartItemVO[]=[];
  orderLinesToCancel : CommandOrderLineVO[]=[];
  enableSendButton = false;
  listNewCommandOrder : any[] = [];
  fromGenerateCommandOrderButton : boolean;
  typeCommandOrder : string;
  listOfRestoredItems : CartItemVO[] = [];
  allIsReintegre =false;

  params: { force: boolean; suppressFlash: boolean; };

  rowData: any[] = [];
  itemAlreadyReinstated = false;
  defaultSortModel = [ { colId: 'article-select', sort: 'desc' } ];
  columnDefs = [
    {
      headerName: 'Article', field: 'libelleFacture', colId: 'article-select',
      valueGetter: (params) => params.data ? params.data.product.libelleFacture : '',
      cellClass: (params) => [CSS_CLASS_NAME.CELL_WRAP_TEXT, this.checkIfAlreadyRestored(params.data) ? CSS_CLASS_NAME.UNSELECTABLE : ''], 
      width: 320,
      checkboxSelection: true,
    },
    {
      headerName: 'Référence', headerTooltip: 'Référence', field: 'partnerProductReference',
      valueGetter: (params) => params.data ? params.data.product.partnerProductReference : '',
      width: 120, cellClass: (params) =>  [CSS_CLASS_NAME.CELL_WRAP_TEXT, this.checkIfAlreadyRestored(params.data) ? CSS_CLASS_NAME.UNSELECTABLE : '']
    },
    {
      headerName: 'Qté', headerTooltip: 'Quantité', field: 'quantity', colId: 'quantite',
      valueGetter: (params) => params.data ? params.data.quantity : '',
      width: 80, cellClass: (params) =>   [CSS_CLASS_NAME.TEXT_CENTER, this.checkIfAlreadyRestored(params.data) ? CSS_CLASS_NAME.UNSELECTABLE : ''] 
    },
    {
      headerName: 'Prix (€ ttc)', headerTooltip: 'Prix (€ ttc)', field: 'prixttc', colId: 'ttcPrix',
      valueGetter: (params) => this.calculateTotalPriceTtc(params.data) ,
      width: 110, cellClass: (params) =>   [CSS_CLASS_NAME.CELL_WRAP_TEXT, CSS_CLASS_NAME.TEXT_RIGHT, this.checkIfAlreadyRestored(params.data) ? CSS_CLASS_NAME.UNSELECTABLE : '']
    },
    {
      headerName: 'Numéro de série', headerTooltip: 'Numéro de série', field: 'serial',
      valueGetter: (params) => params.data ? params.data.serial : '' ,
      width: 160, cellClass: (params) => [CSS_CLASS_NAME.CELL_WRAP_TEXT, this.checkIfAlreadyRestored(params.data) ? CSS_CLASS_NAME.UNSELECTABLE : '']
    }
  ];
  
  constructor(private readonly activeModal: NgbActiveModal,
    private readonly catalogService : CatalogeService,
    private readonly _snackBar: MatSnackBar,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly formStoreManagementService: FormStoreManagementService) { 
 
  }

  ngOnInit(): void{
      this.commandOrderVo.commandOrderLines.forEach(commandOrderLine => {
        this.cartItems.forEach(cartItem => {
            if(commandOrderLine.cartItemId === cartItem.id){
              this.rowData.push(cartItem);
            }
        });
      });
    
    if(this.commandOrderVo.stockToUse && this.commandOrderVo.stockToUse.toUpperCase() === StocksValue["PBL01"].toUpperCase() && 
      (this.commandOrderVo.status === OrderStatus['CREATED'] || this.commandOrderVo.status === OrderStatus['CONFIRMED'])){
        this.reinstatementStocks = {'PBL01' : "Publidispatch"};
    }else {
      this.reinstatementStocks = StocksValue;
    }

    this.reinstatementStocksOptions = Object.keys(this.reinstatementStocks);
    this.reinstatementStockSelected = this.reinstatementStocksOptions[0];
  }
  
  checkIfAlreadyRestored(item){
    return (this.listOfRestoredItems.find( restoredItem => item.id === restoredItem.id) 
          || this.itemsHasBeenReinstated.find(restoredItem => item.id === restoredItem)) ? true : false;
  }

  cellClicked(item){
    if(this.checkIfAlreadyRestored(item.data)){
      item.node.setSelected(false);
    }
  }

  clickedRow(event) { 
    if(this.checkIfAlreadyRestored(event.data)){
      event.node.setSelected(false);
    }
    if(!this.checkIfAlreadyRestored(event.data)){
        if(this.itemsToRestoreVO.find( item => item.id === event.data.id)){
        const indexOfItemToRemove = this.itemsToRestoreVO.indexOf(event.data);
        this.itemsToRestoreVO.splice(indexOfItemToRemove, 1);
        const indexOfcommOrderLineToRemove = this.orderLinesToCancel.indexOf(this.commandOrderVo.commandOrderLines.find(commOrderLine => commOrderLine.cartItemId === event.data.id ));
        this.orderLinesToCancel.splice(indexOfcommOrderLineToRemove, 1);
      }else {
        this.itemsToRestoreVO.push(event.data);
        this.orderLinesToCancel.push(this.commandOrderVo.commandOrderLines.find(commOrderLine => commOrderLine.cartItemId === event.data.id ));
      }

      if(this.itemsToRestoreVO.length === 0){
        this.enableSendButton = false;
      }else{
        this.enableSendButton = true;
      }
    } 
  }

  accept(): void {
    this.allIsReintegre=false;
    this.fromGenerateCommandOrderButton = true;
    this.typeCommandOrder = "IN";
    const idItemsToRestoreVO : number[]=[];
    this.itemsToRestoreVO.forEach(item => idItemsToRestoreVO.push(item.id));
    const idOrderLinesToCancel : number[]=[];
    this.orderLinesToCancel.forEach(order => idOrderLinesToCancel.push(order.id));
    this.catalogService.generateRestoreOrder(this.requestId, this.userId, this.fromGenerateCommandOrderButton,this.typeCommandOrder,
      idItemsToRestoreVO, idOrderLinesToCancel,this.reinstatementStockSelected,this.commandOrderVo.id).subscribe(
       
        _data => {         
          if(_data.errorOrInfosMessage !== null && _data.errorOrInfosMessage !== ''){
            this.confirmationDialogService.confirm('', _data.errorOrInfosMessage, 'Ok', null, 'lg', false);
          }
          if(_data.commandOrder){
            this.openSnackBar("L'article a bien été réintégré.", undefined); 
            this.listNewCommandOrder.push(_data.commandOrder);
            let rows : any [] = [];
            rows = this.rowData;
            this.rowData = [];
            rows.forEach(item => {
              this.rowData.push(item);
            });
            this.itemsToRestoreVO.forEach(item => this.listOfRestoredItems.push(item));
            this.itemsToRestoreVO = [];
            this.orderLinesToCancel = [];
            this.enableSendButton = false;
            this.params = {
              force: true,
              suppressFlash: true,
            };
          if(this.rowData.length - this.listOfRestoredItems.length - this.itemsHasBeenReinstated.length === 0){
            this.allIsReintegre=true;
          }
          
          }
        
        },
        _error =>  {
          this.allIsReintegre=false;
          this.confirmationDialogService.confirm('', _error.error.message, 'Ok', null, 'lg', false);
        }
      );
  }


  formatPrice(marginReal: any) {
    return Math.round(marginReal * 100) / 100;
  }

  calculateTotalPriceTtc(item): number {
    return this.formatPrice(
      (this.getTvaNumberValue(item.tauxTVA) / 100 + 1) *
        this.formStoreManagementService.getTotalPriceHt(item)
    );
  }
  
  getTvaNumberValue(tva: string) {
    switch (tva) {
      case CONSTANTS.OLD_TVA_NORMALE:
        return 19.6;
      case CONSTANTS.OLD_TVA_REDUITE:
        return 5.5;
      case CONSTANTS.TVA_NORMALE:
        return 20.0;
      case CONSTANTS.TVA_REDUITE:
        return 7.0;
      case CONSTANTS.TVA_MOYENNE:
        return 10.0;
      default:
        return 0;
    }
  }

  decline(): void {
    const returnedData = [];
    returnedData.push(this.listNewCommandOrder);
    returnedData.push(this.rowData.length - this.listOfRestoredItems.length - this.itemsHasBeenReinstated.length);
    returnedData.push(this.listOfRestoredItems);
    this.activeModal.close(returnedData);
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['center-snackbar', 'snack-bar-container']
    });
  }

  

}
