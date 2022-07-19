export enum PenicheTypeEnvoiLivrable {
    MAIL = 'MAIL' ,
    MANUEL = 'MANUEL' ,
    PAPIER_AUTO = 'PAPIER_AUTO' ,
    ANNULE = 'ANNULE' 
 }

export enum PenicheState {
    ACTIF = 'ACTIF',
    INACTIF = 'INACTIF'
 }

export enum PenichePaymentCondition {
    C15_JOURS_FACTURE = 'C15_JOURS_FACTURE',
    C30_JOURS_FACTURE = 'C30_JOURS_FACTURE',
    C45_JOURS_FACTURE = 'C45_JOURS_FACTURE',
    C60_JOURS_FACTURE = 'C60_JOURS_FACTURE'
}

export enum Title {
    M = 'M',
    MR = 'MR',
    MME = 'MME'
 }

export enum PenicheCiviliteByEnumLegacy {
    M = 'M',
    MR = 'MR',
    MME = 'MME',
    MLE = 'MME',
    STE = 'PM'
}
 
export enum PenicheCivilite {
    MR = 'MR',
    MME = 'MME',
    PM = 'PM'  
}

export enum TelcoUniverse {
    MOBILE = 'MOBILE',
    SERVICE = 'SERVICE',
    FIXE = 'FIXE',
}
