export const CUSTOMER_DASHBOARD = '/customer-dashboard';
export const PICTO_TACHE_CLOSE_HORS_D_LAIS = 'picto-tache-close-hors-d-lais'
export const PICTO_TACHE_ASSIGN_DANS_D_LAIS = 'picto-tache-assign-dans-d-lais';
export const PICTO_PDF = 'pdf';
export const ABSENTE = 'Absente';
export const UPLOADEE = 'Uploadée';
export const GENEREE_SANS_ERREURS = 'Générée sans erreurs';
export const GENEREE_AVEC_WARNINGS = 'Générée avec warnings';
export const GENEREE_AVEC_ERREURS = 'Générée avec erreurs';
export const RELOOKEE_MANUELLEMENT = 'Relookée manuellement';
export const A_VERIFIER = 'A vérifier';
export const CORRECTION_VALIDEE = 'Correction validée';
export const A_CORRIGER = 'A corriger';
export const VERIFIEE = 'Vérifiée';
export const ARCHIVEE = 'Archivée';
export const DATE_PATTERN = 'yyyy-MM-dd';
export const SEPARATOR_TO_JOIN_MESSAGES=' ';
export const RELOOKING = 'Relooking';
export const RELOOKING_WITHOUT_BILL_MESSAGE = 'Veuillez sélectionner une ou des factures pour procéder au relooking.';
export const ARCHIVAGE_WITHOUT_BILL_MESSAGE = 'Veuillez sélectionner une ou des factures pour procéder à l\'archivage';
export const SUPRESSION = 'Oui, je la supprime';
export const OUI = 'Oui';
export const NON = 'Non';
export const CONSERVE = 'Non, je la conserve';

export const SIZE: "sm" | "lg" = 'lg';
export const UNIVERS_SERVICE = 'SERVICE';
export const UNIVERS_MOBILE = 'MOBILE';
export const PAIEMENT_TASK = 'Paiement';
export const PAIEMENT_MESSAGE = 'Voulez vous marquer la facture comme payée?';
export const PAIEMENT_COMPLETION_MESSAGE = 'La facture a été marquée comme dèja payée par le client!';
export const PAIEMENT_NOT_COMPLETION_MESSAGE = 'La facture n\'est plus marquée comme dèja payée!';
export const ERROR_TASK = 'error';
export const PAIEMENT_COL_ID = 'paiement';
export const DELETE_PAIEMENT = 'Voulez-vous supprimer le marquage facture payée?';
export const SECONDES = 'secondes';
export const BILL_MESSAGE = 'facture(s) traitée(s) en';
export const DELETE_COL_ID = 'delete';
export const DELETE_TASK = 'Suppression';
export const DELETE_MESSAGE = 'Êtes-vous sûr de vouloir supprimer la facture';
export const SNACK_BAR_SUCCESS_CLASS_NAME = 'center-snackbar-success';
export const SNACK_BAR_ERROR_CLASS_NAME = 'center-snackbar-red';
export const SNACK_BAR_CONTAINER_SUCCESS_CLASS_NAME = 'snack-bar-container-success';
export const SNACK_BAR_CONTAINER_CLASS_NAME = 'snack-bar-container';
export const UNEXPECTED_STATUS_MESSAGE = 'facture(s) non traitée(s) car le statut n\'est pas celui attendu.';
export const RELOOKING_ERROR_CLASS_NAME = 'relooking-error';
export const GENERATION_FILE_IMPOSSIBLE = 'Impossible de générer le fichier';
export const ARCHIVED_FILE_MESSAGE = ', il est archivé';
export const RELOOKING_WARNING_CLASS_NAME = 'relooking-warning';
export const BILL = 'La facture';
export const RELOOKING_WITH = 'a été relookée avec';
export const WARNINGS = 'warning(s)';
export const ERRORS = 'erreur(s)';
export const DETAIL_MESSAGE = 'dans les détails de communications';
export const SUCCESS_RELOOKING_CLASS_NAME = 'relooking-success';
export const SUCCESS_RELOOKING_MESSAGE = 'a été relookée avec succès!';
export const IS_ALREADY_ARCHIVED_BILL_MESSAGE = 'Le document est déjà archivé';
export const PROBLEM_ON_LIVRABLE_MESSAGE = 'Problème sur le fichier selectionné.';
export const INVALID_CF_STATUS_MESSAGE= 'Le statut du compte rendu ne permet pas son archivage .';
export const STATUS_BILL_MESSAGE = 'Le statut de la facture';
export const NOT_ALLOW_ARCHIVAGE_MESSAGE = 'ne permet pas son archivage';
export const MESSAGE_CONFIRMATION = 'Voulez-vous régénérer la facture ';
export const NON_I_DONT_WANT_TO_CONSERVE ='Non, je la conserve';
export const YES_DELETE = 'Oui, je la supprime';
export const CANCEL = 'Annuler';
export const TO_VERIFIED_BILL = 'toVerifiedBill';
export const TO_BE_CORRECT = 'toBeCorrect';
export const FACTURE_VERIFIED = 'Facture vérifiée';
export const FACTURE_TO_BE_CORRECT = 'Facture à corriger';
export const PARAMETRIZE_MESSAGE = 'A quel statut voulez vous faire passer la facture ?';
export const CORRECTION = 'Correction';
export const PARAMETRIZE_COL_ID = 'parametres';
export const DOWLOAD_COL_ID = 'download';
export const DOWNLOAD_ERROR_MESSAGE = 'Le fichier que vous souhaitez télécharger est introuvable.';
export const DOWNLOAD_FILIGRANE_MESSAGE = 'Que souhaitez vous télécharger comme facture?';
export const WITH_FILIGRANE = 'Facture relookée avec filigrane';
export const WITHOUT_FILIGRANE = 'Facture relookée sans filigrane';
export const DOWNLOAD_CHOSE_MESSAGE = 'Que souhaitez-vous télécharger ?';
export const BILL_RELOOKED_MANUALLY = 'Facture relookée manuellement';
export const ORIGINAL_BILL = 'Facture Orange d\'origine';
export const CONSTANTS_BILL = {
  FACTURE  : 'FACTURE',
  SELECTED_FILE_LABEL  : ' fichier(s) selectionné(s) ',
  FILE_LABEL : 'Le fichier',
  NAME_FILE_INVALID_LABEL  : 'ne respecte pas la règle de nommage.',
  DATE_FILE_INVALID_LABEL : 'ne correspond pas à la période selectionnée.',
  NUM_CLIENT_INVALID_LABEL : 'ne correspond pas au client selectionné',
  INFO_CLASS_NAME : 'message-info',
  ERROR_CLASS_NAME  : 'relooking-error',
  MESSAGE_INFO : '<span class="message-info">infos...<span>',
  WARNING_CLASS_NAME  : 'relooking-warning',
  BILL_DATA : 'Données de la facture ',
  EXTRACT_WITH_SUCCESS : 'extraites avec succès',
  EXTRACT_WITH :  'extraites avec ',
  SUCCESS_CLASS_NAME : 'relooking-success' ,
  WARNING_ERRORS_LABEL : 'warning(s)/erreur(s)'
} ;
export const NAME_PENICHE = 'Péniche';
export const CODE_NICHE_PARNASS = 'EAA';
export const ICON_VALID = 'status-green-teleco';
export const ICON_NOT_VALID = 'status-red-teleco';
export const LE_FICHIER = 'Le fichier';
export const MESSAGE_DEJA_EXISTANT_SUR_PENICHE = 'existe déjà au sein de Peniche';
export const MESSAGE_GENERIC_DEJA_EXISTANT = 'a déjà été chargé.';
export const MESSAGE_EXCEL50D_WITH_ERROR = 'Le fichier a été chargé en base mais avec des erreurs. Pour plus d\'informations, déplier la ligne concernée du tableau.';
export const MESSAGE_EXCEL50D_WITHOUT_ERROR = 'Le fichier a été chargé en base avec succès.';
export const MESSAGE_GENERIC_EXCEL50D_WITH_NICHE = 'La niche avec le code 50D';
export const MESSAGE_GENERIC_EXCEL50D_CODE_ALREADY = 'n\'a pas pu être retrouvé au sein de Peniche';
export const MESSAGE_EXCEL50D_CODE_ALREADY = 'n\'a pas pu être identifiée';
export const SEPARATOR_NAME_FILE = '_';
export const SEPARATOR_DATE = '-';
export const MESSAGE_RELOOKING_POPUP = "Attention! <br> "
  +" Vous êtes sur le point de charger un fichier PDF de votre choix en tant que fichier relooké."
  + " Si le fichier a déjà été généré par Péniche, il sera supprimé et remplacé par le nouveau fichier uploadé manuellement."
  +"Pour annuler cette action, vous devrez supprimer le fichier (bouton poubelle), ré-importer le fichier d'origine et le relooker";
export const TITLE_RELOOKING = 'Attention!';
export const CONTINUE_UPLOAD = 'Je continue le téléchargement';
export const CANCELED_UPLOAD= 'J\'annule le téléchargement ';
export const TITLE_POPU_ERROR = "Erreur";
export const MESSAGE_FORMAT_FILE_KO = "Le fichier sélectionné ne respecte pas la bonne nomenclature fichier. "
  + "Veuillez charger un fichier nommé correctement.";
export const MESSAGE_OK  = "OK";
export const MESSAGE_GENERATE_CORRECTLY = "Votre fichier a bien été généré manuellement." +
      "La facture relookée est chargée puis elle passe à l'état "+
      'Relookée manuellement" et au statut "Facture vérifiée" (statut détaillé => "Vérifiée automatiquement")';
