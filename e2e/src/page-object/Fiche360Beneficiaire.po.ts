import { by, element, ElementFinder } from 'protractor';
import { Fiche360 } from './fiche360.po';

export class Fiche360Beneficiaire extends Fiche360 {

    //---------------information profil beneficiare ----------------

    getName(): ElementFinder {
        return element(by.className('name-customer'));
    }
    getContart(): ElementFinder {
        return element(by.id('e2e_contrat'));
    }
    getEtaMembre(): ElementFinder {
        return element(by.id('e2e_etatMembre'));
    }
    getAge(): ElementFinder {
        return element(by.id('e2e_age'));
    }
    getApporteurFournisseur(): ElementFinder {
        //il faut mettre l'information apporteur fournisseur dans un element html (span) pour pouvoir la recuperer facielement avec un id 
        return element(by.id('e2e_providerSupplier'))
    }
    getSecteur(): ElementFinder {
        return element(by.id('e2e_secteur'));
    }
    getMetier(): ElementFinder {
        return element(by.id('e2e_metier'));
    }
    getEntreprise(): ElementFinder {
        return element(by.id('e2e_entreprise'));
    }
    getPictoLangueAnglais(): ElementFinder {
        return element(by.className("icon en-flag"));
    }
    getPictoLangueFrancais(): ElementFinder {
        return element(by.className("icon fr-flag"));
    }
    getCrayonModifcationProfil(): ElementFinder {
        return element(by.id("e2e_modificationCrayon"));
    }
    getPictoBeneficiaire(): ElementFinder {
        return element(by.className('badge badge-yellow'));
    }
    getbeneficiare(n): ElementFinder {
        return element.all(by.css("img[src*='assets/images/type-beneficiaire.png']")).get(n);
    }
    getAvatarFemme(): ElementFinder {
        return element(by.css("img[src*='assets/images/customer-dashboard/avatar-f.svg']"));
    }
    getAvatarHomme(): ElementFinder {
        return element(by.css("img[src*='assets/images/customer-dashboard/avatar-h.svg']"));
    }
    getPhoto(): ElementFinder {
        return element(by.css("img[src*='a']"));
    }
    
}