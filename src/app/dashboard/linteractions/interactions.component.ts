import { Component, OnInit } from '@angular/core';
import { CustomerService, GassiMockLoginService, UserService } from '../../_core/services';
import { CONSTANTS, CONTRAT_STATUTS } from '../../_core/constants/constants';
import { InteractionService } from 'src/app/_core/services/interaction.service';
import { InteractionWallet, TotalsWallet } from 'src/app/_core/models';
import { isNullOrUndefined } from '../../_core/utils/string-utils';



@Component({
  selector: 'interactions',
  templateUrl: './interactions.component.html',
  styleUrls: ['./interactions.component.scss']
})
export class InteractionsComponent implements OnInit {
  readonly TabHeaderConfig = [
    { key : CONTRAT_STATUTS.ACTIVE.key , name: 'Members', label: 'Members(0)'},
    { key : CONTRAT_STATUTS.CONTACT.key , name: 'Contacts',  label: 'Contacts(0)'},
    { key : CONTRAT_STATUTS.PROSPECT.key , name: 'Prospects', label: 'Prospects(0)'},
  ];
  roles = [CONSTANTS.ROLE_DESK, CONSTANTS.ROLE_COACH, CONSTANTS.ROLE_VENTE] ;
  users = [];
  connectedUserRole ;
  selectedUserId = -1; // option 'all user' <=> Tous <=> -1 
  selectedStatus = CONTRAT_STATUTS.ACTIVE.key;
  loadingInteractions: boolean;
  loadingTotals: boolean;
  interactions: InteractionWallet[] = [];
  totals: TotalsWallet[] = [];
  selectedTabIndex = 0;
  constructor(private readonly userService: UserService, private readonly loginService: GassiMockLoginService,
    private readonly interactionService: InteractionService, private readonly customerService: CustomerService) { 
     
      this.loginService.getCurrentConnectedUser().subscribe((user) => {
        this.connectedUserRole = user.activeRole;
        this.selectedTabIndex = 0
        this.selectedStatus =  CONTRAT_STATUTS.ACTIVE.key;
        this.loadingInteractions = true;
        this.initializeUserValue();
      });
    }



  ngOnInit() {
    this.initializeUsersList();
  }

  initializeUsersList(): void {
    this.userService.getUsersByRoleList(this.roles).subscribe( users => {
      this.users = users;
      this.initializeUserValue();
    });
  }
  
  initializeUserValue(){
  if(this.users.length > 0){
    const connectedUserId = this.loginService.getCurrentUserId().getValue();
    const user = this.users.find( user =>  user.id === connectedUserId );
    this.selectedUserId = (user) ? user.id : -1;
    const isNotPermitRole = this.roles.find(role => role === this.connectedUserRole.roleId);
    this.selectedUserId = (isNotPermitRole) ? this.selectedUserId  : -1;
    this.changeWalletOfUser(this.selectedUserId, this.selectedTabIndex, this.selectedStatus);
  } 
  }

  changeWalletOfUser(userId: number,selectedIndex : number, selectedStatus : string): void {
    this.selectedUserId = userId;
    this.selectedTabIndex = selectedIndex;
    this.selectedStatus = selectedStatus;
    this.calculateTotalsCustomerByIdUser(this.selectedUserId);
     // la fonction changetab se lance automatiquement par material tab en changeant l index
    if (this.selectedTabIndex === 0)  {
       // si l index est identique au précedent rien n'est lancé au niveau du material 
       // on force le chargement de des données
      this.loadInteractionOfChoosenUser(this.selectedUserId, this.selectedStatus);
    } else {
       // si l index est different de 0 (statut active) , on le force à 0 et on se positionne sur le 1er onglet
       // chargerment de données s'effectue automatiquement avec changeTab
      this.selectedTabIndex = 0;
    }
  }

  changeTab(tab ): void {
    this.selectedStatus = this.TabHeaderConfig[tab.index].key;
    this.calculateTotalsCustomerByIdUser(this.selectedUserId);
    this.loadInteractionOfChoosenUser(this.selectedUserId, this.selectedStatus); 
  }

  loadInteractionOfChoosenUser(userId: number, status: string): void {
    this.loadingInteractions = true;
    this.interactionService.getInteractionsForWalletOfConnectedUser(userId, status)
    .subscribe( 
      data => this.interactions = data, 
      _err => this.interactions = [],
      () => this.loadingInteractions = false
    );
  }

  calculateTotalsCustomerByIdUser(userId: number): void {
    this.loadingTotals = true;
    this.customerService.calculateNbrCustomerByStatusAndReferent(userId).subscribe( 
      data => {
        this.totals = data;
        this.changeLabelTabs(userId);
      }, 
      _err => console.log("error"),
      () => this.loadingTotals = false 
    );
  }

  changeLabelTabs(userId: number) : void {
    this.TabHeaderConfig.forEach(element => {
      const total = this.totals.find( e => e.statusCustomer === element.key);
      const nbrCustomer =  (total) ? total.nbrCustomer :0;
      const nbrCustomerHide =   userId != -1  ? `(${nbrCustomer})` : "";
      element.label = element.name + nbrCustomerHide;
    });
  }

}
