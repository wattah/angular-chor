import { catchError } from 'rxjs/operators';
import { CustomerService } from 'src/app/_core/services';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomerComplaint } from '../../../_core/models/customer-complaint';
import { getCustomerIdFromURL } from '../customer-dashboard-utils';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-complaint',
  templateUrl: './customer-complaint.component.html',
  styleUrls: ['./customer-complaint.component.scss']
})
export class CustomerComplaintComponent implements OnInit {
  customerComplaint: CustomerComplaint;

  navigationSubscription: Subscription;

  @Input() nbrTotalRecouvrement: number;
  @Input() detteTotalTTC:number;
  @Output()
  isSensible: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      //Actualiser le bandeau rouge relatif au dossier sensible
      if (e instanceof NavigationEnd) {
        this.updateCustomerComplaint();
      }
    });  
  }

  ngOnInit() {
    this.updateCustomerComplaint();
  }

  updateCustomerComplaint() {
    let customerId = getCustomerIdFromURL(this.route);
    this.customerService
      .getComplaintMessageForCustomer(customerId)
      .pipe(catchError(() => of(null)))
      .subscribe(
        (customerComplaint) => {
          this.customerComplaint = customerComplaint;
          this.isSensible.emit(customerComplaint.isSensible);
        }
      );
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }
}
