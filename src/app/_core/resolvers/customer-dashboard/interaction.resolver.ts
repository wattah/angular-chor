import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { isNullOrUndefined } from '../../utils/string-utils';
import { InteractionService } from '../../services/interaction.service';
import { CustomerInteractionVO } from '../../models/request/crud/customer-interaction';


@ Injectable({
  providedIn: 'root'
})
export class InteractionResolver implements Resolve< Observable< CustomerInteractionVO>> {
  interactionId: string;
  constructor(private readonly interactionService: InteractionService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable< CustomerInteractionVO> {
    this .interactionId = route.paramMap.get('interactionId');
    
    if (isNullOrUndefined(this .interactionId)) {
      this .interactionId = route.parent.paramMap.get('interactionId');
    }
   
    return this .interactionService.getInteraction(Number(this .interactionId))
    .pipe(catchError(() => of(null)));

  }
  
}
