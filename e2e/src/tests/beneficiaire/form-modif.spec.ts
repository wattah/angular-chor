import { browser, protractor } from 'protractor';
import { SearchPage } from '../../page-object/searchPage.po';
import { Fiche360Beneficiaire } from '../../page-object/Fiche360Beneficiaire.po';
import { CustomerCardChange } from '../../page-object/customerCardChange.po';
import { GeneraleData } from '../../testData/GeneraleData';
import { Helpers } from '../../utils/helpers';
import { Fiche360Entreprise } from '../../page-object/Fiche360Entreprise.po';


const formModif = require('../../testData/beneficiaire/from-modif-profil.json');
const using = require('jasmine-data-provider');

const customerCardChange = new CustomerCardChange();

const fiche360_po = new Fiche360Beneficiaire();
const fiche360Entreprise = new Fiche360Entreprise();
const data = new GeneraleData();
const helpers = new Helpers();
const searchPage = new SearchPage();

function clearElementAndSetNewValue(element, data) {
    element.clear().then(function () {
        element.sendKeys(data);
    })
}
//la fonction clear() de protractor ne fonctionne pas correctoment parfois cette fonction simule son comportement
function supprimerTextSansClear(element, n) {
    var DELETE = protractor.Key.DELETE, ctrl = protractor.Key.CONTROL;
    for (let i = 0; i < n; i++) {
        element.click();
        element.sendKeys(ctrl + "a" + DELETE);
    }
}

function verifierPrenom(prenom) {
    clearElementAndSetNewValue(customerCardChange.getFirstName(), prenom);
    customerCardChange.getBouttonEnregistrer().click();
    expect(customerCardChange.getMessageErrorPrenom(1).getText()).toEqual(data.messageErrorPrenom1);
    expect(customerCardChange.getMessageErrorPrenom(2).getText()).toEqual(data.messageErrorPrenom2);
}

beforeEach(() => {
});

describe('SC11:Modifier le profil d\'un Bénéficiaire', () => {
    searchPage.navigateTo();
    browser.waitForAngular();

    using(formModif, function (element) {
        for (let donnees of element.beneficiaire) {
            describe(donnees.description, () => {

                it('CT011:Vérifier la prise en compte des modifications effectués sur l\'écran de profil d\'un bénéficiaire', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                    fiche360_po.getCrayonModifcationProfil().click();

                    customerCardChange.getCiviliteMme().click();
                    clearElementAndSetNewValue(customerCardChange.getFirstName(), donnees.firstName);
                    clearElementAndSetNewValue(customerCardChange.getlastName(), donnees.lastName);
                    supprimerTextSansClear(customerCardChange.getBirthdate(), 3);
                    customerCardChange.getBirthdate().sendKeys(donnees.dateNaissance);

                    customerCardChange.getLanguageAnglais().click();
                    clearElementAndSetNewValue(customerCardChange.getBonASavoir(), donnees.bonASavoir);
                    customerCardChange.getBouttonEnregistrer().click();

                    //verification de modif 
                    expect(fiche360_po.getName().getText()).toEqual(donnees.fullName);
                    expect(fiche360_po.getAge().getText()).toEqual(donnees.age);
                    expect(fiche360_po.getPictoLangueAnglais().isPresent()).toBeTruthy();
                    expect(fiche360_po.getBonASaoir().getText()).toEqual(donnees.bonASavoir);
                });

                //format de date
                it('CT012:Valider le profil avec une date de naissance erronée:date posterieur à la date actuelle ', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                    fiche360_po.getCrayonModifcationProfil().click();
                    supprimerTextSansClear(customerCardChange.getBirthdate(), 3);
                    customerCardChange.getBirthdate().sendKeys(data.datePosterrieur);
                    customerCardChange.getBouttonEnregistrer().click();
                    expect(customerCardChange.getMessageErrorDate(0).getText()).toEqual(data.messageErrorDatePost);
                    expect(customerCardChange.getMessageErrorDate(1).getText()).toEqual(data.messageErrorDatePost);
                });

                it('CT013:Valider le profil avec un prénom erroné', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                    fiche360_po.getCrayonModifcationProfil().click();
                    verifierPrenom(donnees.prenomErrone1);
                    verifierPrenom(donnees.prenomErrone2);
                    verifierPrenom(donnees.prenomErrone3);
                });

                it('CT014:Valider le profil sans saisir le nom du client', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                    fiche360_po.getCrayonModifcationProfil().click();
                    supprimerTextSansClear(customerCardChange.getlastName(), 1)
                    customerCardChange.getBouttonEnregistrer().click();
                    expect(customerCardChange.getMessageErrorNom(1).getText()).toEqual(data.messageErrorNom1);
                    expect(customerCardChange.getMessageErrorNom(2).getText()).toEqual(data.messageErrorNom2);
                });

                it('CT015:Valider le profil avec un commentaire bon à savoir qui dépasse 500 caractères ', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                    fiche360_po.getCrayonModifcationProfil().click();
                    clearElementAndSetNewValue(customerCardChange.getBonASavoir(), donnees.bonASavoirDepasse);
                    customerCardChange.getBouttonEnregistrer().click();
                    expect(customerCardChange.getMessageErrorBonASavoir(0).getText()).toEqual(data.messageErrorNote);
                    expect(customerCardChange.getMessageErrorBonASavoir(1).getText()).toEqual(data.messageErrorNote);
                });
            });
        }
    });
});
describe('SC12:Modifier le profil d\'un particulier', () => {
    searchPage.navigateTo();
    browser.waitForAngular();

    using(formModif, function (element) {

        for (let donnees of element.particulier) {
            describe(donnees.description, () => {

                it('CT016:Vérifier la prise en compte des modifications effectués sur l\'écran de profil d\'un Particulier', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                    fiche360_po.getCrayonModifcationProfil().click();

                    customerCardChange.getCiviliteMr().click();
                    clearElementAndSetNewValue(customerCardChange.getFirstName(), donnees.firstName);
                    clearElementAndSetNewValue(customerCardChange.getlastName(), donnees.lastName);
                    supprimerTextSansClear(customerCardChange.getBirthdate(), 3);
                    customerCardChange.getBirthdate().sendKeys(donnees.dateNaissance);

                    customerCardChange.getLanguageFrancais().click();
                    clearElementAndSetNewValue(customerCardChange.getBonASavoir(), donnees.bonASavoir);
                    customerCardChange.getBouttonEnregistrer().click();

                    //verification de modif 
                    expect(fiche360_po.getName().getText()).toEqual(donnees.fullName);
                    expect(fiche360_po.getAge().getText()).toEqual(donnees.age);
                    expect(fiche360_po.getPictoLangueFrancais().isPresent()).toBeTruthy();
                    expect(fiche360_po.getBonASaoir().getText()).toEqual(donnees.bonASavoir);
                });

                it('CT017:Valider le profil avec une date de naissance erronée:date posterieur à la date actuelle ', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                    fiche360_po.getCrayonModifcationProfil().click();
                    supprimerTextSansClear(customerCardChange.getBirthdate(), 3);

                    customerCardChange.getBirthdate().sendKeys(data.datePosterrieur);
                    customerCardChange.getBouttonEnregistrer().click();
                    expect(customerCardChange.getMessageErrorDate(0).getText()).toEqual(data.messageErrorDatePost);
                    expect(customerCardChange.getMessageErrorDate(1).getText()).toEqual(data.messageErrorDatePost);
                });

                it('CT018:Valider le profil avec un prénom erroné', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                    fiche360_po.getCrayonModifcationProfil().click();
                    verifierPrenom(donnees.prenomErrone1);
                    verifierPrenom(donnees.prenomErrone2);
                    verifierPrenom(donnees.prenomErrone3);

                });

                it('CT019:Valider le profil sans saisir le nom du client', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                    fiche360_po.getCrayonModifcationProfil().click();
                    supprimerTextSansClear(customerCardChange.getlastName(), 1)
                    customerCardChange.getBouttonEnregistrer().click();
                    expect(customerCardChange.getMessageErrorNom(1).getText()).toEqual(data.messageErrorNom1);
                    expect(customerCardChange.getMessageErrorNom(2).getText()).toEqual(data.messageErrorNom2);
                });

                it('CT020:Valider le profil avec un commentaire bon à savoir qui dépasse 500 caractères ', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                    fiche360_po.getCrayonModifcationProfil().click();
                    clearElementAndSetNewValue(customerCardChange.getBonASavoir(), donnees.bonASavoirDepasse);
                    customerCardChange.getBouttonEnregistrer().click();
                    expect(customerCardChange.getMessageErrorBonASavoir(0).getText()).toEqual(data.messageErrorNote);
                    expect(customerCardChange.getMessageErrorBonASavoir(1).getText()).toEqual(data.messageErrorNote);
                });
            });
        }
    });
});




