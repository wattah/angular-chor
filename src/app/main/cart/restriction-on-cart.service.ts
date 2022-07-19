import { ABANDON_PERMISSIONS, DELIVERED_PERMISSIONS, READY_DELIVER_PERMISSIONS, ESTIMATE_SENT_PERMISSIONS, VALIDATE_PERMISSIONS, AWAINTING_APPROVEL_PERMISSIONS, PENDING_PERMISSIONS, STATUS_CART, DEBLOQUER_PANIER } from './../../_core/constants/constants';
import { GassiMockLoginService } from './../../_core/services';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class RestrictionOnCart{
    visibleActionsOnLogistic = false;
    visibleActionsOnDevis = true;
    visibleActionsOnLivraison = false;
    visibleActionsForCoachAndDesk = true;
    visibleActionsOnSAV = false;
    visibleActionsOnResumePanier = false;
    visibleActionsOnArticle = true;
    NameOfrole = "RESSOURCES";
    visibleActionOnUnblocking = false;

    setRestrictionByCartPhaseAndUserRole(mockLoginService: GassiMockLoginService , status: string) {
        switch (status) {
          case STATUS_CART.PENDING:
            this.setRestrictionForPendingPhase(mockLoginService);
          break;
          case STATUS_CART.AWAITING_APPROVAL:
            this.setRestrictionForApprovalPhase(mockLoginService);
          break;
          case STATUS_CART.VALIDATE:
            this.setRestrictionForValidationPhase(mockLoginService);
          break;
          case STATUS_CART.ESTIMATE_SENT:
            this.setRestrictionForEstimateSentPhase(mockLoginService);
          break;
          case STATUS_CART.READY_DELIVER:
            this.setRestrictionForReadyDeliveryPhase(mockLoginService);
          break;
          case STATUS_CART.DELIVERED:
            this.setRestrictionForDeliveryPhase(mockLoginService);
          break;
          case STATUS_CART.ABANDON:
            this.setRestrictionForAbondonPhase(mockLoginService);
          break;
          default:
            break;
        }
    }

    setRestrictionForAbondonPhase(mockLoginService: GassiMockLoginService) {
        mockLoginService.getCurrentConnectedUser().subscribe((user) => {
            if (this.userHasPermissions(user)) {
                this.visibleActionsOnLogistic = user.activeRole.permissions.includes(ABANDON_PERMISSIONS.LOGISTIQUE);
                this.visibleActionsOnSAV = user.activeRole.permissions.includes(ABANDON_PERMISSIONS.SAV);
                this.visibleActionsOnResumePanier = user.activeRole.permissions.includes(ABANDON_PERMISSIONS.RESUME_PANIER);
                this.visibleActionsOnDevis = user.activeRole.permissions.includes(ABANDON_PERMISSIONS.DEVIS);
                this.visibleActionsOnLivraison = !user.activeRole.permissions.includes(ABANDON_PERMISSIONS.LIVRAISON);
                this.visibleActionsOnArticle = user.activeRole.permissions.includes(ABANDON_PERMISSIONS.ARTICLE);
                this.visibleActionsForCoachAndDesk = user.activeRole.permissions.includes(ABANDON_PERMISSIONS.FACTURATION);
                this.visibleActionOnUnblocking = user.activeRole.permissions.includes(DEBLOQUER_PANIER);
            }
        });
    }

    setRestrictionForDeliveryPhase(mockLoginService: GassiMockLoginService) {
        mockLoginService.getCurrentConnectedUser().subscribe((user) => {
            if (this.userHasPermissions(user)) {
                this.visibleActionsOnLogistic = user.activeRole.permissions.includes(DELIVERED_PERMISSIONS.LOGISTIQUE);
                this.visibleActionsOnSAV = user.activeRole.permissions.includes(DELIVERED_PERMISSIONS.SAV);
                this.visibleActionsOnResumePanier = user.activeRole.permissions.includes(DELIVERED_PERMISSIONS.RESUME_PANIER);
                this.visibleActionsOnDevis = user.activeRole.permissions.includes(DELIVERED_PERMISSIONS.DEVIS);
                this.visibleActionsOnLivraison = !user.activeRole.permissions.includes(DELIVERED_PERMISSIONS.LIVRAISON);
                this.visibleActionsOnArticle = user.activeRole.permissions.includes(DELIVERED_PERMISSIONS.ARTICLE);
                this.visibleActionOnUnblocking = user.activeRole.permissions.includes(DEBLOQUER_PANIER);
                if(user.activeRole !== null && user.activeRole.roleName !== null && user.activeRole.roleName === this.NameOfrole){
                    this.visibleActionsForCoachAndDesk = true;
                }else{
                    this.visibleActionsForCoachAndDesk = user.activeRole.permissions.includes(DELIVERED_PERMISSIONS.FACTURATION);
                }
            }
        });
    }
    setRestrictionForReadyDeliveryPhase(mockLoginService: GassiMockLoginService) {
        mockLoginService.getCurrentConnectedUser().subscribe((user) => {
            if (this.userHasPermissions(user)) {
                this.visibleActionsOnLogistic = user.activeRole.permissions.includes(READY_DELIVER_PERMISSIONS.LOGISTIQUE);
                this.visibleActionsOnSAV = user.activeRole.permissions.includes(READY_DELIVER_PERMISSIONS.SAV);
                this.visibleActionsOnResumePanier = user.activeRole.permissions.includes(READY_DELIVER_PERMISSIONS.RESUME_PANIER);
                this.visibleActionsOnDevis = user.activeRole.permissions.includes(READY_DELIVER_PERMISSIONS.DEVIS);
                this.visibleActionsOnArticle = user.activeRole.permissions.includes(READY_DELIVER_PERMISSIONS.ARTICLE);
                this.visibleActionsOnLivraison = !user.activeRole.permissions.includes(READY_DELIVER_PERMISSIONS.LIVRAISON);
                this.visibleActionsForCoachAndDesk = user.activeRole.permissions.includes(READY_DELIVER_PERMISSIONS.FACTURATION);
                this.visibleActionOnUnblocking = user.activeRole.permissions.includes(DEBLOQUER_PANIER);
            }
        });
    }
    setRestrictionForEstimateSentPhase(mockLoginService: GassiMockLoginService) {
        mockLoginService.getCurrentConnectedUser().subscribe((user) => {
            if (this.userHasPermissions(user)) {
                this.visibleActionsOnLogistic = user.activeRole.permissions.includes(ESTIMATE_SENT_PERMISSIONS.LOGISTIQUE);
                this.visibleActionsOnSAV = user.activeRole.permissions.includes(ESTIMATE_SENT_PERMISSIONS.SAV);
                this.visibleActionsOnResumePanier = user.activeRole.permissions.includes(ESTIMATE_SENT_PERMISSIONS.RESUME_PANIER);
                this.visibleActionsOnDevis = user.activeRole.permissions.includes(ESTIMATE_SENT_PERMISSIONS.DEVIS);
                this.visibleActionsOnArticle = user.activeRole.permissions.includes(ESTIMATE_SENT_PERMISSIONS.ARTICLE);
                this.visibleActionsOnLivraison = !user.activeRole.permissions.includes(ESTIMATE_SENT_PERMISSIONS.LIVRAISON);
                this.visibleActionsForCoachAndDesk = user.activeRole.permissions.includes(ESTIMATE_SENT_PERMISSIONS.FACTURATION);
                this.visibleActionOnUnblocking = user.activeRole.permissions.includes(DEBLOQUER_PANIER);
            }
        });
    }
    setRestrictionForValidationPhase(mockLoginService: GassiMockLoginService) {
        mockLoginService.getCurrentConnectedUser().subscribe((user) => {
            if (this.userHasPermissions(user)) {
                this.visibleActionsOnLogistic = user.activeRole.permissions.includes(VALIDATE_PERMISSIONS.LOGISTIQUE);
                this.visibleActionsOnSAV = user.activeRole.permissions.includes(VALIDATE_PERMISSIONS.SAV);
                this.visibleActionsOnResumePanier = user.activeRole.permissions.includes(VALIDATE_PERMISSIONS.RESUME_PANIER);
                this.visibleActionsOnArticle = user.activeRole.permissions.includes(VALIDATE_PERMISSIONS.ARTICLE);
                this.visibleActionsOnDevis = user.activeRole.permissions.includes(VALIDATE_PERMISSIONS.DEVIS);
                this.visibleActionsOnLivraison = !user.activeRole.permissions.includes(VALIDATE_PERMISSIONS.LIVRAISON);
                this.visibleActionsForCoachAndDesk = user.activeRole.permissions.includes(VALIDATE_PERMISSIONS.FACTURATION);
                this.visibleActionOnUnblocking = user.activeRole.permissions.includes(DEBLOQUER_PANIER);
            }
        });
    }
    setRestrictionForApprovalPhase(mockLoginService: GassiMockLoginService) {
        mockLoginService.getCurrentConnectedUser().subscribe((user) => {
            if (this.userHasPermissions(user)) {
                this.visibleActionsOnLogistic = user.activeRole.permissions.includes(AWAINTING_APPROVEL_PERMISSIONS.LOGISTIQUE);
                this.visibleActionsOnSAV = user.activeRole.permissions.includes(AWAINTING_APPROVEL_PERMISSIONS.SAV);
                this.visibleActionsOnResumePanier = user.activeRole.permissions.includes(AWAINTING_APPROVEL_PERMISSIONS.RESUME_PANIER);
                this.visibleActionsOnArticle = user.activeRole.permissions.includes(AWAINTING_APPROVEL_PERMISSIONS.ARTICLE);
                this.visibleActionsOnDevis = user.activeRole.permissions.includes(AWAINTING_APPROVEL_PERMISSIONS.DEVIS);
                this.visibleActionsOnLivraison = !user.activeRole.permissions.includes(AWAINTING_APPROVEL_PERMISSIONS.LIVRAISON);
                this.visibleActionsForCoachAndDesk = user.activeRole.permissions.includes(AWAINTING_APPROVEL_PERMISSIONS.FACTURATION);
                this.visibleActionOnUnblocking = user.activeRole.permissions.includes(DEBLOQUER_PANIER);
            }
        });
    }
    setRestrictionForPendingPhase(mockLoginService: GassiMockLoginService) {
        mockLoginService.getCurrentConnectedUser().subscribe((user) => {
            if (this.userHasPermissions(user)) {
                this.visibleActionsOnLogistic = user.activeRole.permissions.includes(PENDING_PERMISSIONS.LOGISTIQUE);
                this.visibleActionsOnSAV = user.activeRole.permissions.includes(PENDING_PERMISSIONS.SAV);
                this.visibleActionsOnResumePanier = user.activeRole.permissions.includes(PENDING_PERMISSIONS.RESUME_PANIER);
                this.visibleActionsOnDevis = user.activeRole.permissions.includes(PENDING_PERMISSIONS.DEVIS);
                this.visibleActionsOnLivraison = !user.activeRole.permissions.includes(PENDING_PERMISSIONS.LIVRAISON);
                this.visibleActionsOnArticle = user.activeRole.permissions.includes(PENDING_PERMISSIONS.ARTICLE);
                this.visibleActionsForCoachAndDesk = user.activeRole.permissions.includes(PENDING_PERMISSIONS.FACTURATION);
                this.visibleActionOnUnblocking = user.activeRole.permissions.includes(DEBLOQUER_PANIER);
            }
        });
    }
    private userHasPermissions(user: any) {
        return user && user.activeRole && user.activeRole.permissions;
    }
}