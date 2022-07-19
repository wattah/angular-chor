export interface InteractionReasonVO {
  id: number;
  label: string;
  parentId: number;
  key: string;
  children: InteractionReasonVO[];
} 
