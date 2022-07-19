import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class RedirectionService{

    permissions: Array<string>;
    private readonly currentPermissions$ = new BehaviorSubject(null);
    private readonly agGridLoader$ = new BehaviorSubject(null);
    private logout = false;
    private isClickOnDeconnexion = false;
    private sessionTimeout = false;
    private readonly isLogin$ = new BehaviorSubject(true);
    private readonly allowSwitchingRole$ = new BehaviorSubject(true);

    constructor(private readonly router: Router){}

    public hasRigth(localtion: string , permission: string){
        if(this.isValidLocationWithPermission(localtion ,permission)){
            this.router.navigate(['/']);
        }
    }
    private isValidLocationWithPermission(location: string , permission: string) {
        const currentURL = this.router.url;
        return currentURL.indexOf(location) !== -1 && !this.permissions.includes(permission);
    }

    public hasPermission(permission: string){
        return this.permissions.includes(permission);
    }

    public getCurrentPermissions(){
        return this.currentPermissions$;
    }
    public setCurrentPermissions(permissions: Array<string>){
        this.currentPermissions$.next(permissions);
    }

    public getAgGridLoader(){
        return this.agGridLoader$;
    }
    public setAgGridLoader(load: boolean){
        this.agGridLoader$.next(load);
    }

    public activeRights(){
        this.hasRigth('/customer-dashboard/entreprise' ,  'consultation_fiche360');
        this.hasRigth('/customer-dashboard/particular' ,  'consultation_fiche360');
        this.hasRigth('/parcours' , 'creation_parcours');
        this.hasRigth('/task-creation' , 'ajout_demande');
        this.hasRigth('/add-absence' , 'afficher_absences');
        this.hasRigth('/absence-monitoring' , 'afficher_absences');
        this.hasRigth('/hardware-park-item/add' , 'ajout_service_materiel');
        this.hasRigth('/hardware-park-item/update' , 'modifier_service_materiel');
        this.hasRigth('/task-monitoring' , 'affichage_taches');
        this.hasRigth('/request-monitoring' , 'affichage_demandes');
        this.hasRigth('detail/request', 'affichage_demandes');
        this.hasRigth('request/creation' , 'creation_parcours');
        this.hasRigth('interaction/creation-360' , 'ajout_interaction');
        this.hasRigth('interaction/creation' , 'ajout_interaction');
        this.hasRigth('/sending-sms' , 'envoyer_sms');
        this.hasRigth('/mail-sending' , 'envoyer_mails');  
        this.hasRigth('/modifyTask' , 'modification_taches');
        this.hasRigth('/detail/request/' , 'affichage_demandes');
    }
    public setLogout(logout){
        this.logout = logout;
    }

    public getLogout(){
        return this.logout;
    }

    public setLogin(login){
        this.isLogin$.next(login)
    }

    public getLogin(){
        return this.isLogin$;
    }

    clickOnDeconnexion(isClickOnDeconnexion){
        this.isClickOnDeconnexion = isClickOnDeconnexion;
    }
    
    getActionOnDeconnexion(){
        return this.isClickOnDeconnexion;
    }

    setSessionTimeout(sessionTimeout){
        this.sessionTimeout = sessionTimeout;
    }
    
    getSessionTimeout(){
        return this.sessionTimeout;
    }

    setAllowSwitchingRole(allowSwitchingRole: boolean){
        this.allowSwitchingRole$.next(allowSwitchingRole)
    }

    getAllowSwitchingRole(): BehaviorSubject<boolean>{
        return this.allowSwitchingRole$;
    }

}