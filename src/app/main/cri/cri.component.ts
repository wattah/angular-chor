import { CustomerTotalsDebt } from './../../_core/models/customer-totals-debt';
import { PersonService } from '../../_core/services';
import { DebtRecouverementService } from './../../_core/services/debt-recouverement.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodToKnowResolver } from '../../_core/resolvers';
import { BeneficiaireView } from '../../_core/models/profil-infos-dashboard';
import { NotificationService } from '../../_core/services/notification.service';
import { ConfirmationDialogService } from '../../_shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-cri',
  templateUrl: './cri.component.html',
  styleUrls: ['./cri.component.scss']
})
export class CriComponent implements OnInit {

  customerId: string;
  infoProfil: BeneficiaireView;
  goodToKnow: GoodToKnowResolver;
  recoveryDate: Date;
  typeCustomer: string;
  isFromCriAndCriChange = false;
  totalDebt: CustomerTotalsDebt[];
  nichesWithRemainingGreatThanZero: string[];
  entrepriseRecoveryDate: Date;
  nicheValue: string;
  detteTotalTTC: number;
  detteTotal: number;
  constructor(private readonly route: ActivatedRoute,
    readonly notificationService: NotificationService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly router: Router,
    private readonly debtRecouverementService: DebtRecouverementService,
    private readonly personService: PersonService){

      this.notificationService.isFromCriAndCriChange$.subscribe(res =>{
        this.isFromCriAndCriChange = res;
      })
     }

  ngOnInit() {
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.route.data.subscribe(resolversData => {
      this.recoveryDate = resolversData['recoveryDate'];
      this.infoProfil = resolversData['infoProfil'];
      this.goodToKnow = resolversData['goodToKnow'];
      this.totalDebt = resolversData['totalDebt'];
    });

  }

  /**
   * @author fsmail
   * Cette methode est ajouté 
   * pour conditionner le retour vers la 
   * Fiche 360
   * depuis un CRI
   */
  navigate360(){
    if(this.isFromCriAndCriChange){
      const title= 'Reour';
      const comment ='Vous avez effectué des modifications. Voulez-vous les enregistrer ?';
      const btnOkText ='Oui';
          const btnCancelText ='Non';
      this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg',true)
      .then((confirmed)=>{
              if(confirmed) {
                this.notificationService.setIsSaveCri(true);}
              else{ this.forwardFiche360Detail(); }
           })
     .catch(()=>console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));}
    else{ this.forwardFiche360Detail();}
  }

  forwardFiche360Detail(){
    if(this.typeCustomer=== 'company' ){
      this.router.navigate(
        ['/customer-dashboard', 'entreprise', this.customerId],
     {
      queryParams: { typeCustomer: this.typeCustomer },
        queryParamsHandling: 'merge'
      }
    );}
    else{
      this.router.navigate(
        ['/customer-dashboard', 'particular', this.customerId],
     {
      queryParams: { typeCustomer: this.typeCustomer },
        queryParamsHandling: 'merge'
      }
    );}
  } 
}
