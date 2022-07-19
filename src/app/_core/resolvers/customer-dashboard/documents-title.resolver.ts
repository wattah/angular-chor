import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DocumentTitleVO } from '../../models/models';
import { DocumentsTitleService } from '../../services/documents-title.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentTitleResolver implements Resolve<Observable< DocumentTitleVO[]>> {
  customerId: string;
  constructor(private readonly documentTitleService: DocumentsTitleService) {
  }

  resolve(): Observable<DocumentTitleVO[]> {
    return this.documentTitleService.getAllTitleDocs()
    .pipe(catchError(() => of([])));
  }
}
