export const TypeData = {
    CATEGORIE_TPS: 'TPS_CATEGORY',
    PREFIX_NUM_SERIE: 'PREFIX_NUM_SERIE',
    UNITE_OEUVRE: 'UNITE_OEUVRE',
    PRODUCT_LIFE: 'PRODUCT_LIFE'
  };
  
  export const LABEL_SUBSCRIPTION_PERIODICITY = {
    ACTE: "A l'acte",
    MONTHLY: 'Mensuel',
    YEARLY: 'Annuel'
  };

  export const ACQUISITION = {
    ACQUISITION_PRICE: "ACQUISITION_PRICE",
    MARGIN_VALUE: "MARGIN_VALUE",
    MARGIN_RATE: "MARGIN_RATE"
  };

  export const CUSTOMER_TARGET = {
    ANY: {key: "ANY", value: "Tous"},
    MEMBER: {key: "MEMBER", value: "Membre"},
    NOT_MEMBER: {key: "NOT_MEMBER", value:"Non membre"}
  }

  export const PRODUCT_STATUS = {
    ACTIVE: {key: "ACTIVE", value: "Actif"},
    INACTIVE: {key: "INACTIVE", value: "Inactif" }
  }

  export const PRODUCT_BLOCKED = {
    FALSE: {key: "false", value: "non"},
    TRUE: {key: "true", value: "oui"}
  }

  export const TVA = {
    OLD_TVA_NORMALE: {key: "OLD_TVA_NORMALE", value: "19.6"},
    OLD_TVA_REDUITE: {key: "OLD_TVA_REDUITE", value: "5.5"},
    TVA_NORMALE: {key: "TVA_NORMALE", value: "20.0"},
    TVA_REDUITE: {key: "OLD_TVA_NORMALE", value: "7.0"},
    TVA_MOYENNE: {key: "OLD_TVA_NORMALE", value: "10.0"},
    NO_TVA: {key: "NO_TVA", value: "0"}
  }

  export const LIST_INPUTS_MASTER_PRODUCT_REQUIRED = {
    LIBELLE_INTERNE: { name : 'libelleInterne', value: 'Libellé interne'},
    LIBELLE_CLIENT: { name : 'libelleClient', value: 'Libellé client'},
    NOMENCLATURE1: { name : 'nomenClature1', value: 'Nomenclature 1'},
    NOMENCLATURE2: { name : 'nomenClature2', value: 'Nomenclature 2'},
    NOMENCLATURE3: { name : 'nomenClature3', value: 'Nomenclature 3'},
    NOMENCLATURE4: { name : 'nomenClature4', value: 'Nomenclature 4'},
    NOMENCLATURE5: { name : 'nomenClature5', value: 'Nomenclature 5'},
    PARTENAIRE: { name : 'partenaire', value: 'Partenaire'},
    PREFIXE: { name : 'prefixe', value: 'Préfixe'},
    MARGE_PRICE: { name : 'prixAcquisition', value: 'Marge'},
    MARGE_TAUX: { name : 'margeTaux', value: 'Marge'},
    MARGE_VALEUR: { name : 'margeValeur', value: 'Marge'},
    MARGE: { name : 'checkMarge', value: 'Marge'}
  }

  export const INPUTS_NEW_MASTER_PRODUCT_REQUIRED = {
    MARGE_PRICE: { name : 'prixAcq', value: 'Marge'},
    MARGE_TAUX: { name : 'margeV', value: 'Marge'},
    MARGE_VALEUR: { name : 'margeT', value: 'Marge'},
  }

  export const LIST_INPUTS_ADMIN_PRODUCT_REQUIRED = {
    CATEGORIE: {name: 'categorie', value: 'Catégorie'},
    LIBELLE_FACTURE: {name: 'libellefacture', value: 'Libellé facture'},
    LIBELLE_FACTURE_REMISE: {name: 'factureremise', value: 'Libellé facture remise'},
    LIBELLE_FACTURE_GARANTIE: {name: 'libellegarantie', value: 'Libellé facture garantie'}
  }
  export const ERROR_ORANGE_PRODUCT_REFERENCE =  {
    ERROR: "constraint [index_on_orange_product_reference]",
    MESSAGE: "Enregistrement impossible, la référence Orange existe déjà dans la base, veuillez en saisir une nouvelle."
  }
  export const ERROR_MESSAGE_NOT_EXIST_PRODUCT = {
    MESSAGE: "Veuillez ajouter au moins une déclinaison tarifaire pour continuer l'enregistrement"
  }