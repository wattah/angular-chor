import { Component, Input,OnChanges, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { InterlocutorVO } from 'src/app/_core/models/interlocutor-vo';
import { TelephoneVO } from 'src/app/_core/models/telephoneVO';
import { EmailVO } from 'src/app/_core/models/emailVO';
import { PostalAdresseVO } from 'src/app/_core/models/postalAdresseVO';


@Component({
  selector: 'app-contacts-information',
  templateUrl: './contacts-information.component.html',
  styleUrls: ['./contacts-information.component.scss']
})
export class ContactsInformationComponent implements OnChanges,OnInit {
  @ViewChild('tableChild' , { static: false }) 
  myChild:ElementRef;
  
  @Input()
  isParticular: boolean;

  @Input()
  isEntreprise: boolean;

  @Input()
  coordonnes: InterlocutorVO;  
  telephones: TelephoneVO[];  
  emails: EmailVO[]; 
  adresses: PostalAdresseVO[];

  customerId: number;
 
  constructor(private route: ActivatedRoute) {}

  ngOnChanges(): void {
    this.countItems();    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( (params: ParamMap) => {
      this.customerId = Number(params.get('customerId'));
    });
    this.countItems();      
  }
  
  countItems(): void {
    let telephones: TelephoneVO[] = [];
    let emails: EmailVO[] = [];
    let adresses: PostalAdresseVO[] = [];

    if (this.coordonnes !== undefined && this.coordonnes !== null) {  
      telephones = this.coordonnes.telephones;
      emails = this.coordonnes.emails;
      adresses = this.coordonnes.adresses;
    }   
    this.telephones =  this.sortTelLists(telephones);  
    this.emails =  emails;  
    this.adresses = adresses;  
  }

  /** function allowed to put in elements of a list in other list
   * 
   * @param list 
   * @param listToPutIn 
   */
  fill(list: any[], listToPutIn: any[]): any[] {
    for (let item of list) {
      listToPutIn.push(item);
    }
    return listToPutIn;
  }

  sortTelLists(list: any[]): any[] {
    let listToSend: any[] = []; 
    var nbTelTitulaire = 0; 
    var nbTelAdmin = 0;
    list = this.sortLists(list);
    this.fill( list.filter(function(item){
      if(item.role.match("Titulaire")){
        nbTelTitulaire ++;
      }
      if(item.role.match("Administrateur")){
        nbTelAdmin ++;
      }
    }),listToSend);
    for (let item of list) {
      if(listToSend.length<1 && item.role.match("Administrateur") && item.fix){
        listToSend.push(item); 
        break;
      } else if(listToSend.length<1 && item.role.match("Administrateur") && !item.fix){
        listToSend.push(item); 
        break;
      } else if(listToSend.length<1 && item.role.match("Titulaire") && item.type == "RP"){
        listToSend.push(item); 
        break;
      } else if(listToSend.length<1 && item.role.match("Titulaire") && item.type != "RP"){
        listToSend.push(item); 
        break;
      }
    }
      
    if((nbTelTitulaire == 1 || nbTelTitulaire == 0) && nbTelAdmin>1){
      if(nbTelTitulaire == 0){
        for(var i = 0; i < list.length; i++) {
          if (!this.found(listToSend,list[i]) && list[i].role =="Administrateur") {
            listToSend.push(list[i]); 
          }
        }
      }
      else if(nbTelTitulaire == 1){
        for(var i = 0; i < list.length; i++) {
          if (!this.found(listToSend,list[i]) && list[i].role =="Administrateur") {
            listToSend.push(list[i]); 
            break;
          }
        }
        for(var i = 0; i < list.length; i++) {
          if (!this.found(listToSend,list[i]) && list[i].role =="Titulaire" && list[i].type == "RP") {
            listToSend.push(list[i]); 
          }
        }
        for(var i = 0; i < list.length; i++) {
          if (!this.found(listToSend,list[i]) && list[i].role =="Titulaire") {
            listToSend.push(list[i]); 
          }
        }
      }

    } else if(nbTelTitulaire > 1 && nbTelAdmin>1){
        for(var i = 0; i < list.length; i++) {
          if (!this.found(listToSend,list[i]) && list[i].role =="Titulaire" && list[i].type == "RP") {
            listToSend.push(list[i]); 
          }
        }
        for(var i = 0; i < list.length; i++) {
          if (!this.found(listToSend,list[i]) && list[i].role =="Titulaire") {
            listToSend.push(list[i]); 
          }
        }
    }
    for(var i = 0; i < list.length; i++) {
      if (!this.found(listToSend,list[i])) {
        listToSend.push(list[i]); 
      }
    }
    return listToSend;
  }

  sortLists(list:any[]):any[]{
    let listToSend:any[]=[];  
    this.fill( list.filter(function(item){
      return item.role.match("Administrateur") && item.fix ;    
    }),listToSend);
    this.fill( list.filter(function(item){
      return item.role.match("Administrateur") && !item.fix;    
    }),listToSend);
    this.fill( list.filter(function(item){
      return item.type.match("RP") && item.role.match("Titulaire");
    }),listToSend);
    this.fill( list.filter(function(item){
    return item.role.match("Titulaire")&&!item.type.match("RP");
    }),listToSend);
    this.fill( list.filter(function(item){
      return !item.role.match("Titulaire") && !item.type.match("RP") && !item.role.match("Administrateur");
    }),listToSend);
      return listToSend;
    }
  found(list:any[], item:any):any{
      var found = false;
      for(var i = 0; i < list.length; i++) {
      if (list[i].id == item .id && list[i].role ==item.role && list[i].type ==item.type && list[i].fix == item.fix && list[i].mobile == item.mobile  ) {
          found = true;
          break;
        }
      }
      return found;
  }




}
