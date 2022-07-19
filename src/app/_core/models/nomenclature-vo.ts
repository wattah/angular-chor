export interface NomenclatureVO {
    id: number;
    value: string;
    label: string;
    level: number;
    parent: NomenclatureVO;
    childrenIds: number[];
  }
