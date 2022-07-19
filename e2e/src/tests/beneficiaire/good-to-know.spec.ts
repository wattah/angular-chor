import { browser } from 'protractor';
import { SearchPage } from '../../page-object/searchPage.po';
import { Fiche360Beneficiaire } from '../../page-object/Fiche360Beneficiaire.po';
import { GeneraleData } from '../../testData/GeneraleData';
import { Helpers } from '../../utils/helpers';

const bonAsavoir = require('../../testData/beneficiaire/bon-a-savoir.json');
const using = require('jasmine-data-provider');

const fiche360_po = new Fiche360Beneficiaire();
const data = new GeneraleData();
const helpers = new Helpers();
const  searchPage = new SearchPage();

beforeEach(() => {
});

//------------------------bloc bon a savoir------------------------------------
describe('SC24:Vérifier le bon affichage du bloc Bon à savoir ', () => {

    searchPage.navigateTo();
    browser.waitForAngular();

    using(bonAsavoir, function (element) {
        for (let donnees of element.a) {
            it('CT065:Vérifier le format d\'affichage de la date de modification: '+donnees.description, function () {
                helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                browser.waitForAngular();
                helpers.scrollToElement(fiche360_po.getTitreBonASaoir());
                expect(fiche360_po.getDateBonASaoir().getText()).toEqual(donnees.date_note);
            });
        }
    });

    using(bonAsavoir, function (element) {
        for (let donnees of element.b) {
            it('CT066:Vérifier la RG  d\'affichage du nom et prénom de la personne ayant  crée ou modifié le bon à savoir', function () {
                helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                helpers.scrollToElement(fiche360_po.getTitreBonASaoir());
                expect(fiche360_po.getAuteurBonASaoir().getText()).toEqual(donnees.writer);
            });
            it('CT064:Vérifier Le contenu du bloc Bon à savoir', function () {
                helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                helpers.scrollToElement(fiche360_po.getTitreBonASaoir());
                expect(fiche360_po.getTitreBonASaoir().getText()).toEqual(data.titreBonAsavoir);
                expect(fiche360_po.getBonASaoir().getText()).toEqual(donnees.note_value)
            });

            xit('CT067:Vérifier la redirection vers l\'écran de modification des bon à savoir lors du clic sur le crayon de modification', function () {
            });
        }
    });

    using(bonAsavoir, function (element) {
        for (let donnees of element.c) {
         

            it('CT076:Vérifier l\'affichage du titre du bloc Bon à savoir  dans le cas ou le client ne dispose pas de note', function () {
                helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                helpers.scrollToElement(fiche360_po.getTitreBonASaoir());
                expect(fiche360_po.getTitreBonASaoir().isPresent()).toBeTruthy();
                expect(fiche360_po.getBonASaoir().isPresent()).toBeFalsy();
            });
        }
    });
});
