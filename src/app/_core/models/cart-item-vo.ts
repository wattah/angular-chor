import { ReferenceDataVO } from './reference-data-vo';
import { ProductVO } from './productVO';
import { NomenclatureVO } from './nomenclature-vo';

export interface CartItemVO {
    id: number;
  product: ProductVO;
  cartId: number;
  addedById: number;
  modifiedById: number;
  quantity: number;
  ordinal: number;
  addingDate: Date;
  unitPriceHt: number;
  discount: number;
  discountLabel: string;
  tauxTVA: string;
  comment: string;
  commentMandatory: boolean;
  productLabel: string;
  productBillLabel: string;
  productCategory: string;
  unreferencedProductCategoryId: number;
  serial: string;
  warrantyValue: number;
  warrantyLabel: string;
  articleClassLabel: string;
  articleClassId: number;
  refDataArticleClass: ReferenceDataVO;
  proactiveSale: boolean;
  isCommentDisplayOnBill: boolean;
  customerParkItemId: number;
  nomenclature: NomenclatureVO;
  acquisitionPrice: number;
  acquisitionPriceReal: number;
  margin: number;
  marginReal: number;
  arrow: string;
  deletingDate : Date;
	deletedById : number;
  deletedByUserName : string;
}
