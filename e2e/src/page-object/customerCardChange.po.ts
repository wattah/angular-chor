import { by, element, ElementFinder } from 'protractor';


export class CustomerCardChange {

  getCiviliteMme(): ElementFinder {
    return element(by.id('e2e_femme'));
  }
  getCiviliteMr(): ElementFinder {
    return element(by.id('e2e_homme'));
  }

  getFirstName(): ElementFinder {
    return element(by.name('firstName'));
  }

  getlastName(): ElementFinder {
    return element(by.name('lastName'));
  }

  getBirthdate(): ElementFinder {
    return element(by.name('birthdate'));
  }

  getLanguageAnglais(): ElementFinder {
    return element(by.id('e2e_langue_anglais'));
  }

  getLanguageFrancais(): ElementFinder {
    return element(by.id('e2e_langue_francais'));
  }

  getBonASavoir(): ElementFinder {
    return element(by.name('goodToKnow'));
  }

  getBouttonEnregistrer(): ElementFinder {
    return element(by.className("vert btn mat-button"));
  }

  getBouttonAnnuler(): ElementFinder {
    return element(by.className("rouge btn mat-button"));
  }
  getMessageErrorDate(n): ElementFinder {
    return element.all(by.className("La-date-de-naissance")).get(n);
  }

  getMessageErrorPrenom(n): ElementFinder {
    return element(by.id("e2e_msg-error-prenom" + n));
  }

  getMessageErrorBonASavoir(n): ElementFinder {
    return element.all(by.className("Ce-champ-dpasse-le")).get(n);
  }

  getMessageErrorNom(n): ElementFinder {
    return element(by.id("e2e_msg-error-nom" + n))
  }

  //entreprise :

  getSIREN(): ElementFinder {
    return element(by.className('Rectangle-siret')).all(by.tagName('input')).first();
  }

  getNIC(): ElementFinder {
    return element(by.name('nic'))
  }

  getRaisonSociale(): ElementFinder {
    return element(by.name('companyName'))
  }

  getMessageObligatoireSiren(): ElementFinder {
    return element(by.className('Le-champ-SIREN-est-o'));
  }

  getMessageObligatoireSirenHaut(): ElementFinder {
    return element(by.className('Le-champ-SIREN-est-o-hau'));
  }

  getMessageObligatoireRaisonSociale(): ElementFinder {
    return element(by.className('Ce-champ-est-obligat'));
  }

  getMessageObligatoireRaisonSocialehaut(): ElementFinder {
    return element(by.className('Ce-champ-est-obligat'));
  } 










}