import { HttpClient } from '@angular/common/http';
import { ProductVO, CommandOrderResultVO, PaginatedList } from './../models/models';
import { CommandOrderVo } from '../models/command-order-vo';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { CommandOrderHistoVO } from '../models/command-order-histo-vo';
import { CartVO } from '../models/models';
import { MasterProductVo } from '../models/master-product-vo';
import { Observable } from 'rxjs';
import { CatalogFilterVo } from '../models/catalog-filter';
import { FamilyVO } from '../models/family-vo';
import { map } from 'rxjs/operators';
import { MasterProduct } from '../models/masterProduct/master-product';

@Injectable({
    'providedIn': 'root'
})
export class CatalogeService extends HttpBaseService<ProductVO>{
    constructor(httpClient: HttpClient){
        super(httpClient, 'catalogs')
    }

    getProductsByCriteria(familyId: number , productStatus: string , label: string , customerTarget: string, customerId: string){
        return this.httpClient.get<Array<ProductVO>>(`${environment.baseUrl}/${this.endpoint}/products/${familyId}/${productStatus}/${label}/${customerTarget}/${customerId}`);
    }

    deactivateCommandOrder(coId: number, coStatus : string){
        return this.httpClient.get<CommandOrderVo>(`${environment.baseUrl}/${this.endpoint}/deactivateCommandOrder?commandOrderId=${coId}&status=${coStatus}`);
    }

    deliverCommandOrder(commandOrderId : number){
        return this.httpClient.get<CommandOrderHistoVO>(`${environment.baseUrl}/${this.endpoint}/markCommandOrderAsDelivered?commandOrderId=${commandOrderId}`);  
    }

    generateRestoreOrder(requestId : number, userId : number, fromGenerateCOButton: boolean, type:string,idItemsToRestoreVO : number[], 
        idOrderLinesToCancel : number[], stockToUseCode:string , idCommandOrderOut : number){
         return this.httpClient.post<CommandOrderResultVO>(`${environment.baseUrl}/${this.endpoint}/generateRestoreOrder?requestId=${requestId}&userId=${userId}&fromGenerateCOButton=${fromGenerateCOButton}&type=${type}&stockToUseCode=${stockToUseCode}&idCommandOrderOut=${idCommandOrderOut}`,[idItemsToRestoreVO,idOrderLinesToCancel]);
    }

  /**
	 * Permet de récuperer les produits de catalogue
	 * @param taskFilter
	 */
    getMonitoringCatalog(catalogFilter: CatalogFilterVo): Observable<PaginatedList<ProductVO>> {
        return this.httpClient.post<PaginatedList<ProductVO>>(`${environment.baseUrl}/${this.endpoint}/monitoringCatalog`, catalogFilter);
    }
    
    
  /**
   * Enregister le panier
   *
   * @param {CartVO} cart
   * @returns {Observable<CartVO>}
   */
  saveOrUpdateCart(cart: CartVO): Observable<CartVO> {
    return this.httpClient.post<CartVO>(`${environment.baseUrl}/${this.endpoint}/saveOrUpdateCart`, cart);
  }

  /**
   * permet de debloque des orders 
   * @param cartIds 
   * @returns 
   */
  unblockOrdersByListCartIds(cartIds: number[]): Observable<string[]> {
    let url = `${environment.baseUrl}/${this.endpoint}/unblockOrdersByListCartIds?`;
    if ( cartIds !== null) {
      cartIds.forEach( tr => url += `&cartIds=${tr}`);
    } else {
      url += '&cartIds=';
    }
    return this .httpClient.get<string[]>(url);
  }



  /**
	 * Permet de récuperer les produits maîtres de catalogue
	 * @param catalogFilter
	 */
   getMonitoringCatalogAdmin(catalogFilter: CatalogFilterVo): Observable<PaginatedList<MasterProductVo>> {
    return this.httpClient.post<PaginatedList<MasterProductVo>>(`${environment.baseUrl}/${this.endpoint}/monitoringCatalogAdmin`, catalogFilter);
}
/**
 * permet de recuperer master product par id
 * @param masterProductId 
 * @returns 
 */
getMasterProductById(masterProductId: number): Observable<MasterProductVo>{
  return this.httpClient.get<MasterProductVo>(`${environment.baseUrl}/${this.endpoint}/getMasterProductById?masterProductId=${masterProductId}`);
}

/**
 * permet de récupérer la liste des famille par id
 * @param parentId 
 * @returns 
 */
 getListFamilyProducts(parentId: number): Observable<FamilyVO[]>{
  return this.httpClient.get<FamilyVO[]>(`${environment.baseUrl}/${this.endpoint}/getListFamilyProducts?parentId=${parentId}`);
}

/**
 * permet de recuperer family par id
 */
getFamilyById(id: number){
  return this.httpClient.get<FamilyVO>(`${environment.baseUrl}/${this.endpoint}/getFamilyById?id=${id}`);
}

saveMasterProduct(item: MasterProduct): Observable<MasterProductVo> {
  let formData: FormData = new FormData();
  formData.append("masterProductVO", new Blob([JSON.stringify(item.masterProductVO)], {type: "application/json"}));
  formData.append('image', item.image);
  formData.append('description', item.description);
  return this.httpClient
    .post<MasterProductVo>(`${environment.baseUrl}/${this.endpoint}/saveMasterProduct`, formData)
    .pipe(map((data: any) => data as MasterProductVo));
}

/**
 * permet de recuperer categorie a partir l'id et le nom de categorie 
 */
 getUnderFamilyWithCategory(id: number, familyName: string){
  return this.httpClient.get<FamilyVO>(`${environment.baseUrl}/${this.endpoint}/getUnderFamilyWithCategory?id=${id}&familyName=${familyName}`);
}


}
