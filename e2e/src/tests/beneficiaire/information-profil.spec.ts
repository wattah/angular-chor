import { browser, protractor} from 'protractor';
import { SearchPage } from '../../page-object/searchPage.po';
import { Fiche360Beneficiaire } from '../../page-object/Fiche360Beneficiaire.po';
import { CustomerCardChange } from '../../page-object/customerCardChange.po';
import { GeneraleData } from '../../testData/GeneraleData';
import { Helpers } from '../../utils/helpers';

const beneficiareInfoprofil = require('../../testData/beneficiaire/info-profil.json');
const formModif = require('../../testData/beneficiaire/from-modif-profil.json');
const using = require('jasmine-data-provider');

const customerCardChange = new CustomerCardChange();
const Request = require("request");
const fiche360_po = new Fiche360Beneficiaire();
const data = new GeneraleData();
const helpers = new Helpers();
const searchPage = new SearchPage();



beforeEach(() => {
});

afterAll(() => {
    // Request.get({
    //     "headers": { "content-type": "application/json" },
    //     "url": "http://localhost:9508/purgeInitialiseDatabase"

    // }, (error, response, body) => {
    //     if (error) {
    //         return console.dir(error);
    //     }

    //     console.log("\n\n\nResponse Code ****:" + response.statusCode)

    //     expect(response.statusCode).toBe(200)

    // });
});

describe('SC10:Vérifier le bon affichage du bloc Information profil  d\'un Bénéficiaire', () => {
    searchPage.navigateTo();
    browser.waitForAngular();

    using(beneficiareInfoprofil, (donnees) => {
        describe('JD' + donnees.jd+donnees.description, () => {
           
            it('CT026:chercher un bénéficiaire à l\'aide de la barre de suggestion :le mot cle ' + donnees.motCleSearch, function () {
                helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
            });

            it('CT027:Vérifier le pictogramme bénéficiaire', function () {
                expect(fiche360_po.getPictoBeneficiaire().isPresent()).toBeTruthy();
            });

            it('CT028:Vérifier le pictogramme langue ', function () {
                if (donnees.langue == 'Francais') {
                    expect(fiche360_po.getPictoLangueAnglais().isPresent()).toBeTruthy();
                }
                else if (donnees.langue == 'Anglais') {
                    expect(fiche360_po.getPictoLangueAnglais().isPresent()).toBeTruthy();
                }
                else{
                    expect(fiche360_po.getPictoLangueAnglais().isPresent()).toBeFalsy();
                    expect(fiche360_po.getPictoLangueAnglais().isPresent()).toBeFalsy();
                }
            });

            it('CT029:Vérifier  le nom ,prénom et la civilité affiché ', function () {
                expect(fiche360_po.getName().getText()).toEqual(donnees.fullName);
            });

            it('CT030:Vérifier La valeur affichée du Num de contrat', function () {
                expect(fiche360_po.getContart().getText()).toEqual(donnees.ncontrat);
            });

            it('CT031:Vérifier La valeur affichée du Etat du membre', function () {
                expect(fiche360_po.getEtaMembre().getText()).toEqual(donnees.etatMembre);
            });

            it('CT032:Vérifier La valeur affichée du Secteur', function () {
                expect(fiche360_po.getSecteur().getText()).toEqual(donnees.secteur);
            });
            it('CT033:Vérifier La valeur affichée du Métier', function () {
                expect(fiche360_po.getMetier().getText()).toEqual(donnees.metier);
            });

           

            it('CT037:Vérifier le bon affichage de l\'age et la date de naissance du client', function () {
                if (donnees.age) {
                    expect(fiche360_po.getAge().getText()).toEqual(donnees.age);
                }
                else{
                    expect(fiche360_po.getAge().isPresent()).toBeFalsy();
                }
            });

            it('CT054:Vérifier La valeur affichée du Apporteur/Fournisseur', function () {
                if (donnees.apporteurFournisseur) {
                    expect(fiche360_po.getApporteurFournisseur().getText()).toEqual(donnees.apporteurFournisseur);
                }
                else{
                    expect(fiche360_po.getApporteurFournisseur().isPresent()).toBeFalsy();
                }
            });

            it('CT055:Vérifier La valeur affichée du nom de l\'entreprise ', function () {
                expect(fiche360_po.getEntreprise().getText()).toEqual(donnees.entreprise.trim());
            });
            
            it('CT036:Vérifier le bon affichage du AVATAR client', function () {
                if (donnees.photo) {
                    expect(fiche360_po.getPhoto().isPresent()).toBeTruthy();
                }
                else if (donnees.civilite == "femme") {
                    expect(fiche360_po.getAvatarFemme().isPresent()).toBeTruthy();
                }
                else if (donnees.civilite == "homme") {
                    expect(fiche360_po.getAvatarHomme().isPresent()).toBeTruthy();
                }
            });

            it('CT035:Vérifier la redirection vers la fiche entreprise', function () {
                fiche360_po.getEntreprise().click();
                //browser.actions().mouseMove(fiche360_po.getEntreprise()).click();
                browser.getCurrentUrl().then(function (text) {
                    var url_fiche_entreprise = text.substring(text.indexOf('#'));
                    expect(url_fiche_entreprise).toEqual(data.urlFicheEntreprise + donnees.idEntreprise);
                })
            });

            it('CT034:Vérifier la redirection du licône crayon vers le formulaire de modification ', function () {
                helpers.searchCustomer(donnees.motCleSearch, donnees.noElement);
                fiche360_po.getCrayonModifcationProfil().click();
                browser.waitForAngular();
                browser.getCurrentUrl().then(function (text) {
                    var url_fiche_modification = text.substring(text.indexOf('#'));
                    expect(url_fiche_modification).toEqual(data.urlFicheBeneficiaire + donnees.id + "/modification")
                })
              
            });


           
        });
    });

   
});
