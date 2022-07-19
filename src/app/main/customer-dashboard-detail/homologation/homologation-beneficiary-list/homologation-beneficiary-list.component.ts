import { Component, OnInit, Input } from '@angular/core';
import { CSS_CLASS_NAME } from '../../../../_core/constants/constants';
import { HomologationVO } from '../../../../_core/models';
import { titleFullFormatter, firstNameFormatter } from '../../../../_core/utils/formatter-utils';
import { HomologationParticipantAdresseVO } from '../../../../_core/models/homologation/homologation-participant-adresse-vo';


@Component({
  selector: 'app-homologation-beneficiary-list',
  templateUrl: './homologation-beneficiary-list.component.html',
  styleUrls: ['./homologation-beneficiary-list.component.scss']
})
export class HomologationBeneficiaryListComponent implements OnInit {

  @Input() homologation: HomologationVO;
  
  defaultSortModel = [];

  columnDefs = [
    {
      headerName: '',
      headerTooltip: '',  
      width: 40,
      field: 'title',
      valueGetter: params => (params.data && params.data.title) ? titleFullFormatter(params.data.title) : '-',
      resizable: false,
      sortable: false
    },
    {
      headerName: 'Nom', 
      headerTooltip: 'Nom', 
      field: 'lastname',
      valueGetter: params => (params.data && params.data.lastname) ? params.data.lastname.toUpperCase() : '-',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, 
      width: 110, 
      autoHeight: true
    },
    {
      headerName: 'Prénom', 
      headerTooltip: 'Prénom', 
      field: 'firstname',
      valueGetter: params => (params.data && params.data.firstname) ? firstNameFormatter(params.data.firstname) : '-',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, 
      width: 110, 
      autoHeight: true
    },
    {
      headerName: 'Adresse', 
      headerTooltip: 'Adresse', 
      field: 'adresse',
      valueGetter: params => (params.data) ? this.formattedAddressParticipant(params.data) : '-',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, 
      width:240, 
      autoHeight: true
    },
    {
      headerName: 'Téléphone', 
      headerTooltip: 'Téléphone', 
      field: 'phoneNumber',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, 
      width: 130, 
      autoHeight: true
    },
    {
      headerName: 'Mail', 
      headerTooltip: 'Mail', 
      field: 'mail',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, 
      width: 130, 
      autoHeight: true
    },
  ];
  constructor() { }

  ngOnInit() {
  }

  formattedAddressParticipant(data:any){
    let result = "";
    for (const adresse of data.adressesList){
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
