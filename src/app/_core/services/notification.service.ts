import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HomologationVO } from '../models/homologation/homologation-vo';
import { CanalMotifHomologation } from '../models/Canal-Motif-homologation-vo';
import { CustomerParkItemVO } from '../models/customer-park-item-vo';
import { PenicheBillAccountVO } from '../models/peniche-bill-account-vo';
import { MessageTemplateLightVO } from '../models/models';
import { CustomerParcServiceVO } from '../models/customer-parc-service-vo';
import { PenicheBillCreditComplementaryVO } from '../models/peniche-bill-credit-complementary-vo';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  deleted$: Subject<boolean> = new Subject();
  isLivePage$: Subject<boolean> = new Subject();
  deletCartItem$: Subject<boolean> = new Subject();
  previousUrl;
  savedCartId: any;
  showCartButtons$: Subject<boolean> = new Subject();
  doc;
  homologation: HomologationVO;
  templates: MessageTemplateLightVO[];
  canalMotifHomologation: CanalMotifHomologation;

  withLogo$: Subject<boolean> = new Subject();
  isFromCriAndCriChange$: Subject<boolean> = new Subject();
  isSaveCri$: Subject<boolean> = new Subject();

  customerParkItem: CustomerParkItemVO;
  penicheBillAccount: PenicheBillAccountVO;

  templateMessage: MessageTemplateLightVO[];
  parcServices: CustomerParcServiceVO[];

  penicheBillCreditComplementaryVo : PenicheBillCreditComplementaryVO;

  public absenceDeleted(deleted: boolean) {
    this.deleted$.next(deleted);
  }

  public isLivePage(value: boolean) {
    this.isLivePage$.next(value);
  }

  public notify() {
    return this.deleted$;
  }

  public notifyIsLivePage() {
    return this.isLivePage$;
  }

  public setPreviousUrl(value: string) {
    this.previousUrl = value;
  }

  public notifyPreviousUrl() {
    return this.previousUrl;
  }

  getWithLogo() {
    return this.withLogo$;
  }

  setWithLogo(value: boolean): any {
    this.withLogo$.next(value);
  }

  public onDeletCartItem(deleting: boolean){
    this.deletCartItem$.next(deleting);
  }

  public deletingNotification(){
    return this.deletCartItem$;
  }

  getSavedCartId(): any {
    return this.savedCartId;
  }

  setSavedCartId(cartId: number): any {
    this.savedCartId = cartId;
  }

  getShowButton(): any {
    return this.showCartButtons$;
  }

  setShowButton(show: boolean): any {
    this.showCartButtons$.next(show);
  }

  getTmpDoc(): any {
    return this.doc;
  }

  setTmpDoc(docs: any): any {
    this.doc = docs;
  }

  getHomologation(): HomologationVO {
    return this.homologation;
  }

  setHomologation(homolog: HomologationVO): void {
    this.homologation = homolog;
  }

  getcanalMotifHomologation(): CanalMotifHomologation {
    return this.canalMotifHomologation;
  }

  setcanalMotifHomologation(canalData: CanalMotifHomologation): void {
    this.canalMotifHomologation = canalData;
  }

  getIsFromCriAndCriChange(): any {
    return this.isFromCriAndCriChange$;
  }

  setIsFromCriAndCriChange(fromCri: boolean): any {
    this.isFromCriAndCriChange$.next(fromCri);
  }
  
  getIsIsSaveCri(): any {
    return this.isSaveCri$;
  }

  setIsSaveCri(isSave: boolean): any {
    this.isSaveCri$.next(isSave);
  }

  getCPI(): CustomerParkItemVO {
    return this.customerParkItem;
  }

  setCPI(cpi: CustomerParkItemVO): void {
    this.customerParkItem = cpi;
  }

  getBillAccount(): PenicheBillAccountVO {
    return this.penicheBillAccount;
  }

  setBillAccount(billAccount: PenicheBillAccountVO): void {
    this.penicheBillAccount = billAccount;
  }

  getTemplates(): MessageTemplateLightVO[] {
    return this.templates;
  }

  setTemplates(templates: MessageTemplateLightVO[]): void {
    this.templates = templates;
  }

  getMessageTemplate(): MessageTemplateLightVO[] {
    return this.templateMessage;
  }

  setMessageTemplate(template: MessageTemplateLightVO[]): void {
    this.templateMessage = template;
  }
  
  getParcServices(): CustomerParcServiceVO[] {
    return this.parcServices;
  }

  setParcServices(parcServices: CustomerParcServiceVO[]): void {
    this.parcServices = parcServices;
  }

  getPenicheBillCreditComplementaryVo(): PenicheBillCreditComplementaryVO {
    return this.penicheBillCreditComplementaryVo;
  }

  setPenicheBillCreditComplementaryVo(penicheBillCreditComplementaryVo: PenicheBillCreditComplementaryVO): void {
    this.penicheBillCreditComplementaryVo = penicheBillCreditComplementaryVo;
  }
}
