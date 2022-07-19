import { Component, Input, OnInit } from '@angular/core';

import { Router,ActivatedRoute } from '@angular/router';

import { RequestCustomerVO } from '../../../../_core/models/request-customer-vo';
import { RequestAnswersVO } from '../../../../_core/models/request-answers-vo';
import { CartVO } from '../../../../_core/models/models';


import { RecapCartVo } from '../../../../_core/models/recap-cart-vo';
import { RecapCartItemVo } from '../../../../_core/models/recap-cart-Item-vo';
import { CartService } from '../../../../_core/services/cart.service';
import { getCartLabel, getEncryptedValue } from '../../../../_core/utils/functions-utils';
import { CartStatusValue } from '../../../../_core/enum/cart.enum';
import { CART_PERMISSIONS, PANIER_PARCOURS } from '../../../../_core/constants/constants';
import { isNullOrUndefined } from 'src/app/_core/utils/string-utils';
import { RedirectionService } from '../../../../_core/services/redirection.service';



@Component({
  selector: 'app-task-creation-request-summary',
  templateUrl: './task-creation-request-summary.component.html',
  styleUrls: ['./task-creation-request-summary.component.scss']
})
export class TaskCreationRequestSummaryComponent implements OnInit {

  @Input() detailRequest: RequestCustomerVO;
  @Input() processInstanceId: RequestCustomerVO; 
  @Input() customerId: string;
  @Input() requestAnswers: RequestAnswersVO[];
  @Input() toNextTasks;
  @Input() cartHasBlockedItem : boolean;
  showCart = true ;
  cart: CartVO;
  customerDashboard = '/customer-dashboard';
  numberOfArticle: number;
  typeCustomer: string;
  isPanier: boolean ;
  nextIdTask : number;
  isNext = false;
  reponseRequest = '';
  carts: any[];
  cartRecapItemsVo: RecapCartItemVo[];
  cartRecapVo : RecapCartVo;
  cartlabel: string;
  requestId : any;
  CartStatusValue = CartStatusValue;
  fromChorniche;

  constructor(private readonly route: ActivatedRoute, private readonly cartService: CartService,
    private readonly router: Router, private readonly redirectionService : RedirectionService
    
    ) { }

  ngOnInit(): void {
    this.nextIdTask = Number(this.route.snapshot.queryParamMap.get('nextIdTask'));
    if(!isNullOrUndefined(this.nextIdTask) || this.nextIdTask > 0 ){
      this.isNext = true;
    }else{
      this.isNext = false;
    }
    this.requestId = this.route.snapshot.paramMap.get('idRequest');
    this.reponseRequest = this.requestAnswers.map(ans => ans[2]).join('\n');
      this.cartService.getCartByRequest(this.requestId).subscribe( (data) => {
        if (data !== null) {

          this.carts =data;
          this.cart = this.carts[0];
          this.requestId=this.cart.request.id;
    }
      if (this.cart.id !== null) {
        this.isPanier=true;
        this.cartlabel = getCartLabel(this.cart.request.cartColor, this.cart.request.cartStatus);
        this.cartService.getRecapCartByCartId(this.cart.id).subscribe( (data) => {
        if (data !== null) {
          this.cartRecapVo = data;
          this.cartRecapItemsVo = this.cartRecapVo.items;
          if(this.cartRecapItemsVo.length >0){
            this.showCart=false;
          }
          const notDeletedItems = [];
          this.numberOfArticle  = 0;
          if(this.cart.items){
            this.cart.items.forEach(item => {
              if(item.deletingDate == null){
                notDeletedItems.push(item);
              }
            });
            this.numberOfArticle = notDeletedItems != null ? notDeletedItems.length : 0;
          }
          
          
        }
      });
      this.checkIfCartHasBlockedItem();
      }
    });

    this.route.queryParamMap.subscribe(params => this.typeCustomer = params.get('typeCustomer'));
    this.fromChorniche = isNullOrUndefined(this.processInstanceId) ? (this.detailRequest.isConnectedOnWf ? true : this.detailRequest.workflowId ? true : false) : false;
}

checkIfCartHasBlockedItem(){
    if(this.cart.items.length > 0){
      this.cart.items.forEach(item => {
        if(item.product.blocked && item.deletingDate === null){
          this.cartHasBlockedItem = true;
        }
      });
    }
  }

OnHideCart(){
  this.showCart=true;
  
}
OnshowCart(){
  this.showCart=false;
 
}

  // permet d'ouvrir le catalogue pour ajouter des articles au nouveau panier a creer
  showCatalog(e): any {
    this.router.navigate(
      [this.customerDashboard, this.customerId, 'cart', 'catalog', this.detailRequest.idRequest],
      {
        queryParams: { 
          typeCustomer: this.typeCustomer,
          parcours: this.detailRequest.requestTypeLabel
        },
        queryParamsHandling: 'merge'
      }
    );
  }

  showIconeCatalog(){
    if(PANIER_PARCOURS.includes(this.detailRequest.requestTypeLabel) && !this.isPanier
    && this.redirectionService.hasPermission(CART_PERMISSIONS.ACCESS_TO_CATALOGUE )){
      return true;
    }
    return false;
  }

interClick() {
  this.router.navigate(
      [this.customerDashboard, getEncryptedValue( this.cart.request.customerId),'cart', 'creation', this.cart.request.id],
   {
      queryParams: { 
        typeCustomer: this.typeCustomer,
        parcours: this.cart.request.requestType.label,
        onglet : 0
      },
      queryParamsHandling: 'merge'
    }
  );
}

formatAnwser(anwser: RequestAnswersVO): string{
  const value = anwser[2];
  return anwser[3] === 'string' ? `${anwser[4]} : ${value}`: value
}

  }

 

