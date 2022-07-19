import { isNullOrUndefined } from 'src/app/_core/utils/string-utils';
import { GassiMockLoginService } from '../../../../../_core/services';
import { Component, EventEmitter, Input, OnChanges, SimpleChanges, OnInit, Output, ElementRef, 
  ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../../../../_core/services/user-service';

import { RequestAnswersVO } from '../../../../../_core/models/request-answers-vo';
import { RequestCustomerVO } from '../../../../../_core/models/request-customer-vo';
import { AuthTokenService } from '../../../../../_core/services/auth_token';
import { ApplicationUserVO } from '../../../../../_core/models/application-user';
import { CartStatusValue } from '../../../../../_core/enum/cart.enum';

import { AbsenceLight, CartVO } from '../../../../../_core/models/models';
import { ConfirmationDialogService } from '../../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { RequestDetailsService } from '../../../../../_core/services/request-details.service';
import { CartService } from '../../../../../_core/services/cart.service';
import { RecapCartVo } from '../../../../../_core/models/recap-cart-vo';
import { getCartLabel, getEncryptedValue } from '../../../../../_core/utils/functions-utils';
import { RecapCartItemVo } from '../../../../../_core/models/recap-cart-Item-vo';
import { CART_PERMISSIONS, PANIER_PARCOURS } from '../../../../../_core/constants/constants';
import { RedirectionService } from '../../../../../_core/services/redirection.service';


@Component({
  selector: 'app-detail-request-summary',
  templateUrl: './detail-request-summary.component.html',
  styleUrls: ['./detail-request-summary.component.scss']
})
export class DetailRequestSummaryComponent implements OnChanges , OnInit , AfterViewInit {

  @ViewChild('myDiv',  { static: true })  myDivy: ElementRef;

  @Input()
  detailRequest: RequestCustomerVO;
  typeCustomer: string;
  seeall = false;
  blocWidth: boolean;

  @Input()
  requestAnswers: RequestAnswersVO[];

  cartHasBlockedItem : boolean;

  absenceLight: AbsenceLight;
  customerDashboard = '/customer-dashboard';
  isBackup = false ;
  isRoleAdministrateurSiOrManager = false ;
  numberOfArticle: number;
  isPanier: boolean ;
  blocSize: any;
  show = true;
  showCart = true;

  @Input()
  customerId: string;

  cartRecapItemsVo: RecapCartItemVo[];

  @Output()
  sendIsClosedRequest = new EventEmitter();

  @Output()
  sendIsClosed = new EventEmitter();

  isEligibleToReOpen: boolean;
  isEligibleToClose: boolean;
  cart: CartVO;
  cartRecapVo: RecapCartVo;
  statut: string;
  cartlabel: string;
  

  listAnswers: RequestAnswersVO[];
  reponseRequest: any = '';

  isDetailRequestReady = false;

  // isClosed: verifie si tous les taches de la demande sont clotures
  isClosed: boolean;

  // isClosed: verifie si la demande est cloture
  isClosedRequest: boolean;

  nextLine = '\n';

  ArrayOfBolean: boolean[] = [];
  currentUser: ApplicationUserVO;
  backupId: number;
  CartStatusValue = CartStatusValue;
		  fromChorniche;

  constructor(private readonly authTokenService: AuthTokenService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly cartService: CartService,
    private readonly route: ActivatedRoute,
    readonly confirmationDialogService: ConfirmationDialogService, 
    private readonly requestDetailService: RequestDetailsService,
    private readonly gassiMockLoginService: GassiMockLoginService,
    private readonly redirectionService : RedirectionService) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.detailRequest.statuts === 'PENDING') {
      this.statut = 'En cours';
    } else if (this.detailRequest.statuts === 'CLOSED') {
      this.statut = 'Terminé';
    } else if (this.detailRequest.statuts === 'REFUSED') {
      this.statut = 'Annulé';
    } else {
      this.statut = '-';
    }

    this.listAnswers = this.requestAnswers;
    for (const reponse of this.listAnswers) {

      this.reponseRequest = `${this.reponseRequest} ${reponse[2]} ${this.nextLine}`;
    }
    this.isDetailRequestReady = true;
    
    this.detailRequest.createdAt = new Date(this.detailRequest.createdAt);

    this.isClosedRequest = this.isRequestClosed();
}

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(params => {
      this.customerId =params.get('customerId'); 
    }); 
    this.isClosed = this.isAllTaskClosed();
    this.currentUser = this.authTokenService.applicationUser;
    this.isAdministrateurSiOrManager() ;
    this.userService.getUserBackup(Number(this.detailRequest.idPorteur)).subscribe(data => {
      this.absenceLight = data;
      if (this.absenceLight && this.absenceLight.backupId !== null && this.absenceLight.backupId === this.currentUser.coachId) {
        this.isBackup = true;
      } else {
          this.isBackup = false;
        }
    });
    this.gassiMockLoginService.getCurrentConnectedUser().subscribe(
      (user)=>{
          this.isEligibleToReOpen = this.isUserEligibleToReOpenRequest(user.activeRole.permissions.includes('reouvrir_demandes'));
          this.isEligibleToClose = this.isUserEligibleToCloseRequest(user.activeRole.permissions.includes('cloturer_demandes'));
      }
    );
    this.route.data.subscribe(resolversData => {
      const carts: CartVO[] = resolversData['carts'];
      this.cart = carts[0];
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
      }else{
        this.isPanier=false;
      }
    });
    this.route.queryParamMap.subscribe(params => this.typeCustomer = params.get('typeCustomer'));
    this.fromChorniche = isNullOrUndefined(this.detailRequest.instanceId) ? (this.detailRequest.isConnectedOnWf ? true : this.detailRequest.workflowId ? true : false) : false;
    this.checkIfCartHasBlockedItem();
  }

  checkIfCartHasBlockedItem(){
    this.cartHasBlockedItem = false;
    if(this.cart.items.length > 0){
      this.cart.items.forEach(item => {
        if(item.product.blocked && item.deletingDate === null){
          this.cartHasBlockedItem = true;
        }
      });
    }
  }


  
  ngAfterViewInit(): void {
   this.blocSize = this.myDivy.nativeElement.clientHeight;
   if(this.blocSize >= '370'){
    this.blocWidth = true
   }else{
     this.blocWidth = false;
   }
 }

  isAllTaskClosed(): boolean {
   
    if (this.detailRequest.tasks !== null && this.detailRequest.tasks.length > 0 ) { 
      for (const task of this.detailRequest.tasks) {  
        if (task.status !== 'ASSIGNED') {
          this.ArrayOfBolean.push(true);
          if (this.ArrayOfBolean.length === this.detailRequest.tasks.length && this.detailRequest.statuts === 'PENDING' ) {
            this.isClosed = true;
          } 
        } else {
          this.isClosed = false;
        }  
      }
    }
    return this.isClosed;
    
  }
 
  // cette fontion permet de verifier si la demande est cloturee
  isRequestClosed(): boolean {
    if (this.detailRequest.statuts !== null ) {
      if (this.detailRequest.statuts === 'CLOSED') {
      this.isClosedRequest = true ;
    } else {
      this.isClosedRequest = false ;
    }
    }
    return this.isClosedRequest;
  }

  isAdministrateurSiOrManager() : void {
    this.gassiMockLoginService.getCurrentConnectedUser().subscribe(
      (user)=>{
          if(user.activeRole.roleName === "MANAGER" || user.activeRole.roleName === "ADMINISTRATEUR_SI"){
            this.isRoleAdministrateurSiOrManager = true ;
          } else { 
            this.isRoleAdministrateurSiOrManager = false ;
          }
      }
    );
  }

  isUserEligibleToReOpenRequest(hasPermission): boolean {
    const nameOfCurentUser = (this.currentUser.firstName).concat(this.currentUser.lastName);
    const nameOfPorteur = (this.detailRequest.firstNamePorteur).concat(this.detailRequest.lastNamePorteur);
    let isEligible = false;
    if ((nameOfCurentUser === nameOfPorteur || this.isBackup || this.isRoleAdministrateurSiOrManager) && hasPermission) {
      isEligible = true;
    }
    return isEligible;
  }

  isUserEligibleToCloseRequest(hasPermission): boolean {
    const nameOfCurentUser = (this.currentUser.firstName).concat(this.currentUser.lastName);
    const nameOfPorteur = (this.detailRequest.firstNamePorteur).concat(this.detailRequest.lastNamePorteur);
    let isEligible = false;
    if (nameOfCurentUser === nameOfPorteur || hasPermission) {
      isEligible = true;
    }
    return isEligible;
  }

  // permet d'ouvrir le popup pour confirmer la re-ouverture de la demande
  reOpenRequestDialog(e): any {
    const title = 'Bloc Facture';
    const comment = 'Confirmez-vous la ré-ouverture de la demande?';
    const btnOkText = 'Oui, je veux ré-ouvrir';
    const btnCancelText = 'Non, je la laisse fermée';
    this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText)
    .then((confirmed) => {
      if (confirmed) {
        this.requestDetailService.reOpenRequest(this.detailRequest.idRequest).subscribe(
          data => {
            this.detailRequest = data ;
            this.isClosed = true;
            this.isClosedRequest = this.isRequestClosed();
            this.statut = 'En cours'; 
            this.sendIsClosedRequest.emit(this.isClosedRequest);
            this.sendIsClosed.emit(this.isClosed);
          });
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
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
    if(PANIER_PARCOURS.includes(this.detailRequest.requestTypeLabel) && !this.isPanier){
      return true;
    }
    return false;
  }

  onShow(): void {
    this.show = false;
    this.seeall= true;
  }
  onHide(): void {
    this.show = true;
    this.seeall= false;
  }

  interClick() {
    this.router.navigate(
        [this.customerDashboard, this.customerId,'cart', 'creation', this.detailRequest.idRequest],
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
  OnHideCart(): void{
    this.showCart=true;
    
  }
  OnshowCart(): void{
    this.showCart=false;   
  }

  formatAnwser(anwser: RequestAnswersVO): string{
    const value = anwser[2];
    return anwser[3] === 'string' ? `${anwser[4]} : ${value}`: value
  }
}

