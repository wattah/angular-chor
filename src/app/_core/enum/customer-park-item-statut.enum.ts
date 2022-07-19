export enum NicheContractStatus {
    ACTIF = 'ACTIF',
    DENUMEROTE = 'DENUMEROTE',
    EN_CREATION = 'EN_CREATION',
    HORS_CONTRAT = 'HORS_CONTRAT',
    ORANGE = 'ORANGE',
    ORANGE_BY_PARNASSE = 'ORANGE_BY_PARNASSE',
    ORANGE_PRO = 'ORANGE_PRO',
    ORANGE_VIP = 'ORANGE_VIP',
    RESILIE = 'RESILIE',
    SUSPENDU = 'SUSPENDU',  
    
    
	
 }

 export enum NicheContractStatusWithFilter {
    ACTIF = 'ACTIF',
    EN_CREATION = 'EN_CREATION',
    HORS_CONTRAT = 'HORS_CONTRAT',
    ORANGE = 'ORANGE',
    ORANGE_BY_PARNASSE = 'ORANGE_BY_PARNASSE',
    ORANGE_PRO = 'ORANGE_PRO',
    ORANGE_VIP = 'ORANGE_VIP'
 }

 export const NicheContractStatusWithFilters: Record<NicheContractStatusWithFilter, string> = {
   [NicheContractStatusWithFilter.ACTIF]: "Actif",
   [NicheContractStatusWithFilter.EN_CREATION]: "En  cours de création",
   [NicheContractStatusWithFilter.HORS_CONTRAT]: "Hors contrat",
   [NicheContractStatusWithFilter.ORANGE]: "Orange",
   [NicheContractStatusWithFilter.ORANGE_BY_PARNASSE]: "Orange By Parnasse",
   [NicheContractStatusWithFilter.ORANGE_PRO]: "Orange Pro",
   [NicheContractStatusWithFilter.ORANGE_VIP]: "Orange VIP",
 }

 export const NicheContractStatustValue: Record<NicheContractStatus, string> = {
    [NicheContractStatus.ACTIF]: "Actif",
    [NicheContractStatus.RESILIE]: "Résilié",
    [NicheContractStatus.SUSPENDU]: "Suspendu",
    [NicheContractStatus.HORS_CONTRAT]: "Hors contrat",
    [NicheContractStatus.EN_CREATION]: "En  cours de création",
    [NicheContractStatus.DENUMEROTE]: "Dénuméroté",
    [NicheContractStatus.ORANGE_VIP]: "Orange VIP",
    [NicheContractStatus.ORANGE]: "Orange",
    [NicheContractStatus.ORANGE_PRO]: "Orange Pro",
    [NicheContractStatus.ORANGE_BY_PARNASSE]: "Orange By Parnasse",
};

