import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class HardwareParkItemService {
  categories;
  severalCustomerTit;
  beneficiaries;
  public _filterCategory(value: string){
    const filterValue = value.toLowerCase();
    return this.categories.filter(
      (category) => category.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  public _filterContract(value: string){
    const filterValue = value.toLowerCase();
    return this.severalCustomerTit.filter(
      (contract) => contract.offre.toLowerCase().indexOf(filterValue) === 0
    );
  }

  public _filterBeneficiary(value: string){
    const filterValue = value.toLowerCase();
    return this.beneficiaries.filter(
      (beneficiary) => beneficiary.label.toLowerCase().indexOf(filterValue) === 0
    );
  }

}
