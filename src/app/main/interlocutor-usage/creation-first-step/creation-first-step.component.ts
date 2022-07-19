import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ContactMethodService } from '../../../_core/services';

@Component({
  selector: 'app-creation-first-step',
  templateUrl: './creation-first-step.component.html',
  styleUrls: ['./creation-first-step.component.scss']
})
export class CreationFirstStepComponent implements OnInit {

  type: string;
  customerId;
  typeCustomer: string;
  interval;

  blockCreationUsage = false;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, 
    private readonly contactMethodService: ContactMethodService) {}

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe( (params: ParamMap) => {
      this.customerId = params.get('customerId');
    });
    this.route.queryParamMap.subscribe( params => {
      this.typeCustomer = params.get('typeCustomer');
    });
  }

  navigateToCreation(type: string): void {
    clearInterval(this.interval);
    this.router.navigate(
      ['/customer-dashboard', this.customerId, 'interlocutor-usage', 'creation', type.toLowerCase()],
      { queryParamsHandling: 'merge' }
    );
  }

  onChoosingType(type: string): void {
    this.type = type;
    if(type === 'USAGE'){
      this.contactMethodService.getUsagesTypesCreatedForCustomerId(this.customerId).subscribe(data => {
        if(data.length >= 5 ){
          this.blockCreationUsage = true;
        } else {
          this.interval = setInterval(() => {
          this.navigateToCreation(type);
        },500);
        }
      });
    } else {
      this.interval = setInterval(() => {
        this.navigateToCreation(type);
      },500);
    }
  }

  annuler(){
    const customerDashbord ='/customer-dashboard';
    this.router.navigate([customerDashbord,
      this.typeCustomer === 'company' ? 'entreprise' : 'particular', this.customerId],
    { queryParams: { typeCustomer: this.typeCustomer}
   });
  }

  
}
