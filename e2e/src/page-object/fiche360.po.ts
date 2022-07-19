import { by, element, ElementFinder,ElementArrayFinder } from 'protractor';

export class Fiche360 {

    //-----------------------------team parnasse-----------------------------------

    getTitreBlocTeamParnasse(): ElementFinder {
        return element(by.id('e2e_titreTeamParnasse'));
    }

    getCoach(): ElementFinder {
        return element(by.id('e2e_coach'));
    }

    getMembreGrisé(t, n): ElementFinder {
        return element(by.css("*[id='e2e_" + t + "'] > td:nth-of-type(" + n + ")>span"));
    }

    getMembreNonGrisé(type, n): ElementFinder {
        return element(by.css("*[id='e2e_" + type + "'] > td:nth-of-type(" + n + ")>span>a"));
    }

    getIconMail(type, n): ElementFinder {
      // return element(by.css('app-team-parnasse>table>tbody>tr:nth-of-type(1)>td:nth-of-type(1)>a>span'))
       return element(by.css("*[id='e2e_" + type + "'] > td:nth-of-type(" + n + ")>a>span"));
    }
    getIconMailGrisé(type, n): ElementFinder {
        return element(by.css("*[id='e2e_" + type + "'] > td:nth-of-type(" + n + ")>span"));
    }

    getMembreOfTeamParnasse(type): ElementFinder {
        return element(by.css("*[id='e2e_" + type + "'] > td:nth-of-type(3)"));
    }
    //------------------------------------coordonées-----------------------------------------------------------

    getTele(n): ElementFinder {
        return element.all(by.id('e2e_mobileFix')).get(n);
    }
    getAllTele() {
        return element.all(by.id('e2e_mobileFix'));
    }
    getAllEmail() {
        return element.all(by.id('e2e_email'));
    }
    getAllAdresse() {
        return element.all(by.id('e2e_adresse'));
    }
    getEmail(n): ElementFinder {
        return element.all(by.id('e2e_email')).get(n);
    }
    getAdresse(n): ElementFinder {
        return element.all(by.id('e2e_adresse')).get(n);
    }
    getTelephones(): ElementFinder {
        return element(by.id('e2e_telephones'));
    }
    getEmails(): ElementFinder {
        return element(by.id('e2e_emails'));
    }
    getAdresses(): ElementFinder {
        return element(by.id('e2e_adresses'));
    }
    construireUrlDetailCoordonnees(url, id): string {
        return url + "/" + id + "/coordonnees-details"
    }
    getTitreCoordonnees(): ElementFinder {
        return element(by.id('e2e_coordonnees'));
    }
    getPictoTele(): ElementFinder {
        return element.all(by.css("*[id='e2e_mobileFix'] > td:nth-of-type(1)>span")).first();
    }

    //---------------bon a savoir----------------------------
    getTitreBonASaoir(): ElementFinder {
        return element(by.id('e2e_titreBonAsavoir'))
    }
    getBonASaoir(): ElementFinder {
        return element(by.id('e2e_noteBody'))
    }
    getAuteurBonASaoir(): ElementFinder {
        return element(by.id('e2e_author'))
    }
    getDateBonASaoir(): ElementFinder {
        return element(by.id('e2e_dateNote'))
    }

    //----------------------------parc service et materiel-------------------
    getTableParcServiceEtMateriel(): ElementFinder {
        return element(by.id('serviceMaterielTable'));
    }
    getFamille(n): ElementFinder { 
        return element.all(by.id('e2e_famille')).get(n);
    }
    getArticle(n): ElementFinder {
        return element.all(by.id('e2e_article')).get(n);
    }
    getStatutPS(n): ElementFinder {
        return element.all(by.id('e2e_statut')).get(n);
    }
    getBouttonPlusParcServiceMateriel(): ElementFinder {
        return element(by.id);
    }
    getTitreFamille(): ElementFinder {
        return element(by.id('e2e_titreFamille'));
    }
    getTitreArticle(): ElementFinder {
        return element(by.id('e2e_titreArticle'));
    }
    getTitreStatut(): ElementFinder {
        return element(by.id);
    }
    getTitreParcServiceEtMateriel(): ElementFinder {
        return element(by.id('e2e_titrePSM'));
    }
    getVoirPlusParcServiceMateriel(): ElementFinder {
        return element(by.id('e2e_voirPlusPSM'));
    }
    getNombreElmentsAffichesPSM() {
        return element.all(by.id('e2e_ligneTable'));
    }


}
