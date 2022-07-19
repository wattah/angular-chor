import { browser} from 'protractor';
import { SearchPage } from '../../page-object/searchPage.po';
import { Fiche360Beneficiaire } from '../../page-object/Fiche360Beneficiaire.po';
import { GeneraleData } from '../../testData/GeneraleData';
import { Helpers } from '../../utils/helpers';

const parcServiceEtMateriel = require('../../testData/beneficiaire/parck-service-materiel.json');
const using = require('jasmine-data-provider');

const fiche360_po = new Fiche360Beneficiaire();
const data = new GeneraleData();
const helpers = new Helpers();
const searchPage = new SearchPage();

beforeEach(() => {

});

describe('SC27:Vérifier le bon affichage du bloc Parc service et matériel_Bénéficiaire', () => {
    searchPage.navigateTo();

    using(parcServiceEtMateriel, function (element) {
        for (let donnees of element.a) {
        it('CT070:Vérifier que le nombre des lignes affiché est 4 + l\'apparition du lien Voir tout', function () {
            helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
            helpers.scrollToElement(fiche360_po.getTitreParcServiceEtMateriel());
            expect(fiche360_po.getNombreElmentsAffichesPSM().count()).toBe(4)
            expect(fiche360_po.getVoirPlusParcServiceMateriel().isPresent()).toBeTruthy();
        });

        it('CT074:Vérifier la redirection vers l\'écran de détail lors du clic sur le lien Voir tout', function () {
            fiche360_po.getVoirPlusParcServiceMateriel().click();
            browser.getCurrentUrl().then(function (text) {
                var urlReel = text.substring(text.indexOf(donnees.customer_id));
                var urlBase = donnees.customer_id + data.urlVoirPlusPSM;
                expect(urlReel).toEqual(urlBase);
            })
        });
    }
    for (let donnees of element.b) {

        it('CT071:Vérifier que toutes les lignes récupérée depuis la  base sont bien affichées + la disparition du  lien Voir tout', function () {
            helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
            helpers.scrollToElement(fiche360_po.getTitreParcServiceEtMateriel());
            expect(fiche360_po.getNombreElmentsAffichesPSM().count()).toBe(donnees.nbLigne);
            expect(fiche360_po.getVoirPlusParcServiceMateriel().isPresent()).toBeFalsy();
        });

        it('CT073:Vérifier le contenu du tableau', function () {
            expect(fiche360_po.getFamille(0).getText()).toEqual(donnees.famille1);
            expect(fiche360_po.getFamille(1).getText()).toEqual(donnees.famille2);
            expect(fiche360_po.getFamille(2).getText()).toEqual(donnees.famille3);

            expect(fiche360_po.getArticle(0).getText()).toEqual(donnees.article1);
            expect(fiche360_po.getArticle(1).getText()).toEqual(donnees.article2);
            expect(fiche360_po.getArticle(2).getText()).toEqual(donnees.article3);

            //verification de statut:
            expect(fiche360_po.getStatutPS(0).getAttribute('class')).toEqual(donnees.statut1);
            expect(fiche360_po.getStatutPS(1).getAttribute('class')).toEqual(donnees.statut2);
            expect(fiche360_po.getStatutPS(2).getAttribute('class')).toEqual(donnees.statut3);
        });

        it('CT072:Vérifier que la colonne famille et article sont triable', function () {
            fiche360_po.getTitreFamille().click().then(function () {
                expect(fiche360_po.getFamille(0).getText()).toEqual(donnees.famille2);
                expect(fiche360_po.getFamille(1).getText()).toEqual(donnees.famille1);
                expect(fiche360_po.getFamille(2).getText()).toEqual(donnees.famille3);
            });
            fiche360_po.getTitreArticle().click().then(function () {
                expect(fiche360_po.getArticle(0).getText()).toEqual(donnees.article1);
                expect(fiche360_po.getArticle(1).getText()).toEqual(donnees.article3);
                expect(fiche360_po.getArticle(2).getText()).toEqual(donnees.article2);
            });
        });

        it('CT077:Vérifier la redirection vers l\'écran de détail du service lors du clic sur toute la ligne en question', function () {
            fiche360_po.getFamille(0).click();
            browser.getCurrentUrl().then(function (text) {
                var urlReel = text.substring(text.indexOf("#"));
                expect(urlReel).toEqual(data.urlFicheBeneficiaire + donnees.customer_id + data.urlDetailLignePSM+donnees.idLigne1);
            })
        });
    }
    for (let donnees of element.c) {
        it('CT075:Vérifier l\'affichage du titre du bloc dans le cas ou aucune ligne n\'est retournée depuis la  base', function () {
            helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
            helpers.scrollToElement(fiche360_po.getTitreParcServiceEtMateriel());
            expect(fiche360_po.getTitreParcServiceEtMateriel().isPresent()).toBeTruthy();
            expect(fiche360_po.getTableParcServiceEtMateriel().isPresent()).toBeFalsy();
        });
   

    xit('CT078:Vérifier la redirection vers l\'écran d\'ajout des lignes parc service et matériel lors du clic sur le bouton Ajouter +', function () {
    });
    }
});
});