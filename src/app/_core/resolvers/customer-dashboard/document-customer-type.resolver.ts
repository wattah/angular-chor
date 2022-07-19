import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DocumentService } from '../../services/documents-service';
import { DocumentVO } from '../../models/documentVO';
import { isNullOrUndefined } from '../../utils/string-utils';
import { TARGET_TYPE_DOCUMENT } from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeCustomerResolver implements Resolve<Observable<DocumentVO[]>> {
  customerId: string;

  constructor(private documentService: DocumentService) {
  }

  resolve(router: ActivatedRouteSnapshot): Observable<DocumentVO[]> {
    this.customerId = router.paramMap.get('customerId');

    if (isNullOrUndefined(this.customerId)) {
      this.customerId = router.parent.paramMap.get('customerId');
    }
    return this.documentService.getDocumentFullBy(this.customerId, TARGET_TYPE_DOCUMENT.CUSTOMER )
    .pipe(catchError(() => of([])));
  }
}
