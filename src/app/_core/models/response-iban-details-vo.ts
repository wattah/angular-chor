export interface ResponseIbanDetailsVO {
  uuid: string;
  creationDate: number;
  code: string; 
  mandats: string[];
  rib: any;
  blurredIban: string;
  codeBic: string;
}
