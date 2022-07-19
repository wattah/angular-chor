import { catchError } from 'rxjs/operators';
import { ManufacturerService } from './../services/manufacturer.service';
import { ManufacturerVO } from './../models/manufacturer-vo';
import { Observable, of } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class AllManufacturersResolver implements Resolve<Observable<ManufacturerVO[]>>{
    constructor(readonly manufacturerService: ManufacturerService) {
    }
    resolve(): Observable<ManufacturerVO[]> {
      return this.manufacturerService.getAllManufacturers()
                                     .pipe(catchError(() => of([])));
    }
}
