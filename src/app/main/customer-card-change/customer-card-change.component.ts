import { getDecryptedValue } from 'src/app/_core/utils/functions-utils';
import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { format, isAfter } from 'date-fns';

import { CustomerView } from '../../_core/models/customer-view';
import { CustomerService } from '../../_core/services';
import { isNullOrUndefined } from '../../_core/utils/string-utils';
import { firstNameFormatter, toUpperCase } from 'src/app/_core/utils/formatter-utils';
import { CONSTANTS } from 'src/app/_core/constants/constants';

export const DD_MM_YYYY_Format = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-customer-card-change',
  templateUrl: './customer-card-change.component.html',
  styleUrls: ['./customer-card-change.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_Format }
  ]
})
export class CustomerCardChangeComponent implements OnInit, OnChanges {
  form: NgForm;
  /**
	 * customer_id
	 */
  customerId: string;
  /**
	 * customer_id in number
	 */
  customerIdNumber: number;
  /**
	 * Objet contenant le résultat de la requete
	 */
  customer: CustomerView;
  /**
   * prénom du bénéficiare ou particulière
   */
  firstNameParBenef:string;
  /**
   * nom du bénéficiaire ou particulière
   */
  lastNameParBenef:string;
  /**
   * civilité du bénéficiaire ou particulière
   */
  title:string;
  /**
	 *
	 */
  name: string;
  /**
	 * flag actif si le client est un bénéficiaire
	 */
  isBenef = false;

  /**
	 * flag actif si le client est un titulaire
	 */
  isTitu = false;

  /**
	 * flag actif si le client est un contact
	 */
  isContact = false;

  /**
	 * flag actif si le client est un prospect
	 */
  isProspect = false;
  /**
	 * flag pour savoir si le client est une personne morale ou physique
	 */
  isEntreprise = true;

  /**
	 * modele du formulaire
	 */
  model: any = {};

  /**
	 * bon a savoir
	 */
  infoModifY: String;

  /**
	 * siren Modifir
	 */
  siretModify: String;
  showDateerror = false;

  showPrenomError = false;

  showNomError = false;

  showBonSavoirError = false;

  showSirenError = false;

  showCompagnyNameError = false;

  showSirenChiffreError = false;

  showNicError = false;
  showNicSirenError = false;

  nichIdentifierF: String;

  @ViewChild('nic', { static: false } ) nic: ElementRef;

  isBeneficiaire = false;

  isParticulier = false;

  constructor(private customerService: CustomerService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
      if(this.customerId){
        this.customerIdNumber = getDecryptedValue(this.customerId);
      }
      
      if (this.customerId === null || Number(this.customerIdNumber) <= 0) {
        this.router.navigate(['error']);
      } else {
        this.customerService.getCustomer(this.customerId).subscribe(data => {
          if (data === null) {
            this.router.navigate(['error']);
          } else {
            this.customer = data;
            this.showTypeCustomer(this.customer.customerStatus);
            this.isEntreprise = this.showCategoryEntreprise(this.customer.customerCategory);
            this.isParticulier = this.showCategoryParticulier(this.customer.customerCategory);
            this.isBeneficiaire = this.showCategoryBeneficiaire(this.customer.customerCategory);
            if (this.isEntreprise) {
              this.name = this.customer.companyName;
            } else if (this.isParticulier || this.isBeneficiaire) {
              this.title = this.customer.civility;
              this.firstNameParBenef = this.customer.firstName;
              this.lastNameParBenef = this.customer.lastName;
            }
            if (this.customer.nicheIdentifier !== null) {
              this.nichIdentifierF =
                this.customer.nicheIdentifier.substring(0, 2) +
                ' ' +
                this.customer.nicheIdentifier.substring(2, 4) +
                ' ' +
                this.customer.nicheIdentifier.substring(4, 6) +
                ' ' +
                this.customer.nicheIdentifier.substring(6, 9);
            }
            this.initForm(this.customer);
          }
        });
      }
    });
  }

  /**
	 * Affiche le type de client
	 * @param type type du client
	 */
  showTypeCustomer(type: string): void {
    if (type === 'BENEFICIAIRE') {
      this.isBenef = true;
      this.isTitu = false;
      this.isContact = false;
      this.isProspect = false;
    } else if (type === 'TITULAIRE') {
      this.isBenef = false;
      this.isTitu = true;
      this.isContact = false;
      this.isProspect = false;
    } else if (type === 'CONTACT') {
      this.isBenef = false;
      this.isTitu = false;
      this.isContact = true;
      this.isProspect = false;
    } else if (type === 'PROSPECT') {
      this.isBenef = false;
      this.isTitu = false;
      this.isContact = false;
      this.isProspect = true;
    }
  }

  /**
	 * Montre si le titulaire est une personne morale ou physique
	 * @param val categorie
	 * @param cat flag de categorie
	 */
  showCategoryEntreprise(val: string): boolean {
    if (val === 'ENTREPRISE') {
      return true;
    }
    return false;
  }

  showCategoryBeneficiaire(val: string): boolean {
    if (val === 'BENEFICIAIRE') {
      return true;
    }
    return false;
  }

  /**
	 * Montre si le titulaire est une personne morale ou physique
	 * @param val categorie
	 * @param cat flag de categorie
	 */
  showCategoryParticulier(val: string): boolean {
    if (val === 'PARTICULIER') {
      return true;
    }
    return false;
  }

  /**
	 * affiche la civilité en tenant compte de la langue d'affichage
	 * @param val valeur de la civilité
	 */
  initForm(val: CustomerView): void {
    if (!this.isEntreprise) {
      if (val.civility === 'M.') {
        this.model.civility = 'M.';
      } else {
        this.model.civility = 'Mme';
      }
      this.model.firstName = firstNameFormatter(val.firstName);
      this.model.lastName = toUpperCase(val.lastName);
      this.model.birthdate = new FormControl(format(val.birthdate));
    } else {
      this.model.companyName = val.companyName;
      if (this.customer.siren !== null) {
        this.model.siren = this.customer.siren;
      } else if (this.customer.siret !== null) {
        const siren = this.customer.siret.substring(0, 9);
        const nic = this.customer.siret.substring(9, 14);
        this.model.siren = siren;
        this.model.nic = nic;
        this.siretModify = siren + nic;
      }
    }
    if (val.language === 'en') {
      this.model.language = 'en';
    } else {
      this.model.language = 'fr';
    }
    this.model.goodToKnow = val.info;
    this.infoModifY = this.model.goodToKnow;
  }

  /**
	 * enregistre un profil si les champs sont bons
	 */
  onSubmit(): void {
    let isValid = true;
    const patternFirstName = new RegExp('^(?=.*[a-zA-Z])([a-zA-Z]+)$');
    this.showNicError = false;
    this.showNicSirenError = false;
    this.showSirenError = false;
    if (!this.isEntreprise) {
      if (!isNullOrUndefined(this.model.firstName) && this.model.firstName.length !== 0 && !patternFirstName.test(this.model.firstName)) {
        this.showPrenomError = true;
        isValid = false;
      } else {
        this.showPrenomError = false;
      }
      if (!this.model.lastName || 0 === this.model.lastName.length) {
        this.showNomError = true;
        isValid = false;
      } else {
        this.showNomError = false;
      }
      if (!isNullOrUndefined(this.model.birthdate) && isAfter(this.model.birthdate.value, new Date())) {
        this.showDateerror = true;
        isValid = false;
      } else {
        this.showDateerror = false;
      }
      // tslint:disable-next-line:no-collapsible-if
    } else {
      if (!this.model.companyName.trim() || this.model.companyName.length === 0) {
        this.showCompagnyNameError = true;
        isValid = false;
      } else {
        this.showCompagnyNameError = false;
      }
      if (!isNullOrUndefined(this.model.nic) && this.model.nic.length > 5 && isNullOrUndefined(this.model.siren)) {
        this.showNicSirenError = true;
        isValid = false;
      } else if (!this.model.siren || this.model.siren.length === 0) {
        this.showSirenError = true;
        isValid = false;
      } else if (!isNullOrUndefined(this.model.nic) && this.model.nic.length > 5) {
        this.showNicError = true;
        isValid = false;
      }
    }
    if (!isNullOrUndefined(this.model.goodToKnow) && this.model.goodToKnow.length > 500) {
      this.showBonSavoirError = true;
      isValid = false;
    } else {
      this.showBonSavoirError = false;
    }
    // console.log(isValid);
    if (isValid) {
      this.initModelForSave();
      this.saveForm();
      // this.toCustomerModif();
    }
  }

  // tslint:disable-next-line:typedef
  onInputEntry(event) {
    const input = event.target;
    const length = input.value.length;
    const maxLength = input.attributes.maxlength.value;

    if (length >= maxLength) {
      this.nic.nativeElement.focus();
    }
  }

  /**
	 * Annuler les modifications
	 */
  // tslint:disable-next-line:typedef
  toCustomerModif() {
    // const promise = new Promise((_resolve, _reject) => {
    //   setTimeout(() => {
    this.toCustomer();
    //   }, 1000);
    // });
    // return promise;
  }

  /**
	 * Annuler les modifications
	 */
  toCustomer(): void {
    if (this.isBeneficiaire) {
      this.router.navigate(['customer-dashboard', 'particular', this.customerId],
       { queryParams: { typeCustomer: CONSTANTS.TYPE_BENEFICIARY } });
    } else if (this.isEntreprise) {
      this.router.navigate(['customer-dashboard', 'entreprise', this.customerId],
       { queryParams: { typeCustomer: CONSTANTS.TYPE_COMPANY } });
    } else if (this.isParticulier) {
      this.router.navigate(['customer-dashboard', 'particular', this.customerId],
       { queryParams: { typeCustomer: CONSTANTS.TYPE_PARTICULAR } });
    } else {
      this.router.navigate(['search', 'customer', this.customerId]);
    }
  }

  /**
	 * première lettre mise en majuscule
	 * @param name name
	 */
  formatName(name: string): string {
    if (!name) {
      return name;
    }
    return name[0].toUpperCase() + name.substr(1);
  }

  ngOnChanges(_changes: SimpleChanges): void {}

  /**
	 * Enregistrer la fiche.
	 */
  saveForm(): void {
    this.customerService.updateCustomer(this.customer).subscribe(data => {
      if (data === null) {
        this.router.navigate(['error']);
      } else {
        this.toCustomer();
      }
    });
  }

  /**
	 * Initialisation du modele pour enregistrement
	 */
  initModelForSave(): void {
    if (!this.isEntreprise) {
      this.customer.civility = this.model.civility;
      this.customer.firstName = this.model.firstName;
      this.customer.lastName = this.model.lastName;
      if (this.model.birthdate.value !== null) {
        this.customer.birthdate = format(this.model.birthdate.value, 'MM/DD/YYYY');
      } else {
        this.customer.birthdate = null;
      }
    }

    this.customer.language = this.model.language;
    if (this.infoModifY === this.model.goodToKnow) {
      this.customer.bonSavoirIsModify = false;
    } else {
      this.customer.bonSavoirIsModify = true;
    }
    this.customer.info = this.model.goodToKnow;
    this.customer.isEntreprise = this.isEntreprise;
    if (!isNaN(this.model.nic)) {
      this.customer.siret = this.model.siren + this.model.nic;
    } else {
      this.customer.siret = this.model.siren;
    }
    this.customer.companyName = this.model.companyName;
    if (this.siretModify === this.model.siren + this.model.nic) {
      this.customer.isSiretModify = false;
    } else {
      this.customer.isSiretModify = true;
    }
  }
}
