export class GeneraleData {

  urlFicheEntreprise: string;
  urlFicheBeneficiaire: string;
  urlVoirPlusPSM:string;
  urlDetailLignePSM:string;
  voir_plus_coordonnes_entreprise: string;

  titreCoordonnesTelephonique: string;
  titreCoordonnesElectroniques: string;
  titreCoordonnesPostale: string;
  titreBonAsavoir: string;

  messageErrorDatePost:string;
  datePosterrieur:string;

  messageErrorPrenom1:string;
  messageErrorPrenom2:string;

  messageErrorNom1:string
  messageErrorNom2:string;;
  messageErrorNote:string;
  messageErrorObligatoireSiren:string;
  messageErrorObligatoireSirenHaut:string;
  
  constructor() {
    //---------------------------- urls---------------------------------------
    this.urlFicheEntreprise = "#/customer-dashboard/entreprise/";
    this.urlFicheBeneficiaire = "#/customer-dashboard/particular/";

    this.urlVoirPlusPSM="/see-all/parc-services?typeCustomer=beneficiary";
    this.urlDetailLignePSM='/see-all/parc-services-details/';
    this.voir_plus_coordonnes_entreprise = "#/customer-dashboard/entreprise";
    //----------------------------------titres---------------------------
    this.titreCoordonnesTelephonique = "COORDONNÉES TÉLÉPHONIQUES\n|";
    this.titreCoordonnesElectroniques = "COORDONNÉES ÉLECTRONIQUES\n|";
    this.titreCoordonnesPostale = "COORDONNÉES POSTALES\n|";

    this.titreBonAsavoir = "BON À SAVOIR";

   //--------------------formulaire de modification--------------------------
    this.messageErrorDatePost="La date de naissance ne peut pas être postérieure à la date actuelle";
    this.messageErrorPrenom1="Le champ Prénom ne doit pas contenir de caractères spéciaux ni de chiffre";
    this.messageErrorPrenom2="Ce champ ne doit pas contenir de carctères spéciaux ni de chiffre";
    this.messageErrorNote= "Bon à savoir dépasse le nombre de caractères autorisés";
    this.messageErrorNom1="Le nom est requis";
    this.messageErrorNom2="Ce champ est obligatoire";
    
    this.datePosterrieur="20/03/2050";

    this.messageErrorObligatoireSiren='Ce champ est obligatoire';
    this.messageErrorObligatoireSirenHaut='Le champ SIREN est obligatoire';
  }
}