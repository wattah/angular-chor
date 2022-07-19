import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomologationVO } from '../../../../_core/models';
import { HomologationParticipantAdresseVO } from '../../../../_core/models/homologation/homologation-participant-adresse-vo';

@Component({
  selector: 'app-homologation-contract-holder',
  templateUrl: './homologation-contract-holder.component.html',
  styleUrls: ['./homologation-contract-holder.component.scss']
})
export class HomologationContractHolderComponent implements OnInit {
  @Input() typeCustomer: string;
  @Input() homologation: HomologationVO;


  constructor( readonly route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe( params => {
      this.typeCustomer = params.get('typeCustomer');
    });
    


  }

  formattedAddressParticipant(adressesList:any){
    let result = "";
    for (const adresse of adressesList){
      if(adresse != null){
        result += this.constructAdresseLine(adresse);
        if (adresse.postalCode){
          result += ` ${adresse.postalCode}`;
        }						
        if (adresse.city){
          result += ` ${adresse.city}`;
        }
        if (adresse.cedex){
          result += ` ${adresse.cedex}`;
        }
        if (adresse.countryRef){
          result += ` ${adresse.countryRef}`;
        }
        //TODO saut de ligne dans ag grid
        result += "\n";
      }
    }
    return result;
  }

  constructAdresseLine(adresse:HomologationParticipantAdresseVO){
    let result = "";
    if(adresse.addrLine2){
      result += adresse.addrLine2;
    }
    if(adresse.addrLine3){
      result += ` ${adresse.addrLine3}`;
    }
    if(adresse.addrLine4){
      result += ` ${adresse.addrLine4}`;
    }
    if(adresse.addrLine5){
      result += ` ${adresse.addrLine5}`;
    }
    if(adresse.addrLine6){
      result += ` ${adresse.addrLine6}`;
    }
    return result;
  }

}
