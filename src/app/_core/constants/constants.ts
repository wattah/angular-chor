export * from './permissions-constants';
export * from './nationalities-constants';

export const LOCAL_ENTREE_CERCLE_PARNASSE = 'Entrée Cercle Parnasse';
export const CONSTANTS = {
  AVATAR_MME: 'assets/images/customer-dashboard/avatar-f.svg',
  AVATAR_M: 'assets/images/customer-dashboard/avatar-h.svg',
  AVATAR_UNKNOWN: 'assets/images/customer-dashboard/avatar-genre.svg',
  AVATAR_ENTREPRISE: 'assets/images/customer-dashboard/avatar-entreprise.svg',
  ROLE_DESK : 4412,
  ROLE_COACH : 5850,
  ROLE_ADHESION : 8521,
  ROLE_VENTE : 8521,
  TYPE_PARTICULAR : 'particular',
  TYPE_BENEFICIARY : 'beneficiary',
  TYPE_COMPANY : 'company',
  ID_REQUEST_RECOUVREMENT : 21,
  ID_REQUEST_HUMEUR_MEMBRE : 61,
  ID_REQUEST_SAV: 23,
  ID_REQUEST_HOME: 34,
  PERSON_CUSTOMER_TITU: 'ref_customer_person_role_type_titulaire',
  PERSON_CUSTOMER_BEN: 'ref_customer_person_role_type_beneficiaire',
  PARNASSE_PLURIEL: 'Parnasse Pluriel',
  PARNASSE_POUR_UN_GROUPE: 'Parnasse pour un groupe',
  PARNASSE_POUR_VOUS: 'Parnasse Pour Vous',
  PARNASSE_POUR_UN_GROUPE_V2:'Parnasse Pour un Groupe V2',
  ACCOUNT_CONSULT_RECC_ACCOUNT: 'Récurrent',
  ACCOUNT_CONSULT_NOT_RECC_ACCOUNT: 'Non récurrent',
  NO_TVA: 'NO_TVA',
  OLD_TVA_NORMALE : 'OLD_TVA_NORMALE',
  OLD_TVA_REDUITE : 'OLD_TVA_REDUITE',
  TVA_NORMALE : 'TVA_NORMALE',
  TVA_MOYENNE : 'TVA_MOYENNE',
  TVA_REDUITE : 'TVA_REDUITE',
  AUCUNE_OFFRE: 'Aucune offre !',
  FORMAT_DATE : 'yyyy-MM-dd',
  OFFRE_AND_SERVICE: 'Offre et service',
  ID_REQUEST_TYPE_SAV_MOBILE: 23,
  CAT_COMPTE_RENDU_INTERVENTION : 12,
  OPTION_ADMIN : 116257,
	OFFER_PLURIEL : 116208,
};

export const DEFAULT_STRING_EMPTY_VALUE = '-';
export const DEFAULT_STRING_EMPTY = '';

export const COLOR_TYPE_CUSTOMER = {
  particular : 'pink',
  beneficiary: 'yellow',
  company    : 'blue'
};

export enum PARCOURS_SIMPLES  {
  ADHESION_KEY = 'request.adhésion_d\'un_client_à_parnasse',
  CHANGE_MOBILE_KEY = 'request.changement_forfait_mobile',
  COMPANY_JUDICIAL_PROC_KEY = 'request.entreprise_en_procédure_judiciaire',
  GESTION_PARNASSE = 'request.gestion_parnasse',
  ABANDONED_EQUIPMENT = 'request.matériel_abandonné',
  INSATISFACTION = 'request.satisfaction',
  HUMEUR = 'request.humeur_membre'
}

export const TASK_STATUS = {
  ASSIGNED: { key: 'ASSIGNED', value: 'Ouverte' },
  DONE: { key: 'DONE', value: 'Clôturée' }
};

export const HISTORY_ACTION = {
  CREATION: { key: 'CREATION', value: 'Création' },
  UPDATE: { key: 'UPDATE', value: 'Modification' }, 
  TRANSFERT: { key: 'TRANSFERT', value: 'Transfert' }, 
  CLOTURE: { key: 'CLOTURE', value: 'Clôture' }
};

export const CURRENT_STATUS = {
  DONE: { key: 'DONE', value: 'Terminée' }
};

export const CURRENT_STATUS_WITH_SPECIEL_CHAR = {
  DONE: { key: 'DONE', value: 'Terminee' }
};

export const ROLE_INTERLOCUTOR = {
  ROLE_BENEFICIARE: { key: 'ref_customer_person_role_type_beneficiaire', value: 'Bénéficiaire' },
  ROLE_TITULAIRE: { key: 'ref_customer_person_role_type_titulaire', value: 'Titulaire' },
  ROLE_DELEGUE: { key: 'ref_customer_person_role_type_delegue', value: 'Délégué(e)' },
  ROLE_RESPONSABLE_SI: { key: 'ref_customer_person_role_type_responsable_si', value: 'Responsable SI' },
  ROLE_ASSISTANT_DIRECTION: { key: 'ref_customer_person_role_type_assistante_de_direction', value: 'Assistant(e) direction' },
  ROLE_RESPONSABLE_FACTURATION: { key: 'ref_customer_person_role_type_responsable_facturation', value: 'Responsable facturation' },
  ROLE_LEGAL_REPRESENTATIVE: { key: 'ref_customer_person_role_type_representant_legal', value: 'Représentant légal' },
  ROLE_ADMINISTRATEUR: { key: 'ref_customer_person_role_type_administrator', value: 'Administrateur' }
};
export const CM_TYPE_DATA = {
  TEL_FIXE: 'TELEPHONES_FIXE',
  TEL_MOBILE: 'TELEPHONES_MOBILE',
  EMAIL: 'ADRESSES_EMAIL',
  POSTAL_ADDRESS: 'ADRESSES_PHYSIQUE',
  FAX: 'FAX'
};

export const TELCO_UNIVERS = {
  TEL_FIXE: 'FIXE',
  TEL_MOBILE: 'MOBILE',
  INTERNET : 'INTERNET'
};

export const CM_MEDIA_REF_KEY = {
  TEL_FIXE: 'ref_contact_method_media_fixe',
  TEL_MOBILE: 'ref_contact_method_media_mobile',
  EMAIL: 'ref_contact_method_media_mail',
  POSTAL_ADDRESS: 'ref_contact_method_media_adresse_postale'
};

export const LANGUAGES = {
  FR: 'Français',
  ENG: 'Anglais',
  RUN: 'Royaume-Uni',
  ITA: 'Italien',
  ASA: 'Arabe',
  RUS: 'Russe' 
};

export const UNIVERS = {
  MOBILE:  { id : 48 , value: 'Mobile' },
  SERVICE: { id: 2408 , value: 'Service' },
  INTERNET: { id: 77 , value: 'Internet' },
  FIXE: { id: 18 , value: 'Fixe' },
  AUTRE: { id: 2407, value: 'Autres' }
}

export const MEDIA = {
  FACE_A_FACE: { id: 161 },
  RENDEZ_VOUS: { id: 3075, reference_data_key: 'ref_customer_interaction_media_rendez-vous'}
};

export const TARGET_TYPE_DOCUMENT = {
  CUSTOMER: 'CUSTOMER',
  REQUEST: 'REQUEST'
};

export const CATEGORY_MESSAGE_TYPE = {
  MAIL: 'MAIL',
  SMS: 'SMS'
}

export const TYPE_REQUEST = {
  GESTION_PARNASSE: { id: 5, value: 'request.gestion_parnasse'}
}

export const KeyWords = {
  LIST_MAIL: '[#List_contact_mail]',
  LIST_MOBILE: '[#List_contact_mobile]',
  LIST_PHONE: '[#List_contact_phone]',
  LIST_FAX: '[#List_contact_fax]',
  LIST_POSTAL_ADRESSE: '[#List_contact_postal]',
  LIST_PARC_TELCO: '[#List_parc_telco]'
}

export const INVOISE_STATUS = {
  TO_GET:  { key : 'CHORNICHE_A_RECUPERER' , label: 'À récupérer' },
  TO_CHECK: { key: 'CHORNICHE_A_VERIFIER' , label: 'À vérifier' },
  TO_SEND: { key: 'CHORNICHE_A_ENVOYER_MANUEL' , label: 'À envoyer manuellement' }
};

export const CONTRAT_STATUTS = {
  PROSPECT: { key: 'PROSPECT', label: 'Prospect'},
  ACTIVE :  { key: 'ACTIVE', label: 'Actif'},
  CONTACT : { key: 'CONTACT' , label: 'Contact'},
  INACTIVE: {key : 'INACTIVE', label : 'Résilié'}
}

export const JOUR_FERIE = {
  FETE_TRAVAIL : '01-04' ,
  VICTOIRE_1945 : '08-04' ,
  FETE_Nationale :'14-06' ,
  ASSOMPTION : '15-07' ,
  TOUSSAINT : '01-10' ,
  ARMISTICE : '11-10' ,
  NOEL : '25-11' ,
  JOUR_AN : '01-00',
  JOUR_DIMANCHE : 0 ,
  JOUR_SAMEDI : 6
}

export const PARK_RENEWAL_CLASSIFICATION = {
  RENEWAL_CLASSIFICATION_TYPE_MIN : 2,
  RENEWAL_CLASSIFICATION_TYPE_MAX : 3,
  RENEWAL_CLASSIFICATION_TYPE_2 : 'Mobile Annuel',
  RENEWAL_CLASSIFICATION_TYPE_3 : 'Mobile Annuel Exclusif Monde'
};


export const PARK_OFFER_STATUS = {
  UNKNOWN: { Ordinal: 0, label: 'Inconnu' },
  ACTIVE: { Ordinal: 1, label: 'Actif' },
  INACTIVE: { Ordinal: 2, label: 'Résilié' }
}

export const CSS_CLASS_NAME = {
  CELL_WRAP_TEXT : 'cell-wrap-text',
  TEXT_CENTER : 'text-center',
  TEXT_RIGHT: 'text-right',
  UNSELECTABLE : 'unselectable',
  BORDER_RIGHT:'border-right',
  BORDER_LEFT:'border-left',
};

export const TASK_STATUS_WITH_ALL_SUB_CATEGORIES = [
  { data: "", label: 'Tous'},
  { data: "ASSIGNED", label: 'Assignée', isAssigned: true},
  { data: "IN_TIME", label: 'Assignée dans délais', isAssigned: true},
  { data: "OUT_OF_TIME", label: 'Assignée hors délais', isAssigned: true},
  { data: "DONE", label: 'Clôturée', isAssigned: false},
  { data: "IN_TIME", label: 'Clôturée dans délais', isAssigned: false},
  { data: "OUT_OF_TIME", label: 'Clôturée hors délais', isAssigned: false},
  { data: "CANCELLED", label: 'Annulée', isAssigned: false}
];

export const CART_STATUS = [
  { data: null, label: 'Tous', icone: ""},
  { data: "GREY", label: 'Le panier n\'utilise pas d\'envoi publidispatch ou l\'ordre a été annulée abondonnée ou pas encore créé', icone: "cart-grey-normal"},
  { data: "YELLOW", label: 'La commande a été créée et elle n\'est pas encore prise en compte par Publidispatch', icone: "cart-yellow-normal"},
  { data: "YELLOW2", label: 'La commande a été créée et elle n\'est pas encore prise en compte par WinGSM', icone: "panier-yellow-parnasse"},
  { data: "PINK", label: 'La commande a été prise par Publidispatch', icone: "cart-purple-normal"},
  { data: "PINK2", label: 'La commande a été prise par WinGSM', icone: "cart-purple-parnasse"},
  { data: "ORANGE", label: 'La commande a été rejetée, ou partiellement expédiée mais des numéros de série n\'ont pas été saisis ou ne sont pas gérés par Publidispatch', 
      icone: "cart-orange-normal"},
  { data: "ORANGE2", label: 'La commande a été rejetée, expédiée partiellement ou expédiée mais des numéros de série n\'ont pas été saisis par WinGSM', 
      icone: "cart-orange-parnasse"},
  { data: "GREEN", label: 'La commande est en cours de livraison ou a été expédiée avec tous les numéros de série saisis', icone: "cart-green-normal"},
  { data: "GREEN2", label: 'La commande utilise le stock Parnasse et le matériel a été mis à disposition par la logistique', icone: "cart-green-parnasse"},
  { data: "BLUE", label: 'La commande a été livrée au client', icone: "cart-blue-normal"},
  { data: "BLUE2", label: 'La commande utilise le stock Parnasse et elle a été livrée', icone: "cart-blue-parnasse"},
  { data: "RED", label: 'La commande a été retournée par le livreur', icone: "cart-red-normal"},
  { data: "RED2", label: 'La commande a été retournée par le livreur pour un stock différent de Publidispatch', icone: "cart-red-parnasse"},
  { data: "WARNING", label: 'La commande est une erreur ou a été envoyée à Publidispatch il y a plus de 24h avec aucun retour de leur part', icone: "cart-grey-error"}
];

export const CART_STATUS_MONITORING = [
  {data: null, label: 'Tous', icone: ""},
  {data: "GREY", label: "Pas d'ordre envoyé", icone: "cart-grey-normal"},
  {data: "PINK", label: 'Ordre pris en compte', icone: "cart-purple-normal"},
  {data: "YELLOW", label: 'Ordre envoyé', icone: "cart-yellow-normal"},
  {data: "ORANGE", label: 'Expédition OK, à vérifier', icone: "cart-orange-normal"},
  {data: "GREEN", label: 'Expédition OK', icone: "cart-green-normal"},
  {data: "BLUE", label: 'Livraison OK', icone: "cart-blue-normal"},
  {data: "RED", label: 'Livraison KO', icone: "cart-red-normal"},
  {data: "WARNING", label: 'Warning', icone: "cart-grey-error"}
];

export const REQUEST_TASK_STATUS = {
  TOUS : { key: null, label: 'Tous', isPending : false },
  PENDING : { key: 'PENDING', label: 'Ouverte', isPending : false },
  PENDING_NO_TASK : { key: 'WITHOUT_TASKS', label: 'Ouverte - sans tâche', isPending : true },
  PENDING_WITH_TASK : { key: 'WITH_TASKS', label: 'Ouverte - avec tâche', isPending : true },
  PENDING_WITH_LATE_TASK : { key: 'WITH_LATE_TASKS', label: 'Ouverte - avec tâche en retard', isPending : true },
  CLOSED : { key: 'CLOSED', label: 'Close', isPending : false }
};

export const CODE_CONTRAT_PARK_ITEM = {
  CODE_CONTRACT_5HD18: '5HD18',
  CODE_CONTRACT_5HD16: '5HD16',
  CODE_CONTRACT_5HD17: '5HD17',
  CODE_CONTRACT_5HD19: '5HD19',
  CODE_CONTRACT_5HD20: '5HD20'
}

export const SERVICE_AND_MATERIEL = {
  STATUS:[
    {key: 'ACTIF' , value: 'Actif'},
    {key: 'RESILIE' , value: 'Résilié'},
    {key: 'SUSPENDU' , value: 'Suspendu'},
    {key: 'ORANGE_VIP' , value: 'Orange VIP'},
    {key: 'HORS_CONTRAT' , value: 'Hors contrat'},
    {key: 'ORANGE_BY_PARNASSE' , value: 'Orange by Parnasse'}
  ]
}

export const NICHE_CONTRACTS_STATUTS = {
  STATUS:[
    {key: 'ACTIF' , value: 'Actif'},
    {key: 'EN_CREATION' , value: 'EN COURS DE CREATION'},
    {key: 'ORANGE' , value: 'Orange'},
    {key: 'ORANGE_BY_PARNASSE' , value: 'Orange by Parnasse'},
    {key: 'ORANGE_VIP' , value: 'Orange VIP'},
    {key: 'SUSPENDU' , value: 'suspendu'},
    {key: 'ORANGE_PRO' , value: 'Orange pro'}
  ]
}

export const ORDER_STATUS = {
  CREATED:'Créé',
  CANCELED:'Annulé',
  ORDERED:'Commandé',
  SENT:'Expédié',
  PARTIAL_SENT:'Partiellement expédié',
  REJECTED:'Rejeté',
  CONFIRMED:'En charge',
  ON_TOUR:'En tourné',
  PARTIAL_ON_TOUR:'Partiellement en tourné',
  DELIVERED:'Livré',
  PARTIAL_DELIVERED:'Partiellement livré',
  RETURNED:'Retourné',
  ERROR:'Anomalie',
  WARNING:'Avertissement',
  ABANDONED:'Abandonné',
  RESTORED:'Réintégré'
}

export const TYPE_CM_INTERLOCUTOR = {
    PRINCIPAL: { key: 'ref_contact_method_type_principal', value: 'Principal' },
    SECONDAIRE: { key: 'ref_contact_method_type_secondaire', value: 'Secondaire' },
    PROFESSIONNEL: { key: 'ref_contact_method_type_professionnel', value: 'Professionnel' },
    TEMPORAIRE: { key: 'ref_contact_method_type_temporaire', value: 'Temporaire' }
};

export const CM_MEDIA_REF = {
    TEL_FIXE: 'ref_contact_method_media_fixe',
    TEL_MOBILE: 'ref_contact_method_media_mobile',
    EMAIL: 'ref_contact_method_media_mail',
    POSTAL_ADDRESS: 'ref_contact_method_media_adresse_postale'
};

export const WEB_CONSTANT = {
  WEBSERVICE_AS_METIER: 2,
  WEBSERVICE_DRAKKAR: 1,
  WEBSERVICE_FACADE: 3,
  WEBSERVICE_UNKNOWN: 0
};



export const CM_USAGE = {
  DEFAULT: { key: 'ref_contact_method_usage_par_defaut', label: 'Par défaut' },
  EVENT: { key: 'ref_contact_method_usage_evenementiel', label: 'Événementiel' },
  DIRECT_MARKETING: { key: 'ref_contact_method_usage_marketing_direct', label: 'Marketing direct' },
  BILLING: { key: 'ref_contact_method_usage_facturation', label: 'Facturation' },
  CONTRACTUAL_INFO: { key: 'ref_contact_method_usage_informations_contractuelles', label: 'Infos contractuelles / légales' }
};

export const PERSON_CATEGORY = {
  PHYSIQUE: 'ref_categoy_person_physique',
  MORALE: 'ref_categoy_person_morale',
  SERVICE: 'ref_categoy_person_service'
};

export const TVA = {
  NO_TVA: 'NO_TVA',
  OLD_TVA_NORMALE: 'OLD_TVA_NORMALE',
  OLD_TVA_REDUITE: 'OLD_TVA_REDUITE',
  TVA_NORMALE: 'TVA_NORMALE',
  TVA_MOYENNE: 'TVA_MOYENNE',
  TVA_REDUITE: 'TVA_REDUITE'
};

// The constant LIST_UPDATED_OF_WORKFLOW_WITH_CART has the last version of workflow with cart
export const PANIER_PARCOURS = [
  'Assurance Karapass (date sinistre à partir du 1 juil. 2019)',
  'Assurance SPB (date sinistre avant le 1 juil. 2019)',
  'Renouvellement annuel',
  'Achat - Simple',
  'Achat - Prestation',
  'Achat - Abonnement solution sécurité',
  LOCAL_ENTREE_CERCLE_PARNASSE,
  'cooptation',
  'SAV Home',
  'Assistance SAV mobile'
  ];

  export const LIST_UPDATED_OF_WORKFLOW_WITH_CART = [
    'Assurance Karapass (date sinistre à partir du 1 juil. 2019)',
    'Renouvellement annuel',
    'Achat - Simple',
    'Achat - Prestation',
    LOCAL_ENTREE_CERCLE_PARNASSE,
    'cooptation',
    'SAV Home',
    'Assistance SAV mobile'
    ];

export const DOCUMENTS_EXTENSIONS = {
  'pdf': 'pdf',
  'doc': 'doc',
  'docx': 'doc',
  'png': 'png',
  'jpg': 'jpg',
  'ppt': 'ppt',
  'xls': 'xls',
  'txt': 'txt',
  'zip': 'zip',
  'default': 'other'
};

/* iso chorniche */
export const PENICHE_PAYMENT_TYPE = {
  PRELEVEMENT: 'PRELEVEMENT',
  VIREMENT: 'VIREMENT',
  CHEQUE: 'CHEQUE',
  CB: 'CB',
  AMEX: 'AMEX',
  AMEXREC: 'AMEXREC',
  CBREC: 'CBREC',
  PRELEVEMENT_AMEX: 'PRELEVEMENT_AMEX',
  PRELEVEMENT_CB: 'PRELEVEMENT_CB',
  INFO_BANK_SEPA_PRELEVMENT: 'Prélèvement sur le compte terminant par *******',
  INFO_BANK_CB_PRELEVMENT: 'Prélèvement sur la carte terminant par *******',
  INFO_BANK_AMEX_PRELEVMENT: 'Prélèvement sur l\'AMEX terminant par *******'
};

// we use this in homologation (homologation_item_mobile => prelevement)
export const PRELEVEMENT_PENICHE_TYPES = {
  'PRELEVEMENT' : 'Prélèvement SEPA',
  'CHEQUE' : 'Chèque',
  'VIREMENT' : 'Virement',
  'CB' : 'Carte bancaire',
  'AMEX' : 'American Express',
  'AMEXREC' : 'Prélèvement AMEX',
  'CBREC' : 'Prélèvement CB'
};

export const REF_FAVORITE_LANGUAGE = {
  FRENCH: 'ref_favorite_language_french',
  ENGLISH: 'ref_favorite_language_english',
  ITALIE : 'ref_favorite_language_Italy',
  ARABIC : 'ref_favorite_language_arab',
  RUSSE : 'ref_favorite_language_russian'
 }

 export const REF_COUNTRY_KEY = {
  FRENCH: 'ref_country_fr'
 }

export const CUSTOMER_OFFER = {
  PLURIEL_PARNASSE_ID: 116208
};

export const ApprovalDocumentType = {
  CONTRACT_DOCUMENT :"CONTRACT",
  SUPPORTING_DOCUMENT :"SUPPORTING_DOCUMENT",
  PRODUCTION_DOCUMENT :"PRODUCTION",
  PROPOSITION_COMMERCIALE :"PROPOSITION_COMMERCIALE"
}

export const DOCUMENTS_CONTRACTUEL = {
  CON: 'Contrat',
  AUTBLOC: 'Autorisation Blocage',
  AMEX: 'AMEX bénéficiaire',
  SEPA: 'SEPA bénéficiaire',
  SEPA_MOBILE: 'SEPA mobile',
  SEPA_FIBRE: 'SEPA fibre',
  CED: 'Cession de ligne',
  ATTESTTP: 'Attestation Tiers Payeur',
  AMEXTP: 'AMEX Tiers Payeur',
  SEPATP: 'SEPA Tiers Payeur',
  AMEXMOBILETP: 'AMEX mobile Tiers Payeur',
  SEPAMOBILETP: 'SEPA mobile Tiers Payeur',
  SEPAFIBLETP: 'SEPA fibre Tiers Payeur',
  AMEXFIBRETP:'AMEX fibre Tiers Payeur',
};

export const PIECES_JUSTIFICATIVES = {
  CHANN: 'Chaque annulé payeur',
  PIP:'Pièce d\'identité particulier',
  PIB: 'Pièce d\'identité bénéficiaire',
  PIRL: 'Pièce d\'identité représentant lègal titulaire',
  PITP: 'Pièce d\'identité tiers payeur',
  PIDS: 'Pièce d\'identité du délégué signature',
  PIDD: 'Pièce d\'identité du délégué autorisé à  appeler le desk',
  PIDC: 'Pièce d\'identité du titulaire cédant',
  KBIST:'KBIS titulaire',
  KBISTP: 'KBIS tiers payeur',
  FRMDS: 'Formulaire de délégation de signature',
  FRDR: 'Formulaire de renoncement au délai de rétractation',
  RIB: 'RIB payeur'
};

export const REF_HOMOLOGATION_STATUT = {
  HOMOLOGUE: { key: 'ref_homologation_homologation_status', label: 'Homologué' },
  PREHOMOLOGUE: { key: 'ref_homologation_pre_homologation_status', label: 'Pré-homologué' }
}



export const PENICHE_CUSTOMER_TYPOLOGY = {
  PARTICULIER: { key: 'PARTICULIER', value: 'Particulier' },
  ENTREPRISE: { key: 'ENTREPRISE', value: 'Entreprise' }
};


export const STATUS_CUSTOMER = {
  STATUS_CONTACT_ID: {id: 3, value: 'Contact'},
  STATUS_PROSPECT_ID: {id: 0, value: 'Prospect'},
  STATUS_CLIENT_ACTIF_ID: {id: 1, value: 'Membre actif'},
  STATUS_CLIENT_INACTIF_ID: {id: 2, value: 'Membre Résilié'},
  STATUS_ALL_ID: {id: 4, value: 'Tous'}
}

export const CONSTANTLABEL = {
  DOSSIER_NON_SERVICE: 'DOSSIER_NON_SERVICE',
  DOSSIER_SERVICE: 'DOSSIER_SERVICE',
  DOSSIER_SUSPENDU: 'DOSSIER_SUSPENDU',
  DOSSIER_RESILIE: 'DOSSIER_RESILIE',
  DOSSIER_CLOS: 'DOSSIER_CLOS',
  DOSSIER_MIGRE: 'DOSSIER_MIGRE',
  DOSSIER_CLOS_MIGRE : 'DOSSIER_CLOS_MIGRE',
  DOSSIER_REATTRIBUE : 'DOSSIER_REATTRIBUE',
  DOSSIER_DOUBLON_SUPPRIME : 'DOSSIER_DOUBLON_SUPPRIME',
  PORTABILITE_SORTANTE: 'PORTABILITE_SORTANTE',
  PORTABILITE_ENTRANTE: 'PORTABILITE_ENTRANTE',
  PORTE_SORTANT_SUSPENDU: 'PORTE_SORTANT_SUSPENDU',
  INCONNU:'INCONNU'

}

export const FacadeStatus ={

  INITIALISED : 'INITIALISED',
  INCONNU : 'INCONNU'
}
export const DrakkarStatus ={
 ACTIF : 'ACTIF',
 INACTIF : 'INACTIF',
 INCONNU : 'INCONNU'
}

     export const INTERNET ={
   INITIALISED : 'INITIALISED',
	 CANCELLED :  "CANCELLED",
   IN_ORDER :  "IN_ORDER",
	 SUSPENDED:  "SUSPENDED",
	 REMOVED  :"REMOVED",
	 SOLD_DISCONNECTED :  "SOLD_DISCONNECTED",
	 SOLD :  "SOLD",
	 INCONNU :  "INCONNU"

     }
export function getLabelByEnum(enumName : string) : string {
  const DOSSIER_IN_SERVICE ='Dossier en service';
  let label = '';
  switch (enumName) {
    case CONSTANTLABEL.DOSSIER_NON_SERVICE: label = 'Dossier non en service'; 
    break;
    case CONSTANTLABEL.DOSSIER_SERVICE: label = DOSSIER_IN_SERVICE ;
    break;
    case CONSTANTLABEL.DOSSIER_SUSPENDU: label = 'Dossier suspendu' ; 
    break;
    case CONSTANTLABEL.DOSSIER_RESILIE: label = 'Dossier résilié'; 
    break;
    case CONSTANTLABEL.DOSSIER_CLOS: label = 'Dossier migré autre système'; 
    break;
    case CONSTANTLABEL.DOSSIER_MIGRE: label = 'Dossier clos migré'; 
    break;
    case CONSTANTLABEL.DOSSIER_CLOS_MIGRE: label = 'Dossier susp. réattribué'; 
    break;
    case CONSTANTLABEL.DOSSIER_REATTRIBUE: label = 'Dossier doublon supprimé'; 
    break;
    case CONSTANTLABEL.DOSSIER_DOUBLON_SUPPRIME: label = 'Portabilité sortante'; 
    break;
    case CONSTANTLABEL.PORTABILITE_SORTANTE: label = 'Portabilité entrante'; 
    break;
    case CONSTANTLABEL.PORTE_SORTANT_SUSPENDU: label = 'Porté sortant – suspendu'; 
    break;
    case CONSTANTLABEL.INCONNU: label = 'Inconnu'; 
    break;
    case DrakkarStatus.ACTIF : label = DOSSIER_IN_SERVICE; 
    break;
    case DrakkarStatus.INACTIF : label = 'Dossier non en service'; 
    break;
    case DrakkarStatus.INCONNU : label = 'Inconnu'; 
    break;
    case INTERNET.INITIALISED : label ='Dossier en cours de création'; 
    break;
    case INTERNET.CANCELLED : label ='Dossier résilié '; 
    break;
    case INTERNET.IN_ORDER : label = DOSSIER_IN_SERVICE;
    break;
    case INTERNET.SUSPENDED : label ='Dossier suspendu' ; 
    break;
    case INTERNET.REMOVED : label ='Dossier clo' ; 
    break;
    case INTERNET.SOLD_DISCONNECTED : label ='Dossier vendu' ; 
    break;
    default:
      return '';
  }
  
  return label;
}

export const WELCOME_MAIL = {
  REQUEST_TYPE_LABEL : LOCAL_ENTREE_CERCLE_PARNASSE,
  TASK_NAME: 'Prendre RDV d\'entrée'
};

export const SAV = {
  REQUEST_TYPE_LABEL : 'Assistance SAV mobile',
  TASK_NAME_ONE: 'Qualifier la demande, assister le client en niveau 1',
  TASK_NAME_TWO: 'Assister, faire un diagnostic, informer le client sur la prise en charge SAV',
  TASK_NAME_THREE: 'Assister le client, faire un pré-diagnostic SAV',
  TASK_NAME_FOUR: 'Assister le client, faire un diagnostic SAV'
};

export const FACTURE_VERIFIER = {
  REQUEST_TYPE_LABEL : 'Facture à vérifier',
  TASK_NAME: 'Vérifier la facture',
  TASK_NAME_TWO: 'Contrôler la facture avant son émission',
  TASK_NAME_THREE: 'Ouvrir et dérouler une demande "Humeur Membre"',
  TASK_NAME_FOUR: 'Relooker la facture',
  TASK_NAME_FIVE: 'Corriger la facture'
};

export const ENTREE_CERCLE_PARNASSE = {
  REQUEST_TYPE_LABEL : 'Entrée Cercle Parnasse',
  TASK_NAME: 'Prendre RDV d\'entrée',
  TASK_NAME_VALIDATION: 'Valider le dossier d\'homologation',
  TASK_CR_ENTRY: 'Réaliser RDV d\'entrée'
};

export const RECOUVREMENT = {
  REQUEST_TYPE_LABEL : 'Recouvrement',
  TASK_NAME_ENVOI_SMS: 'Envoyer le SMS de suspension des lignes',
  TASK_NAME_SUSPENSION_LIGNES: 'Suspendre les lignes'
};

export const MANUAL_TASK = 'manual_task';

export const RESOLUTION_TASK_STATUS = {
  OK : { key: 'OK', label: 'OK'},
  KO : { key: 'KO', label: 'KO'},
  CANCEL : { key: 'CANCEL', label: 'Annulée'}
};

export const RESOLUTION_REQUEST_STATUS = {
  OK : { key: 'OK', label: 'OK'},
  KO : { key: 'KO', label: 'KO'},
  CANCELLED : { key: 'CANCELLED', label: 'Annulée'}
};

export const SEGMENT = {
  GRAND_VOYAGEUR : 'Grand voyageur',
  SEDENTAIRE: 'Sédentaire',
  SEDENTAIRE_PRO: 'Sédentaire pro',
  COMEX_GROUPE: 'Comex groupe',
  PROVINCE: 'Province',
  INACCESSIBLE: 'Inaccessible',
  A_DEFINIR: 'A définir ',
};

export const STATUT_LIVRABLE = {
  ORIGINAL_ABSENT: 'ORIGINAL_ABSENT',
  ORIGINAL_PRESENT: 'ORIGINAL_PRESENT',
  DONNEES_STOCKEES: 'DONNEES_STOCKEES',
  GENERE:'GENERE',
  GENERE_WARNING: 'GENERE_WARNING',
  GENERE_ERREUR: 'GENERE_ERREUR',
  CR_COMPLET: 'CR_COMPLET',
  SUPPRIME: 'SUPPRIME',
  NON_GENERABLE: 'NON_GENERABLE',
  GENERABLE_PARTIEL: 'GENERABLE_PARTIEL',
  GENERABLE_COMPLET: 'GENERABLE_COMPLET',
  GENERE_PARTIEL_OK: 'GENERE_PARTIEL_OK',
  CR_INCOMPLET: 'CR_INCOMPLET', 
  GENERE_COMPLET_OK:'GENERE_COMPLET_OK', 
  GENERE_PARTIEL_WARNING: 'GENERE_PARTIEL_WARNING', 
  GENERE_COMPLET_WARNING: 'GENERE_COMPLET_WARNING',
  GENERE_PARTIEL_ERREUR: 'GENERE_PARTIEL_ERREUR',
  GENERE_COMPLET_ERREUR: 'GENERE_COMPLET_ERREUR', 
  FICHIER_RELOOKE_MANUELLEMENT: 'FICHIER_RELOOKE_MANUELLEMENT'
};

export const SousEtatLivrable = {
  FOND_A_VALIDER_METIER:'FOND_A_VALIDER_METIER', 
  FOND_INVALIDE_METIER_ATTENTE_CORRECTION:'FOND_INVALIDE_METIER_ATTENTE_CORRECTION',
  FORME_A_VALIDER_METIER: 'FORME_A_VALIDER_METIER', 
  FORME_INVALIDE_METIER_ATTENTE_CORRECTION: 'FORME_INVALIDE_METIER_ATTENTE_CORRECTION',
  FORME_INVALIDE_METIER_CORRIGE: 'FORME_INVALIDE_METIER_CORRIGE',
  FOND_INVALIDE_METIER_CORRIGE: 'FOND_INVALIDE_METIER_CORRIGE',
  FORME_VALIDE_METIER: 'FORME_VALIDE_METIER', 
  FORME_VALIDE_SI: 'FORME_VALIDE_SI',
  ARCHIVE: 'ARCHIVE',
  A_ENVOYER: 'A_ENVOYER',
  ENVOYE: 'ENVOYE',
  FOND_VALIDE_SI: 'FOND_VALIDE_SI',
  EN_RETARD:'EN_RETARD',
	EN_ATTENTE:'EN_ATTENTE'
}

export const SOUS_ETAT_LIVRABLE_MESSAGE = {
  FOND_A_VALIDER_METIER: {ETAT:'FOND_A_VALIDER_METIER' , MESSAGE:'A vérifier par le desk'}, 
  FOND_INVALIDE_METIER_ATTENTE_CORRECTION:{ETAT:'FOND_INVALIDE_METIER_ATTENTE_CORRECTION' , MESSAGE:'A corriger par le desk'},
  FORME_A_VALIDER_METIER: {ETAT:'FORME_A_VALIDER_METIER' , MESSAGE:'A vérifier par le facturier'}, 
  FORME_INVALIDE_METIER_ATTENTE_CORRECTION: {ETAT:'FORME_INVALIDE_METIER_ATTENTE_CORRECTION' , MESSAGE:'A corriger par le facturier'},
  FORME_INVALIDE_METIER_CORRIGE: {ETAT:'FORME_INVALIDE_METIER_CORRIGE' , MESSAGE:'Correction validée par le facturier'},
  FOND_INVALIDE_METIER_CORRIGE: {ETAT:'FOND_INVALIDE_METIER_CORRIGE' , MESSAGE:'Correction validée par le desk'},
  FORME_VALIDE_METIER: {ETAT:'FORME_VALIDE_METIER' , MESSAGE:'Vérifiée par le facturier'}, 
  FORME_VALIDE_SI: {ETAT:'FORME_VALIDE_SI' , MESSAGE:'Forme vérifiée automatiquement'},
  ARCHIVE: {ETAT:'ARCHIVE' , MESSAGE:'Archivée'},
  A_ENVOYER: {ETAT:'A_ENVOYER' , MESSAGE:'Archivée,à envoyer'},
  ENVOYE: {ETAT:'ENVOYE' , MESSAGE:'Archivée,envoyée'},
  FOND_VALIDE_SI: {ETAT:'FOND_VALIDE_SI' , MESSAGE:'Fond vérifié automatiquement'},
  EN_RETARD:{ETAT:'EN_RETARD' , MESSAGE:'Cette facture est absente de la base.'},
	EN_ATTENTE:{ETAT:'EN_ATTENTE' , MESSAGE:'Cette facture est absente de la base.'}
}

export const MESSAGE_STATUS = {
  ORIGINAL_ABSENT: {STATUS:'ORIGINAL_ABSENT', MESSAGE:'Cette facture est absente de la base.'},
  ORIGINAL_PRESENT: {STATUS:'ORIGINAL_PRESENT', MESSAGE:''},
  DONNEES_STOCKEES: {STATUS:'DONNEES_STOCKEES', MESSAGE:'La facture d\'origine a bien été chargée en base.'},
  GENERE:{STATUS:'GENERE', MESSAGE:'Cette facture a été générée correctement.'},
  GENERE_WARNING: {STATUS:'GENERE_WARNING', MESSAGE:'Cette facture a été générée avec des erreurs mineures.'},
  GENERE_ERREUR: {STATUS:'GENERE_ERREUR', MESSAGE:'Cette facture a été générée avec des erreurs.'},
  CR_COMPLET: {STATUS:'CR_COMPLET', MESSAGE:''},
  SUPPRIME: {STATUS:'SUPPRIME', MESSAGE:''},
  NON_GENERABLE: {STATUS:'NON_GENERABLE', MESSAGE:'Cette facture a été générée avec des erreurs mineures.'},
  GENERABLE_PARTIEL: {STATUS:'GENERABLE_PARTIEL', MESSAGE:''},
  GENERABLE_COMPLET: {STATUS:'GENERABLE_COMPLET', MESSAGE:''},
  GENERE_PARTIEL_OK: {STATUS:'GENERE_PARTIEL_OK', MESSAGE:''},
  CR_INCOMPLET: {STATUS:'CR_INCOMPLET', MESSAGE:''}, 
  GENERE_COMPLET_OK: {STATUS:'GENERE_COMPLET_OK', MESSAGE:''}, 
  GENERE_PARTIEL_WARNING: {STATUS:'GENERE_PARTIEL_WARNING', MESSAGE:''}, 
  GENERE_COMPLET_WARNING: {STATUS:'GENERE_COMPLET_WARNING', MESSAGE:''},
  GENERE_PARTIEL_ERREUR: {STATUS:'GENERE_PARTIEL_ERREUR', MESSAGE:''},
  GENERE_COMPLET_ERREUR: {STATUS:'GENERE_COMPLET_ERREUR', MESSAGE:''}, 
  FICHIER_RELOOKE_MANUELLEMENT: {STATUS:'FICHIER_RELOOKE_MANUELLEMENT', MESSAGE:'Cette facture a été relookée manuellement. Afin de restaurer la facture d\'origine, il faut supprimer la facture chargée puis réimporter et relooker la facture d\'origine.'}
}

export const STATUS_ICONE_CLASS = {
  ETAT_RED:'etat-red',
  ETAT_GREEN:'etat-green',
  STATUS_RENEWAL_DONE:'status-renewal-done',
  PICTO_EXCLAMATION_ROUGE:'picto-exclamation-rouge',
  PICTO_EXCLAMATION_ORANGE:'picto-exclamation-orange',
  ETAT_RELOOKING:'etat-relooking'
}

export const SOUS_ETAT_ICONE_CLASS = {
  ROUND_BLUE:'rond-blue',
  ROUND_ORANGE:'rond-orange',
  ROUND_RED:'rond-red',
  ROUND_GREEN_LIGHT:'rond-green-light',
  ROUND_GREEN:'rond-green',
}
export const UNIVERS_PENICHE = {
  MOBILE:  { id : 1 , label: 'Mobile', code: 'MOBILE' },
  SERVICE: { id: 2 , label: 'Service', code: 'SERVICE' },
  INTERNET: { id: 4 , label: 'Internet', code: 'INTERNET' },
  FIXE: { id: 3 , label: 'Fixe', code: 'FIXE' }
}

export const ETAT_FACTURE = {
 TOUS: {cle: 'ALL', icon: 'mr-4', label: 'Tous'},
 FACTURE_UPLOADE: {cle: 'INVOICE_UPLOADE', icon: 'icon etat-green mr-1', label: 'Facture uploadée'},
 FACTURE_ABSENTE: {cle: 'INVOICE_ABSENTE', icon: 'icon etat-red mr-1', label: 'Facture absente'},
 GENEREE_SANS_ERREUR: {cle: 'GENEREE_SANS_ERROR', icon: 'icon status-renewal-done mr-1', label: 'Générée sans erreurs'},
 GENEREE_AVEC_ERREUR: { cle: 'GENERATED_WITH_ERROR', icon: 'icon picto-exclamation-rouge mr-1', label: 'Générée avec erreurs'},
 GENEREE_AVEC_ERREUR_MINEUR: {cle: 'GENERATED_WITH_MINOR_ERROR', icon: 'icon picto-exclamation-orange mr-1', label: 'Générée avec erreurs mineures'},
 RELOOKEE_MANUELLEMENT: {cle: 'MANUALLY_RELOOKEED', icon: 'icon etat-relooking mr-1', label: 'Relookée manuellement'}
}

export const STATUS_FACTURE = {
  TOUS: { cle: 'ALL', icon: 'mr-4', label: 'Tous'},
  FACTURE_A_VERIFIE: { cle: 'TO_CHECK', icon: 'icon rond-blue mr-1', label: 'Facture à vérifier'},
  CORRECTION_VALIDE: { cle: 'CORRECTION_VALIDATED', icon: 'icon rond-orange mr-1', label: 'Correction validée' },
  FACTURE_CORRIGER: { cle: 'TO_CORRECT', icon: 'icon rond-red mr-1', label:'Facture à corriger' },
  FACTURE_VERIFIER: { cle: 'VERIFIED', icon: 'icon rond-green-light mr-1', label: 'Facture vérifiée' },
  FACTURE_ARCHIVEE: { cle: 'ARCHIVED', icon: 'icon rond-green mr-1', label: 'Facture archivée'},
}

export const STATUS_CART = {
  PENDING:'PENDING',
  AWAITING_APPROVAL:'AWAITING_APPROVAL',
  VALIDATE:'VALIDATE',
  ESTIMATE_SENT:'ESTIMATE_SENT',
  READY_DELIVER:'READY_DELIVER',
  DELIVERED:'DELIVERED',
  ABANDON:'ABANDON'
}

export const CUSTOMER_TYPE_LABEL = {
  ENTERPRISE : 'Entreprise',
  BENEFICIARY: 'Bénéficiaire',
  PARTICULAR: 'Particulier'
};

export const SHORT_DAYS_OF_WEEK = [ 'dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.' ];
export const TYPE_BIll = {
  FACTURE: 'FACTURE',
  CR:'CR'
}

export const ARCHIVABLE_STATUT_LIVRABLE = {
  ORIGINAL_ABSENT: {ARCHIVABLE: false , VALUE:'ORIGINAL_ABSENT'},
  ORIGINAL_PRESENT: {ARCHIVABLE: false , VALUE:'ORIGINAL_PRESENT'},
  DONNEES_STOCKEES: {ARCHIVABLE: false , VALUE:'DONNEES_STOCKEES'},
  GENERE: {ARCHIVABLE: true , VALUE:'GENERE'},
  GENERE_WARNING: {ARCHIVABLE: true , VALUE:'GENERE_WARNING'},
  GENERE_ERREUR: {ARCHIVABLE: true , VALUE:'GENERE_ERREUR'},
  CR_COMPLET: {ARCHIVABLE: false , VALUE:'CR_COMPLET'},
  SUPPRIME: {ARCHIVABLE: false , VALUE:'SUPPRIME'},
  NON_GENERABLE: {ARCHIVABLE: false , VALUE:'NON_GENERABLE'},
  GENERABLE_PARTIEL: {ARCHIVABLE: false , VALUE:'GENERABLE_PARTIEL'},
  GENERABLE_COMPLET: {ARCHIVABLE: false , VALUE:'GENERABLE_COMPLET'},
  GENERE_PARTIEL_OK: {ARCHIVABLE: true , VALUE:'GENERE_PARTIEL_OK'},
  CR_INCOMPLET: {ARCHIVABLE: false , VALUE:'CR_INCOMPLET'}, 
  GENERE_COMPLET_OK: {ARCHIVABLE: true , VALUE:'GENERE_COMPLET_OK'}, 
  GENERE_PARTIEL_WARNING: {ARCHIVABLE: true , VALUE:'GENERE_PARTIEL_WARNING'}, 
  GENERE_COMPLET_WARNING: {ARCHIVABLE: true , VALUE:'GENERE_COMPLET_WARNING'},
  GENERE_PARTIEL_ERREUR: {ARCHIVABLE: true , VALUE:'GENERE_PARTIEL_ERREUR'},
  GENERE_COMPLET_ERREUR: {ARCHIVABLE: true , VALUE:'GENERE_COMPLET_ERREUR'}, 
  FICHIER_RELOOKE_MANUELLEMENT: {ARCHIVABLE: true , VALUE:'FICHIER_RELOOKE_MANUELLEMENT'}
};

export const ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE = {
  FOND_A_VALIDER_METIER: {ETAT:'FOND_A_VALIDER_METIER' , ARCHIVABLE:false}, 
  FOND_INVALIDE_METIER_ATTENTE_CORRECTION:{ETAT:'FOND_INVALIDE_METIER_ATTENTE_CORRECTION' ,ARCHIVABLE:false},
  FORME_A_VALIDER_METIER: {ETAT:'FORME_A_VALIDER_METIER' , ARCHIVABLE:false}, 
  FORME_INVALIDE_METIER_ATTENTE_CORRECTION: {ETAT:'FORME_INVALIDE_METIER_ATTENTE_CORRECTION' , ARCHIVABLE:false},
  FORME_INVALIDE_METIER_CORRIGE: {ETAT:'FORME_INVALIDE_METIER_CORRIGE' , ARCHIVABLE:true},
  FOND_INVALIDE_METIER_CORRIGE: {ETAT:'FOND_INVALIDE_METIER_CORRIGE' , ARCHIVABLE:false},
  FORME_VALIDE_METIER: {ETAT:'FORME_VALIDE_METIER' , ARCHIVABLE:true}, 
  FORME_VALIDE_SI: {ETAT:'FORME_VALIDE_SI' , ARCHIVABLE:true},
  ARCHIVE: {ETAT:'ARCHIVE' , ARCHIVABLE: false},
  A_ENVOYER: {ETAT:'A_ENVOYER' , ARCHIVABLE:false},
  ENVOYE: {ETAT:'ENVOYE' , ARCHIVABLE:false},
  FOND_VALIDE_SI: {ETAT:'FOND_VALIDE_SI' , ARCHIVABLE:false}
};

export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC'
};

export const FORMAT_DATE_MONTH = 'dd MMM yyyy';

export const STORED_ACTIVE_ROLE_NAME = 'activeRoleName';
export const ACTIVE_ROLE = 'activeRole';
export const STORED_ACTIVE_ROLE_PERMISSIONS = 'permissions';
export const ABANDONED_COMMAND_ORDER_STATUS = 'ANNU';
export const CANCELED_COMMAND_ORDER_STATUS = 'CANCELED';
