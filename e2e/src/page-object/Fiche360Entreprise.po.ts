import { by, element, ElementFinder } from 'protractor';
import { Fiche360 } from './fiche360.po';

export class Fiche360Entreprise extends Fiche360 {

    //---------------Detail coordonnées ----------------

    getCouleur(): ElementFinder {
        return element(by.id('body'));
    }
    getVoirPlusEntrepriseTele():ElementFinder {

        return element(by.id('e2e_voirPlusEntrepriseTele'));
    }
    getVoirPlusEntrepriseEmail() :ElementFinder {

        return element(by.id('e2e_voirPlusEntrepriseEmail'));
    }
    getVoirPlusEntrepriseAdresse():ElementFinder {

        return element(by.id('e2e_voirPlusEntrepriseAdresse'));
    }

    getLienRetourFiche360fromCoordonnees(): ElementFinder {
        return element(by.id('e2e_retourFiche360Entreprise'));
    }

    getTitleDetailCoordonnees(n): ElementFinder {
        return element.all(by.tagName('h2')).get(n);
    }
    getModificationBouttonProfil(): ElementFinder {
        return element(by.id('e2e_btn_modification'));
    }
}