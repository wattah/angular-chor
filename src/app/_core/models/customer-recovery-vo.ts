export interface CustomerRecoveryVO {
    id: number;
    nicheIdentifier: string;
    firstName: string;
    lastName: string;
    fullName: string;
    recoveryProfil: string;
    status: string;
    mobileBalance: number;
    internetBalance: number;
    serviceBalance: number;
    fixeBalance: number;
    globalBalance: number;
    requestId: number;
    mobileRepresentedAmount: number;
    internetRepresentedAmount: number;
    serviceRepresentedAmount: number;
    fixeRepresentedAmount: number;
    dateMajMobile: string;
    dateMajFixe: string;
    dateMajService: string;
    dateMajInternet: string;
  }
