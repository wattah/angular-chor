import { PersonService } from './../../../../_core/services';
import { DebtRecouverementService } from './../../../../_core/services/debt-recouverement.service';
import { CustomerTotalsDebt } from './../../../../_core/models/customer-totals-debt';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GassiMockLoginService } from '../../../../_core/services';
import { COLOR_TYPE_CUSTOMER, CONSTANTS } from '../../../../_core/constants/constants';
import { PersonNoteVo } from '../../../../_core/models/person-note';
import { BeneficiaireView } from '../../../../_core/models/profil-infos-dashboard';
import { PersonNoteService } from '../../../../_core/services/person-note.service';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';


@Component({
  selector: 'app-ajouter-modifier-info-note',
  templateUrl: './ajouter-modifier-info-note.component.html',
  styleUrls: ['./ajouter-modifier-info-note.component.scss']
})
export class AjouterModifierInfoNoteComponent implements OnInit {

  customerId: string;
  personIdNote: number;
  infoFacturation: PersonNoteVo;
  value: string;
  skypeUrl: string;
  showInfoError = false;

  typeCustomer: string;
  infoCustomer: BeneficiaireView;
  recoveryDate: Date;
  isEntreprise: boolean;
  isParticular: boolean;
  connectedUserId: number;
  totalDebts: CustomerTotalsDebt[];
  nichesWithRemainingGreatThanZero: string[];
  entrepriseRecoveryDate: Date;
  detteTotalTTC: number;
  detteTotal: number;
  constructor(private readonly route: ActivatedRoute,
    private readonly router: Router, 
    private readonly personNoteService: PersonNoteService,
    private readonly mockLoginService: GassiMockLoginService ,
    private readonly debtRecouverementService: DebtRecouverementService,
    private personService: PersonService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
      this.personIdNote = Number(params.get('personIdNote'));
    });

    this.route.queryParamMap.subscribe( params => {
      this.typeCustomer = params.get('typeCustomer');
      this.isEntreprise = ( this.typeCustomer === CONSTANTS.TYPE_COMPANY );
      this.isParticular = (this.typeCustomer === CONSTANTS.TYPE_PARTICULAR );
    });
    
    this.route.data.subscribe(resolversData => {
      this.infoCustomer = resolversData['infoCustomer'];
      this.recoveryDate = resolversData['dateRecouvrement'];
      this.infoFacturation = resolversData['infoFacturation'];
      this.totalDebts = resolversData['totalDebt'];
      this.getRecoveryInformation();
      if ( this.infoFacturation !== null) {
        this.value = this.infoFacturation.value;
      }
    });
    this.getConnectedUser();
  }

  enregistrer(): void {
    if (this.value !== '' && this.value.length > 500) {
      this.showInfoError = true;
    } else if (!isNaN(this.personIdNote)) {
      this.personNoteService.updateInfoNoteFacture(this.personIdNote, this.value, this.connectedUserId).subscribe(_data => this.goToFiche360());
    } else {
      this.personNoteService.saveInfoNoteFacture(this.customerId, this.value, this.connectedUserId).subscribe(_data => this.goToFiche360());
    }
  }

  getConnectedUser(): void {
    this.mockLoginService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.connectedUserId = userId;
      }
    });
  }

  annuler(): void {
    this.goToFiche360();
  }

  getClassEnvByTypeCustomer(): string {
    return `env-${COLOR_TYPE_CUSTOMER[this.typeCustomer]}` ;
  }

  goToFiche360(): void {
    let page = 'particular';
    if (this.isEntreprise) {
      page = 'entreprise';
    } 
    this.router.navigate(['/customer-dashboard', page , this.customerId], { queryParamsHandling: 'merge' });
  }

  private getRecoveryInformation() {
    if (this.totalDebts && this.totalDebts.length !== 0) {
      const debt = this.totalDebts.find(d => d.nicheIdentifier === this.infoCustomer.nicheIdentifier);
      this.detteTotalTTC = debt ? this.debtRecouverementService.calculateRemaining(debt) : 0,
      this.detteTotal = this.debtRecouverementService.calculateTotlaOfRemaining(this.totalDebts),
      this.nichesWithRemainingGreatThanZero = this.debtRecouverementService.getNichesWithRemainingGreatThanZero(this.totalDebts);
      if(!isNullOrUndefined(this.nichesWithRemainingGreatThanZero) && this.nichesWithRemainingGreatThanZero.length > 0){
        this.personService.getEntrepriseRecoveryDate(this.nichesWithRemainingGreatThanZero).subscribe(
          (data) => this.entrepriseRecoveryDate = data
        );
      }
    }
  }
}
