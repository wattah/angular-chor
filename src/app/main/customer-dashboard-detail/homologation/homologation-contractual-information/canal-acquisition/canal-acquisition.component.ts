import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, startWith } from 'rxjs/operators';
import { isNullOrUndefined } from '../../../../../_core/utils/string-utils';
import { CustomerService } from '../../../../../_core/services';
import { AcquisitionCanalVO } from '../../../../../_core/models/acquisition-canal-vo';
import { ReferenceDataVO } from '../../../../../_core/models/reference-data-vo';
import { UserService } from '../../../../../_core/services/user-service';
import { UserVo } from '../../../../../_core/models/user-vo';
import { CustomerAutocomplete } from '../../../../../_core/models/customer-autocomplete';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-canal-acquisition',
  templateUrl: './canal-acquisition.component.html',
  styleUrls: ['./canal-acquisition.component.scss']
})
export class CanalAcquisitionComponent implements OnInit {

  @Input() acquisitionsCanaux: AcquisitionCanalVO[] = [];
  @Input() numberCanal: number;
  @Input() firstCanalChanged = true;
  acquisitionCanal: AcquisitionCanalVO;
  canaux: ReferenceDataVO[] = [];
  stores: ReferenceDataVO[] = [];
  storesCompany: ReferenceDataVO[] = [];
  businessCanal: ReferenceDataVO[] = [];
  marketingCanal: ReferenceDataVO[] = [];
  sponsorCanal: ReferenceDataVO[] = [];
  typesCanal: ReferenceDataVO[] = [];
  refStoreSellers: UserVo[] = [];
  refStoreResps: UserVo[] = [];
  refCoachs: UserVo[] = [];
  refVentes: UserVo[] = [];
  storeSellers: UserVo[];
  storeResps: UserVo[];
  usersCooptant: UserVo[];
  defaultReferenceValue = {} as ReferenceDataVO;
  defaultUser = {} as UserVo;
  // idcanal: number;
  userCooptatorId: number;

  labelCanal: string;
  labelTypeCanal: string;
  labelUserStore: string;
  labelUserResp: string;
  lablDetail1: string;
  lablDetail2: string;
  lablDetail3: string;

  firstCanalControl = new FormControl();
  secondCanalControl = new FormControl();
  userStoreControl = new FormControl();
  userRespControl = new FormControl();
  details1Control = new FormControl();
  details2Control = new FormControl();
  details3Control = new FormControl();
  typeCBMarketingControl = new FormControl();
  typeCBbusinessControl = new FormControl();
  typeCBSponsorControl = new FormControl();
  typeCBstoreCompControl = new FormControl();
  typeCBstoreControl = new FormControl();
  membreControl = new FormControl();
  userCooptantControl = new FormControl();

  showUserStore = false;
  showUserResp = false;
  showDetail1 = false;
  showDetail2 = false;
  showDetail3 = false;
  showCustomerOther = false;
  showUserCooptant = false;
  showTypeCanal = false;
  typeCBMarketing = false;
  typeCBbusiness = false;
  typeCBSponsor = false;
  typeCBstoreComp = false;
  typeCBstore = false;

  isUserCooptantValid = true;

  details1 : string;
  details2 : string;
  details3 : string;

  filteredMembre$: Observable<CustomerAutocomplete[]> = null;
  valueMember: string;

  @Output() onChangeFirstCanal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onUpdateAcquistionCanal: EventEmitter<AcquisitionCanalVO> = new EventEmitter<AcquisitionCanalVO>();

  constructor(private readonly route: ActivatedRoute,
    private readonly customerService: CustomerService,
    private readonly userService: UserService) { }

  ngOnInit() {
    this.initDefaultValues();

        /*------------------get resolvers ---------------------------*/
        this.route.data.subscribe(resolversData => {
          /*------------------get list canaux---------------------------*/
          this.canaux = this.canaux.concat(this.defaultReferenceValue).concat(resolversData['canaux']);
          /*------------------get list stores---------------------------*/
          this.stores = this.stores.concat(this.defaultReferenceValue).concat(resolversData['stores'].sort((a, b) => a.label.localeCompare(b.label)));
          /*------------------get list storesCompany---------------------------*/
          this.storesCompany = this.storesCompany.concat(this.defaultReferenceValue).concat(resolversData['storesCompany'].sort((a, b) => a.label.localeCompare(b.label)));
          /*------------------get list businessCanal---------------------------*/
          this.businessCanal = this.businessCanal.concat(this.defaultReferenceValue).concat(resolversData['businessCanal'].sort((a, b) => a.label.localeCompare(b.label)));
          /*------------------get list marketingCanal---------------------------*/
          this.marketingCanal = this.marketingCanal.concat(this.defaultReferenceValue).concat(resolversData['marketingCanal'].sort((a, b) => a.label.localeCompare(b.label)));
          /*------------------get list sponsorCanal---------------------------*/
          this.sponsorCanal = this.sponsorCanal.concat(this.defaultReferenceValue).concat(resolversData['sponsorCanal'].sort((a, b) => a.label.localeCompare(b.label)));
         
          this.initMembre();
          //Positionner les liste des vendeurs et responsables boutiques.
          this.userService.getUsersActifByIdRole('VENDEUR BOUTIQUE', 1).subscribe((refStoreSellers) => {
            this.refStoreSellers = this.refStoreSellers.concat(this.defaultUser).concat(refStoreSellers);
            this.userService.getUsersActifByIdRole('RESPONSABLE BOUTIQUE', 1).subscribe((refStoreResps) => {
              this.refStoreResps = this.refStoreResps.concat(this.defaultUser).concat(refStoreResps);
              //Positionner les liste des coachs et vente
              this.userService.getUsersActifByIdRole('COACH', 1).subscribe((refCoachs) => {
                this.refCoachs = this.refCoachs.concat(this.defaultUser).concat(refCoachs);
                this.userService.getUsersActifByIdRole('VENTE', 1).subscribe((refVentes) => {
                  this.refVentes = this.refVentes.concat(this.defaultUser).concat(refVentes);
                  this.setDataOfCanals();
                });
              });
            });
          });
          
        });
  }

  //Positionner la valeur Tous sur les combos par defaut
  initDefaultValues(){
    this.defaultReferenceValue.label ='--';
    this.defaultReferenceValue.id =0;

    this.defaultUser.lastName = '--'; 
    this.defaultUser.id = 0;
  }

  setDataOfCanals(){
    if(this.numberCanal === 0){
      this.labelCanal = "Canal";
    } else if(this.numberCanal === 1){
      this.labelCanal = "Second canal";
    }
          
    // on affiche le second canal que si il y a un second canal et que le premier canal a un canal choisi
    if(this.numberCanal === 0 && this.getChoisedAcquisitionsCanals(0) !== null ){
      this.firstCanalChanged = !isNullOrUndefined(this.getChoisedAcquisitionsCanals(0).canalKey);
      this.onChangeFirstCanal.emit(this.firstCanalChanged);
    } 
    this.acquisitionCanal=this.getChoisedAcquisitionsCanals(this.numberCanal);
    if( this.acquisitionCanal !== null ) {
      
      //Canal
      this.firstCanalControl.setValue(this.canaux.filter(currentCanal => 
        (this.acquisitionCanal !== null && this.acquisitionCanal.canalKey !== null && currentCanal.key === this.acquisitionCanal.canalKey))[0]);
      
      //Type canal
      if (this.acquisitionCanal.typeKey !== null && this.acquisitionCanal.canalKey !== null){
        this.manageTypeCB(this.acquisitionCanal.canalKey,this.acquisitionCanal.typeKey);
      }
       
      // les champs de texte de precison
      this.details1 = this.acquisitionCanal.details1;
      this.details2 = this.acquisitionCanal.details2;
      this.details3 = this.acquisitionCanal.details3;
      
      // user cooptant
      this.userCooptatorId=this.acquisitionCanal.userId;
      
      //Cooptation
      this.customerService.autoCompleteClient(this.acquisitionCanal.customerOtherNicheIdentifier, 1, [],"", true).subscribe( data => {
       this.membreControl.setValue(data.filter(member => 
        (this.acquisitionCanal.customerOtherId != null && this.acquisitionCanal.customerOtherId === member.id))[0]);
          //Positionner les valeurs selon le canal choisi
        this.updateCanalForm(false, false);
        this.storeSellers = this.manageUserRespStoreCB(this.userStoreControl,this.refStoreSellers, this.acquisitionCanal.typeKey, this.acquisitionCanal.userId);
        this.storeResps = this.manageUserRespStoreCB(this.userRespControl,this.refStoreResps, this.acquisitionCanal.typeKey , this.acquisitionCanal.otherUserId);
        this.updateAcquistionsCanaux();
      });

     } else {
      this.firstCanalControl.setValue(this.defaultReferenceValue);
    }
  }

  getChoisedAcquisitionsCanals(number:number){
    if(this.acquisitionsCanaux!=null && this.acquisitionsCanaux.length>number && this.acquisitionsCanaux[number]!=null){
      return (this.acquisitionsCanaux[number]);
    }
    return null;
  }

  updateCanalForm(changed:boolean, changeTypeCanal: boolean) {
    if(changed){
      //une fois le premiemr canal est non mentionne alors le second canal est hidé
      //Si premier est selectionne alors faire apparaitre le second
      //ceci est valable lors de changement de premier canal
      if(this.numberCanal === 0 && this.firstCanalControl.value.id !== this.defaultReferenceValue.id){
        this.onChangeFirstCanal.emit(true);
      } else {
        this.onChangeFirstCanal.emit(false);
      }

      //RG : Pour supprimer le contenu du champ nom cooptant, il faut cliquer sur la croix ou sélectionner
      // un canal autre que "Cooptation coach" ou "Cooptation vente".
      if(!(this.firstCanalControl.value.key==='ref_contact_canal_coop_coach_04112011' 
        || this.firstCanalControl.value.key==='ref_contact_canal_coop_vente_04112011'
        || this.firstCanalControl.value.key==='ref_contact_canal_accroissement_de_portefeuille')){
          this.membreControl.setValue(null);
          this.membreControl.markAsTouched();
      } else if(isNullOrUndefined(this.membreControl.value)){
        this.membreControl.setValue(null);
        this.membreControl.markAsTouched();
      }
      //Rg lorsqu'on change le canal, user cooptant est initialise
      this.userCooptatorId=0;
      this.userCooptantControl.setValue(this.defaultUser);
      this.isUserCooptantValid = false;

      this.details1 = "";
      this.details2 = "";
      this.details3 = "";

      let custoRefType:string=null;
      if(changeTypeCanal){
        if(this.typeCBstoreControl.value != null && this.typeCBstoreControl.value.id !== 0
          && this.typeCBstoreControl.value.id !== null){
          custoRefType = this.typeCBstoreControl.value.key; 
        } else {
          this.typeCBstoreControl.setValue(this.defaultReferenceValue);
          this.typeCBstoreCompControl.setValue(this.defaultReferenceValue);
          this.typeCBSponsorControl.setValue(this.defaultReferenceValue);
          this.typeCBbusinessControl.setValue(this.defaultReferenceValue);
          this.typeCBMarketingControl.setValue(this.defaultReferenceValue);
        }
      } else {
        this.typeCBstoreControl.setValue(this.defaultReferenceValue);
        this.typeCBstoreCompControl.setValue(this.defaultReferenceValue);
        this.typeCBSponsorControl.setValue(this.defaultReferenceValue);
        this.typeCBbusinessControl.setValue(this.defaultReferenceValue);
        this.typeCBMarketingControl.setValue(this.defaultReferenceValue);
      }

      this.storeSellers = this.manageUserRespStoreCB(this.userStoreControl,this.refStoreSellers, custoRefType, -1);
      this.storeResps = this.manageUserRespStoreCB(this.userRespControl,this.refStoreResps, custoRefType , -1);
    }

    this.showTypeCanal = false;
    this.showDetail1 = false;
    this.showDetail2 = false;
    this.showDetail3 = false;
    this.showCustomerOther = false;
    this.showUserCooptant = false;
    this.typeCBstore = false;
    this.typeCBstoreComp = false;
    this.typeCBMarketing = false;
    this.typeCBbusiness = false;
    this.typeCBSponsor = false;
    this.showUserStore = false;
    this.showUserResp = false;
    
    if(!isNullOrUndefined(this.firstCanalControl.value)){
      switch (this.firstCanalControl.value.key) {
        case 'ref_contact_canal_10':
          this.labelTypeCanal = 'Type d\'agence';
          this.showTypeCanal = true;
          this.typeCBstore = true;
          this.typesCanal = this.stores;
          this.labelUserStore = 'Vendeur agence';
          this.showUserStore = true;
          this.labelUserResp = 'Responsable agence';
          this.showUserResp = true;
          break;
        case 'ref_contact_canal_store_company_04112011':
          this.labelTypeCanal = 'Type d\'agence entreprise';
          this.showTypeCanal = true;
          this.typeCBstoreComp = true;
          this.typesCanal = this.storesCompany;
          break;
        case 'ref_contact_canal_40':
          this.labelTypeCanal = 'Type d\'apporteur';
          this.showTypeCanal = true;
          this.typeCBbusiness = true;
          this.typesCanal = this.businessCanal;
          this.showDetail1 = true;
          this.lablDetail1 = 'Nom de l\'apporteur';
          this.showDetail2 = true;
          this.lablDetail2 = 'Prénom de l\'apporteur';
          break;
        case 'ref_contact_canal_69':
          this.showCustomerOther = true;       
          break;
        case 'ref_contact_canal_accroissement_de_portefeuille' :
        case 'ref_contact_canal_coop_coach_04112011':
          this.showCustomerOther = true;
          this.showUserCooptant = true;
          this.manageUserCooptCB(this.refCoachs, null);
          break;
        case 'ref_contact_canal_coop_vente_04112011':
          this.showCustomerOther = true; 
          this.showUserCooptant = true;
          this.manageUserCooptCB(this.refVentes, null);
          break;
        case 'ref_contact_canal_96':
          this.labelTypeCanal = 'Type de marketing';
          this.showTypeCanal = true;
          this.typeCBMarketing = true;
          this.typesCanal = this.marketingCanal;
          this.showDetail1 = true;
          this.lablDetail1 = 'Précision';
          break;
        case 'ref_contact_canal_120':
          this.labelTypeCanal = 'Type de parrainage';
          this.showTypeCanal = true;
          this.typeCBSponsor = true;
          this.typesCanal = this.sponsorCanal;
          this.showDetail1 = true;
          this.lablDetail1 = 'Nom du parrain';
          this.showDetail2 = true;
          this.lablDetail2 = 'Prénom du parrain';
          break;
        default:
          break;
      }
    }

    //on ne fait lupdate de lobjet ke pour le cas de modification, car pour linitialisation il faut 
    //initialiser tous les champs puis unpdater les objets
    if(changed){
      this.updateAcquistionsCanaux();
    }
  }
    
  /**
   * traitement membre 
   */
  initMembre() {
    this.filteredMembre$ = this.membreControl.valueChanges.pipe(
      startWith(''),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (!isNullOrUndefined(value) && value !== '' && value.length > 2) {
          // lookup 
          return this.lookup(value);
        } else {
          // if no value is present, return null
          return of(null);
        }
      })
    );
  }

  lookup(value: string): Observable<CustomerAutocomplete[]> {
    const status = [];
    this.valueMember = value;
    return this.customerService.autoCompleteClient(value, 1, status,"", false).pipe(
      map(results =>  results),
      catchError(_ => {
        return of(null);
      })
      );
   }

   afficherNumContrat(value: string): string {
    if(!isNullOrUndefined(value)) {
     return `N° contrat ${value}`;
    }
    return '';
  }
  
  displayClient(value: any): string {
    return value ? value.name : '';
  }
  
  manageUserCooptCB(src:UserVo[], dest:UserVo[]):void {
    if (dest == null) {
      dest = [];
      dest = dest.concat(src);
    }
    this.usersCooptant = dest;
    
    if (this.userCooptatorId > 0) {
      this.userCooptantControl.setValue(dest.filter(currentUser => 
        (currentUser.id === this.userCooptatorId))[0]);
    }
  }
   
  manageUserRespStoreCB(formControl: FormControl, userList:UserVo[], customerRefType:string, userIdToSet:number) {
        
    formControl.setValue(this.defaultUser);
    let userToSet:UserVo = null;
    let filteredUserList:UserVo[] = [];
    filteredUserList.push(this.defaultUser);
    for(const user of userList) {
      if (user.id !== 0 && user.id !== null && user.canalType !== null && user.canalType.key === customerRefType) {
        filteredUserList.push(user);
      }
      if(user.id === userIdToSet){
        userToSet = user;
      }
    }
    if(filteredUserList == null || !(filteredUserList.length > 1)){
      filteredUserList= userList;
    }
    
    if(userToSet != null){
      formControl.setValue(userToSet);
    }
    return filteredUserList;
  }

  manageTypeCB(canalKey:string,typeKey:string):void{
    if(!isNullOrUndefined(canalKey)){
      
      switch (canalKey){
        case 'ref_contact_canal_10':
          this.typesCanal = this.stores;
          if( this.typesCanal !=null && this.typesCanal.length >0){
            this.typeCBstoreControl.setValue(this.typesCanal.find(currentTypeCanal => 
              (typeKey != null && currentTypeCanal.key === typeKey)));
          }
          break;
        case 'ref_contact_canal_store_company_04112011':
          this.typesCanal = this.storesCompany;
          if( this.typesCanal !=null && this.typesCanal.length >0){
            this.typeCBstoreCompControl.setValue(this.typesCanal.find(currentTypeCanal => 
              (typeKey != null && currentTypeCanal.key === typeKey)));
          }
          break;
        case 'ref_contact_canal_40':
          this.typesCanal = this.businessCanal;
          if( this.typesCanal !=null && this.typesCanal.length >0){
            this.typeCBbusinessControl.setValue(this.typesCanal.find(currentTypeCanal => 
              (typeKey != null && currentTypeCanal.key === typeKey)));
          }
          break;
        case 'ref_contact_canal_96':
          this.typesCanal = this.marketingCanal;
          if( this.typesCanal !=null && this.typesCanal.length >0){
            this.typeCBMarketingControl.setValue(this.typesCanal.find(currentTypeCanal => 
              (typeKey != null && currentTypeCanal.key === typeKey)));
          }
          break;
        case 'ref_contact_canal_120':
          this.typesCanal = this.sponsorCanal;
          if( this.typesCanal !=null && this.typesCanal.length >0){
            this.typeCBSponsorControl.setValue(this.typesCanal.find(currentTypeCanal => 
              (typeKey != null && currentTypeCanal.key === typeKey)));
          }
          break;
        default:
          break;
      }
     
    }
  }

  getCanalFromView():AcquisitionCanalVO{
    const acquisitionCanal= {} as AcquisitionCanalVO;
    // acquisitionCanal.id=this.idcanal;
    acquisitionCanal.numberCanal=this.numberCanal;
    if(!isNullOrUndefined(this.firstCanalControl.value) && !isNullOrUndefined(this.firstCanalControl.value.key)){
      acquisitionCanal.canalKey=this.firstCanalControl.value.key;
      // agence
      if(acquisitionCanal.canalKey==='ref_contact_canal_10'){
        if(!isNullOrUndefined(this.typeCBstoreControl.value)){
          acquisitionCanal.typeKey=this.typeCBstoreControl.value.key;
        }
        if(this.userStoreControl.value !== null && this.userStoreControl.value.id !== 0){
          acquisitionCanal.userId = this.userStoreControl.value.id;	
        }
        if(this.userRespControl.value !== null && this.userRespControl.value.id !== 0){
          acquisitionCanal.otherUserId = this.userRespControl.value.id;	
        }
        // agence entreprise	
      }else if(acquisitionCanal.canalKey==='ref_contact_canal_store_company_04112011'){
        if(!isNullOrUndefined(this.typeCBstoreCompControl)){
          acquisitionCanal.typeKey=this.typeCBstoreCompControl.value.key;
        }
        // aporteur ou parainage
      }else if(acquisitionCanal.canalKey=== 'ref_contact_canal_40'){
        if(!isNullOrUndefined(this.typeCBbusinessControl.value)){
          acquisitionCanal.typeKey=this.typeCBbusinessControl.value.key;
        }
        acquisitionCanal.details1=this.details1;
        acquisitionCanal.details2=this.details2;
      }else if(acquisitionCanal.canalKey==='ref_contact_canal_120'){
        if(!isNullOrUndefined(this.typeCBSponsorControl)){
          acquisitionCanal.typeKey=this.typeCBSponsorControl.value.key;
        }
        acquisitionCanal.details1=this.details1;
        acquisitionCanal.details2=this.details2;
        // marketing	
      }else if(acquisitionCanal.canalKey==='ref_contact_canal_96'){
        if(!isNullOrUndefined(this.typeCBMarketingControl)){
          acquisitionCanal.typeKey=this.typeCBMarketingControl.value.key;
        }
        acquisitionCanal.details1=this.details1;
        // cooptation vente ou coach	
      }else if(acquisitionCanal.canalKey==='ref_contact_canal_coop_coach_04112011' || acquisitionCanal.canalKey==='ref_contact_canal_coop_vente_04112011'
        || acquisitionCanal.canalKey==='ref_contact_canal_accroissement_de_portefeuille' ){
          if(!isNullOrUndefined(this.membreControl.value)){
            acquisitionCanal.customerOtherId=this.membreControl.value.id;
            acquisitionCanal.customerOtherFullName=this.membreControl.value.name;
            acquisitionCanal.customerOtherNicheIdentifier=this.membreControl.value.nicheIdentifier;
          }
          //  else {
          //   acquisitionCanal.customerOtherId=this.membreControl.value.id;
          //   acquisitionCanal.customerOtherFullName=this.membreControl.value.name;
          // }
        if(this.userCooptantControl.value!==null){
          acquisitionCanal.userId=this.userCooptantControl.value.id;
        }
      } else if(acquisitionCanal.canalKey=== 'ref_contact_canal_69' && !isNullOrUndefined(this.membreControl.value)){
        acquisitionCanal.customerOtherId=this.membreControl.value.id;
        acquisitionCanal.customerOtherFullName=this.membreControl.value.name;
        acquisitionCanal.customerOtherNicheIdentifier=this.membreControl.value.nicheIdentifier;
      }

    }
    
    return acquisitionCanal;
  }

  checkUserCooptValidation(){
    this.isUserCooptantValid = false;
    if(!isNullOrUndefined(this.userCooptantControl.value) && this.userCooptantControl.value.id !== 0){
      this.isUserCooptantValid = true;
    }
    this.updateAcquistionsCanaux();
  }

  validateAcquisitionCanal(){
    // cooptation vente ou coach	
    if(this.acquisitionCanal.canalKey==='ref_contact_canal_coop_coach_04112011' || this.acquisitionCanal.canalKey==='ref_contact_canal_coop_vente_04112011'
        || this.acquisitionCanal.canalKey==='ref_contact_canal_accroissement_de_portefeuille' ){
      if(isNullOrUndefined(this.userCooptantControl.value)){
        //ici afficher la ligne de user cooptant en haut
        return false;
      }
      if(isNullOrUndefined(this.acquisitionCanal.customerOtherId)){
        //ici afficher la ligne de nom cooptant en haut
        return false;
      }
    }
    return true;
  }

  updateAcquistionsCanaux(){
    this.onUpdateAcquistionCanal.emit(this.getCanalFromView());
  }
}
