import { browser } from 'protractor';
import { SearchPage } from '../../page-object/searchPage.po';
import { Fiche360Beneficiaire } from '../../page-object/Fiche360Beneficiaire.po';
import { Helpers } from '../../utils/helpers';

const beneficiareTeamParnasse = require('../../testData/beneficiaire/team-parnasse.json');
const using = require('jasmine-data-provider');

const helpers = new Helpers();
const fiche360_po = new Fiche360Beneficiaire();
const searchPage = new SearchPage();

beforeEach(() => {
});


describe('SC21:Vérifier les informations de team parnasse ', () => {

    searchPage.navigateTo();
    browser.waitForAngular();
    describe('Cas nominale:presence de tout les membres', () => {
    using(beneficiareTeamParnasse, function (element) {
        for (let donnees of element.a) {

            it('CT046:Vérifier les informations coach_Client Bénéficiaire', function () {
                helpers.searchCustomer(donnees.motCleSearch, donnees.noElement)
                helpers.scrollToElement(fiche360_po.getTitreBlocTeamParnasse());
                expect(fiche360_po.getMembreOfTeamParnasse("coach").getText()).toEqual(donnees.name_coach);
         

            });
            it('CT048:Vérifier les informations desk_Client Bénéficiaire', function () {
                expect(fiche360_po.getMembreOfTeamParnasse("desk").getText()).toEqual(donnees.name_desk);
              
            });

            it('CT047:Vérifier les information responsable adhésion_Client Bénéficiaire', function () {
                expect(fiche360_po.getMembreOfTeamParnasse("adhesion").getText()).toEqual(donnees.name_adhesion); 
            });

            xit('CT045:Vérifier la redirection vers l\'écran de modification de TEAM PARNASSE lors du clic sur le crayon de modification _Client Bénéficiaire', function () {
            });

        }
    });
    using(beneficiareTeamParnasse, function (element) {
        for (let donnees of element.c) {
            it('CT052:Vérifier que l\'icone Outlook est grisé le cas ou le membre ne dipose pas d\'adresse email_Client Bénéficiaire', function () {
                helpers.searchCustomer(donnees.motCleSearch, donnees.noElement)
                helpers.scrollToElement(fiche360_po.getTitreBlocTeamParnasse());

                expect(fiche360_po.getIconMailGrisé(donnees.type, 1).getAttribute('class')).toEqual('icon mail-gris');
                expect(fiche360_po.getMembreGrisé(donnees.type, 3).isPresent());
            
            });
        }
    });
});

    describe('Absence d\'un membre team parnasse', () => {
        using(beneficiareTeamParnasse, function (element) {
            for (let donnees of element.b) {
                it('CT053:Vérifier la disparition de la ligne entière du membre le cas ou la donnée n\'existe pas en base_Cas Bénéficiaire:' + donnees.description, function () {

                    helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                    helpers.scrollToElement(fiche360_po.getTitreBlocTeamParnasse());
                    expect(fiche360_po.getMembreOfTeamParnasse(donnees.type).isPresent()).toBeFalsy();

                    if (donnees.type == "coach") {
                        expect(fiche360_po.getMembreOfTeamParnasse("desk").isPresent()).toBeTruthy();
                        expect(fiche360_po.getMembreOfTeamParnasse("adhesion").isPresent()).toBeTruthy();
                    }

                    else if (donnees.type == "desk") {
                        expect(fiche360_po.getMembreOfTeamParnasse("coach").isPresent()).toBeTruthy();
                        expect(fiche360_po.getMembreOfTeamParnasse("adhesion").isPresent()).toBeTruthy();
                    }

                    else if (donnees.type == "adhesion") {
                        expect(fiche360_po.getMembreOfTeamParnasse("desk").isPresent()).toBeTruthy();
                        expect(fiche360_po.getMembreOfTeamParnasse("coach").isPresent()).toBeTruthy();
                    }
                    else {
                        expect(fiche360_po.getMembreOfTeamParnasse("desk").isPresent()).toBeTruthy();
                        expect(fiche360_po.getMembreOfTeamParnasse("coach").isPresent()).toBeTruthy();
                        expect(fiche360_po.getMembreOfTeamParnasse("adhesion").isPresent()).toBeTruthy();
                    }
                });
            }
        });

    });

});
