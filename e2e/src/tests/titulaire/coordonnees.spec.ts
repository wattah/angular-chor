import { browser, } from 'protractor';
import { Fiche360Entreprise } from '../../page-object/Fiche360Entreprise.po';
import { GeneraleData } from '../../testData/GeneraleData';
import { Helpers } from '../../utils/helpers';
import { SearchPage } from '../../page-object/searchPage.po';

describe('Fiche 360:entreprise', () => {
    const entrepriseCoordonnees = require('../../testData/titulaire/coordonnees.json');
    const using = require('jasmine-data-provider');

    const fiche360Entreprise = new Fiche360Entreprise()
    const helpers = new Helpers();
    const data = new GeneraleData();
    const searchPage = new SearchPage();

    beforeEach(() => {
    });

    function verifyRedirectionVoirPlusCoordonnees(element, url, id) {
        element.click();
        browser.waitForAngular();
        browser.getCurrentUrl().then(function (text) {
            var urlReel = text.substring(text.indexOf('#'));
            var urlBase = fiche360Entreprise.construireUrlDetailCoordonnees(url, id);
            expect(urlReel).toEqual(urlBase);
        })
    }

    //------------------------coordonnées---------------------
    describe('SC18:Vérifier le bon affichage du bloc Cordonnées  d\'un titulaire', () => {
        searchPage.navigateTo();
        browser.waitForAngular();

        using(entrepriseCoordonnees, function (element) {
            for (let donnees of element.a) {
                it('CT056:Vérifier que le nombre  maximum des lignes affiché pour chaque type est 3', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.nbElement);
                    expect(fiche360Entreprise.getAllTele().count()).toBeLessThanOrEqual(3);
                    expect(fiche360Entreprise.getAllEmail().count()).toBeLessThanOrEqual(3);
                    expect(fiche360Entreprise.getAllAdresse().count()).toBeLessThanOrEqual(3);
                });
            }
        });
        using(entrepriseCoordonnees, function (element) {
            for (let donnees of element.b) {
                it('CT057:Vérifier que dans le cas  ou l\'administrateur a plusieurs numéros de téléphone le système affiche le numéro de fixe en priorité.', function () {
                    helpers.searchCustomerByboutton(donnees.motCleSearch, donnees.nbElement);
                    expect(fiche360Entreprise.getPictoTele().getAttribute('class')).toContain('icon phone-home');
                });
            }
        });
        using(entrepriseCoordonnees, function (element) {
            for (let donnees of element.c) {
                it('CT058:Vérifier l\'ordre d\'affichage  des coordonnées des titulaires des contrats', function () {
                    helpers.searchCustomerByboutton(donnees.motCleSearch, donnees.nbElement);
                    //tele:
                    expect(fiche360Entreprise.getTele(0).getText()).toEqual(donnees.telephone1_value + donnees.telephone1_label);
                    expect(fiche360Entreprise.getTele(1).getText()).toEqual(donnees.telephone2_value + donnees.telephone2_label);
                    expect(fiche360Entreprise.getTele(2).getText()).toEqual(donnees.telephone3_value + donnees.telephone3_label);
                    // email:
                    expect(fiche360Entreprise.getEmail(0).getText()).toEqual(donnees.email1_value + donnees.email1_label);
                    expect(fiche360Entreprise.getEmail(1).getText()).toEqual(donnees.email2_value + donnees.email2_label);
                    expect(fiche360Entreprise.getEmail(2).getText()).toEqual(donnees.email3_value + donnees.email3_label);
                    //adresse:
                    expect(fiche360Entreprise.getAdresse(0).getText()).toEqual(donnees.adresse1);
                    expect(fiche360Entreprise.getAdresse(1).getText()).toEqual(donnees.adresse2);
                    expect(fiche360Entreprise.getAdresse(2).getText()).toEqual(donnees.adresse3);
                });
            }
        });
        using(entrepriseCoordonnees, function (element) {
            for (let donnees of element.d) {
                it('CT059:Vérifier que le numéro RP est privilégié par rapport au d\'autres type de numéro du titulaire', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.nbElement);
                    expect(fiche360Entreprise.getTele(0).getText()).toEqual(donnees.telephone1_value + donnees.telephone1_label);
                    expect(fiche360Entreprise.getTele(2).getText() || fiche360Entreprise.getTele(1).getText()).toEqual(donnees.telephone3_value + donnees.telephone3_label);
                    expect(fiche360Entreprise.getTele(1).getText() || fiche360Entreprise.getTele(2).getText()).toEqual(donnees.telephone2_value + donnees.telephone2_label);
                    expect(fiche360Entreprise.getAllTele().count()).toBeLessThanOrEqual(3);
                });
            }
        });

        using(entrepriseCoordonnees, function (element) {
            for (let donnees of element.e) {
                it('CT060:Vérifier que le nombre  maximum des lignes  affiché  d\'un administrateur est 2 le cas ou le titulaire a un seul numéro', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.nbElement);
                    expect(fiche360Entreprise.getTele(0).getText()).toEqual(donnees.telephone1_value + donnees.telephone1_label);
                    expect(fiche360Entreprise.getTele(1).getText()).toEqual(donnees.telephone2_value + donnees.telephone2_label);
                    expect(fiche360Entreprise.getTele(2).getText()).toEqual(donnees.telephone3_value + donnees.telephone3_label);
                });
            }
        });

        using(entrepriseCoordonnees, function (element) {
            for (let donnees of element.f) {
                it('CT061:Vérifier l\'ordre d\'affichage des cordonnées téléphonique le cas ou le titulaire a plusieurs numéro tel', function () {
                    helpers.searchCustomerByboutton(donnees.motCleSearch, donnees.nbElement);
                    expect(fiche360Entreprise.getTele(0).getText()).toEqual(donnees.telephone1_value + donnees.telephone1_label);
                    expect(fiche360Entreprise.getTele(1).getText()).toEqual(donnees.telephone2_value + donnees.telephone2_label);
                    expect(fiche360Entreprise.getTele(2).getText()).toEqual(donnees.telephone3_value + donnees.telephone3_label);
                });
            }
        });
        it('CT62:Vérifier les pictos affichés dans les 3 blocs des cordonnées (Adresses postales,numéros de téléphone,adresses mails)', function () {
            expect(fiche360Entreprise.getCouleur().getAttribute('class')).toEqual('container-fluid env-blue');
        });

        using(entrepriseCoordonnees, function (element) {
            for (let donnees of element.g) {
                it('CT063:Vérifier la redirection vers la page de détail lors du clic sur les boutons voir tout)', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.nbElement);

                    verifyRedirectionVoirPlusCoordonnees(fiche360Entreprise.getVoirPlusEntrepriseTele(), data.voir_plus_coordonnes_entreprise, donnees.id_customer);
                    fiche360Entreprise.getLienRetourFiche360fromCoordonnees().click();

                    verifyRedirectionVoirPlusCoordonnees(fiche360Entreprise.getVoirPlusEntrepriseEmail(), data.voir_plus_coordonnes_entreprise, donnees.id_customer);
                    fiche360Entreprise.getLienRetourFiche360fromCoordonnees().click();

                    verifyRedirectionVoirPlusCoordonnees(fiche360Entreprise.getVoirPlusEntrepriseAdresse(), data.voir_plus_coordonnes_entreprise, donnees.id_customer);
                    fiche360Entreprise.getLienRetourFiche360fromCoordonnees().click();
                });
            }
        });

        using(entrepriseCoordonnees, function (element) {
            for (let donnees of element.h) {
                it('CT068:érifier l\'affichage du titre du bloc Cordonnées dans le cas ou le client ne dispose pas d\'adresse', function () {
                    helpers.searchCustomer(donnees.motCleSearch, donnees.nbElement);
                    expect(fiche360Entreprise.getTitreCoordonnees().getText()).toEqual(donnees.titre);
                });
            }
        });

        xit('CT69:Vérifier la redirection vers l\'écran de modification des Cordonnées lors du clic sur le crayon de modification', function () {
        });

       
    })
});
