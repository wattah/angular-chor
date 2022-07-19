export interface HomologationParticipantAdresseVO {
  id: number;
  homologationParticipantId:number;
  type:string;
  addrLine2: string;
  addrLine3: string;
  addrLine4: string;
  addrLine5: string;
  addrLine6: string;
  postalCode: string;
  city: string;
  cedex: string;
  orasId:string;
  streetNumber:number;
  streetExtension:string;
  streetType:string;
  streetName:string;
  inseeCode:string ;
  rivoliCode:string ;
  geoCodeX:number ;
  geoCodeY:number;
  countryRef:string;
}
