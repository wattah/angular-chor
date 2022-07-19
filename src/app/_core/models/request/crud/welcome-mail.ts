export interface WelcomeMailVO {
  id: number;
  addressId: number;
  issueDate: Date;
  fullInfosWelcomeMail: string;
  civility: string;
  coach: string;
  fullTitle: string;
  isArchived: boolean;
  isValid: boolean;
  requestId: number;
  customerId: number;
  recipient: any;
  address: any;
}
