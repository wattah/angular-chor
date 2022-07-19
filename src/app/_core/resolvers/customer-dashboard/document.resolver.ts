import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DocumentService } from '../../services/documents-service';
import { DocumentVO } from '../../../_core/models/documentVO';

@Injectable({
  providedIn: 'root'
})
export class DocumentResolver implements Resolve<Observable< DocumentVO[]>> {
  customerId: string;
  constructor(private documentService: DocumentService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DocumentVO[]> {
    this.customerId = route.paramMap.get('customerId');
    return this.documentService.getDocumentsBy(this.customerId, 16 , '' )
    .pipe(catchError(() => of([])));
  }
}
