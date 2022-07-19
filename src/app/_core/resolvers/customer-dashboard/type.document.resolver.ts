import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TypeDocument } from '../../../_core/models/Type-Document';
import { TypeDocumentService } from '../../services/type-document-service';

@Injectable({
  providedIn: 'root'
})
export class TypeDocumentResolver implements Resolve<Observable<TypeDocument[]>> {
  constructor(private readonly typeDocumentService: TypeDocumentService) {
  }

  resolve(): Observable<TypeDocument[]> {
    return this.typeDocumentService.getDocumentsTypeDocs()
      .pipe(catchError(() => of([])));
    
  }
}
