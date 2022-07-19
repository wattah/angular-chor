export interface PayementVO {
  id: number;
  url: string;
  payementTemplateId: number;
  transactionType: string;
  transactionAmount: number;
  requestId: number;
  taskId: number;
  mediaRefId: number;
  comment: string;
  datePayement: Date;
  customerId: number;
  refBill: string;
  refBillAcount: string;
  universeLabel: string;
  userId: number;
  paymentRefNumber: string;
  typePayementLabel: string;
  autorizationRefNumber: string;
}
