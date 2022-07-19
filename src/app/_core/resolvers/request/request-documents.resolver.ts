import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DocumentVO } from '../../models/documentVO';
import { DocumentService } from '../../services/documents-service';

@ Injectable({
  providedIn: 'root'
})
export class RequestDocumentsResolver implements Resolve<Observable<DocumentVO[]>> {
  idRequest: string;
  constructor(private readonly documentService: DocumentService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DocumentVO[]> {
    this.idRequest = route.paramMap.get('idRequest');
    return this.documentService.getRequestDocuments(Number(this.idRequest))
    .pipe(catchError(() => of(null)));
  }
}
