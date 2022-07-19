export interface ApprovalDocumentVO {
  id: number;
  homologationId: number;
  filename: string;
  name: string;
  receivedAt: Date;
  modifiedAt: Date;
  modifiedBy: number;
  uploadedAt: Date;
  documentTitleId: number;
  documentTitleName: string;
  isValidatedPreHomologation: boolean;
  isValidatedHomologation: boolean;
  type: string;
  documentTypeId: number;
  documentTypeName: string;
  customerNicheIdentifer: string;
  documentTitleTypeId: number;
  file: any;
  portalId: string;
  documentParticipantName: string;
  isUploaded: boolean;
  customerFullName: string;
}
