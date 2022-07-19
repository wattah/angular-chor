import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MessageTemplateLightVO } from '../../models/models';
import { MessageTemplateService } from '../../services/message-template.service';
import { isNullOrUndefined } from '../../utils/string-utils';

@Injectable({
  providedIn: 'root'
})
  
  export class MessageTemplateResolver implements Resolve<Observable<MessageTemplateLightVO[]>> {
  customerId: string;
  requestTypeId: string;

  constructor(private readonly messageTemplateService: MessageTemplateService) {
  }

  resolve(router: ActivatedRouteSnapshot): Observable<MessageTemplateLightVO[]> { 
    
    this.customerId = router.paramMap.get('customerId');
    if (isNullOrUndefined(this.customerId)) {
      this.customerId = router.parent.paramMap.get('customerId');
    }
    this.requestTypeId = router.paramMap.get('requestTypeId');
    const category = String(router.data['category']);

    return this.messageTemplateService.getListFormatedMessage(Number(this.requestTypeId), category,'FRENCH', this.customerId)
    .pipe( catchError( () => of(null)));
  }
}
