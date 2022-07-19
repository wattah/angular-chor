import { Injectable } from "@angular/core";

@Injectable({
    'providedIn':'root'
})
export class CustomerCivilityService{
    default = "UNKNOWN";
	shortMan = 'M';
    shortWeman = 'MME';
    constructor() {}
    getPersonTitle(sortTitle: string){
        console.log(sortTitle)
        switch (sortTitle) {
          case this.default:
            return '';
          case this.shortMan:
            return 'Monsieur';
          case this.shortWeman:
            return 'Madame';
          default:
            return '';
        }
    }
}
