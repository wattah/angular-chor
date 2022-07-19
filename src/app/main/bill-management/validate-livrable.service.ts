import { RELOOKING_ERROR_CLASS_NAME, GENERATION_FILE_IMPOSSIBLE,
  ARCHIVED_FILE_MESSAGE, RELOOKING_WARNING_CLASS_NAME,
  SUCCESS_RELOOKING_CLASS_NAME, BILL, SUCCESS_RELOOKING_MESSAGE,
  RELOOKING_WITH, ERRORS, WARNINGS, DETAIL_MESSAGE,
  UNEXPECTED_STATUS_MESSAGE, IS_ALREADY_ARCHIVED_BILL_MESSAGE,
  PROBLEM_ON_LIVRABLE_MESSAGE, STATUS_BILL_MESSAGE,
  NOT_ALLOW_ARCHIVAGE_MESSAGE, INVALID_CF_STATUS_MESSAGE, MESSAGE_CONFIRMATION } from '../../_core/constants/bill-constant';
import { PenicheLigneErreurAndWariningResponseVO } from './../../_core/models/peniche-ligne-erreur-response-vo';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { STATUT_LIVRABLE, TYPE_BIll, ARCHIVABLE_STATUT_LIVRABLE, ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE } from './../../_core/constants/constants';
import { LivrableVO } from './../../_core/models/livrable-vo';
import { Injectable } from '@angular/core';
import { RelookingPopupConfirmationComponent } from '../../_shared/components/relooking/relooking-popup-confirmation/relooking-popup-confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class ValidateLivrableService {
  nbFichiersMauvaisStatus = 0;
  toRelookingLivrables: Array<LivrableVO> = [];
  messages: string[] = [];
  callNum = 0;
  hasChose = false;
  constructor( private readonly modalService: NgbModal ) { }

  async validateLivrableToBeRelooked(){
    this.messages = [];
    if(this.toRelookingLivrables && this.toRelookingLivrables.length !== 0){
      this.nbFichiersMauvaisStatus = 0;
      for(let livrable of this.toRelookingLivrables){
        await this.livrablProcess(livrable)
      }
      this.livrablToReProcess();
    }
  }

  async livrablProcess(livrable: LivrableVO) {
    if (!livrable.archive) {
      await this.notArchivedLivrable(livrable);
    } else {
      this.archivedLivrable(livrable);
    }
  }

  private livrablToReProcess(): void {
    if (this.toReprocess()) {
      this.validateLivrableToBeRelooked();
    } else {
      this.toRelookingLivrablesWithBadStatus();
    }
  }

  async notArchivedLivrable(livrable: LivrableVO){
    if (this.toBeRegenerated(livrable)) {
      await this.openConfirmationPopupAndChose(livrable);
    } else {
      this.nbFichiersMauvaisStatus++;
      this.removeLivrable(livrable);
    }
  }

  async openConfirmationPopupAndChose(livrable: LivrableVO) {
    const model = this.modalService.open(RelookingPopupConfirmationComponent, {centered: true,});
    model.componentInstance.message = `${MESSAGE_CONFIRMATION} ${livrable.label} ?`;
    const chose = await model.result;
    if(chose){
      this.toRelookingLivrables.forEach(livrableToUpdate=>{
        if(livrableToUpdate === livrable){
          livrableToUpdate.livrableStatus = STATUT_LIVRABLE.DONNEES_STOCKEES;
        }
      });
    }else{
      this.removeLivrable(livrable);
    }
  }
  private toRelookingLivrablesWithBadStatus(): void {
    if (this.nbFichiersMauvaisStatus > 0) {
      this.messages.unshift(this.relookingErrorMessage());
    }
  }

  private archivedLivrable(livrable: LivrableVO): void {
    this.nbFichiersMauvaisStatus++;
    this.messages.unshift(this.createSpanElement(this.getfileGenerationMessage(livrable) , RELOOKING_ERROR_CLASS_NAME));
    this.removeLivrable(livrable);
  }

  private getfileGenerationMessage(livrable: any): any {
    return `${GENERATION_FILE_IMPOSSIBLE} ${livrable.fichierOriginal} ${ARCHIVED_FILE_MESSAGE}.`;
  }

  private removeLivrable(livrable: LivrableVO): void {
    this.toRelookingLivrables = this.toRelookingLivrables.filter(livrableoToBeRemoved=> livrableoToBeRemoved !== livrable);
  }

  private toBeRegenerated(livrable: LivrableVO): boolean {
    return (livrable.livrableStatus == STATUT_LIVRABLE.GENERE) ||
    (livrable.livrableStatus == STATUT_LIVRABLE.GENERE_WARNING) ||
    (livrable.livrableStatus === STATUT_LIVRABLE.DONNEES_STOCKEES) ||
    (livrable.livrableStatus == STATUT_LIVRABLE.GENERE_ERREUR);
  }

  private toReprocess(): LivrableVO {
    return this.toRelookingLivrables.find(livrable => livrable.livrableStatus !== STATUT_LIVRABLE.DONNEES_STOCKEES);
  }

  public getFormattedMessages(livrable: LivrableVO, messages: string[], errorNumber: number) {
    if (!livrable.libelleErreurTraitement) {
      if (!livrable.erreurs || livrable.erreurs.length === 0) {
        messages.unshift(this.getSuccessRelookingMessage(livrable.fichierOriginal));
      } else if (livrable.livrableStatus == STATUT_LIVRABLE.GENERE_WARNING) {
        messages.unshift(
          this.createRolookingWithWarningsAndErrorsMessage(
            livrable.fichierOriginal,
            livrable.erreurs ,errorNumber,
            RELOOKING_WARNING_CLASS_NAME,
            false
          )
        );
      } else if (livrable.livrableStatus == STATUT_LIVRABLE.GENERE_ERREUR) {
        messages.unshift(
          this.createRolookingWithWarningsAndErrorsMessage(livrable.fichierOriginal,
            livrable.erreurs,
            errorNumber,
            RELOOKING_ERROR_CLASS_NAME,
            true
          )
        );
      }
    } else {
      messages.unshift(
        this.createSpanElement(
          livrable.libelleErreurTraitement ,
          RELOOKING_ERROR_CLASS_NAME
        )
      );
    }
  }

  private getSuccessRelookingMessage(fichierOriginal: string): string {
    return `<span class=${SUCCESS_RELOOKING_CLASS_NAME}>${BILL}  ${fichierOriginal} ${SUCCESS_RELOOKING_MESSAGE} </span><br />`;
  }

  private createRolookingWithWarningsAndErrorsMessage(fichierOriginal: string, erreurs: PenicheLigneErreurAndWariningResponseVO[] , errorNumber: number , className , isError): string {
    return `<span class=${className}>${BILL}  ${fichierOriginal}  ${RELOOKING_WITH} ${erreurs ? erreurs.length:0} ${isError ? ERRORS:WARNINGS} dont ${errorNumber} ${DETAIL_MESSAGE}.</span><br />`;
  }

  private relookingErrorMessage(): string {
    return this.createSpanElement(
      `${this.nbFichiersMauvaisStatus} ${UNEXPECTED_STATUS_MESSAGE} `,
      RELOOKING_ERROR_CLASS_NAME
    );
  }

  private createSpanElement(message , className): string{
    return `<span class=${className}> ${message}. </span><br />`
  }
  /**
   * @author YFA
   * @param livrables 
   */
  validateLivrableToArchive(livrables: LivrableVO[]): number[]{
    const livrablesToSend = []
    this.messages = [];
    livrables = livrables.filter((livrable: LivrableVO)=>livrable.type !== TYPE_BIll.CR);// dans le cadre ce la us ATHENA-3954 on traite pas les CF
    livrables.forEach((livrable: LivrableVO)=>{
      if (livrable.archive) {
        this.messages.unshift(this.createSpanElement(
          IS_ALREADY_ARCHIVED_BILL_MESSAGE ,
          RELOOKING_ERROR_CLASS_NAME
        ));
      } else {
        if (livrable.type === TYPE_BIll.CR) {
          this.archiveCF(livrable);
        } else if (livrable.type === TYPE_BIll.FACTURE) {
          this.archiveFacture(livrable, livrablesToSend);
        } else {
          this.messages.unshift(this.createSpanElement(
            PROBLEM_ON_LIVRABLE_MESSAGE,
            RELOOKING_ERROR_CLASS_NAME
          ));
        }
      }
    });
    return livrablesToSend;
  }
  /**
   * @author YFA
   * @param livrable 
   * @param livrablesToSend 
   */
  private archiveFacture(livrable: LivrableVO, livrablesToSend: any[]) {
    if (this.isArchivable(livrable)) {
      livrablesToSend.push(livrable.id);
    } else {
      this.messages.unshift(`<span class=${RELOOKING_ERROR_CLASS_NAME}>${STATUS_BILL_MESSAGE} ${livrable.label} ${NOT_ALLOW_ARCHIVAGE_MESSAGE} .</span><br />`);
    }
  }

  /**
   * @author YFA
   * @param livrable 
   */
  private archiveCF(livrable: LivrableVO) {
    if (this.isArchivable(livrable)) {
      // compte rendu
    } else {
      this.messages.unshift(this.createSpanElement(INVALID_CF_STATUS_MESSAGE,RELOOKING_ERROR_CLASS_NAME));
    }
  }

  /**
   * @author YFA
   * @param livrable 
   */
  isArchivable(livrable: LivrableVO) : Boolean {
    if (!livrable.status || !livrable.livrableStatus) {
      return false;
    }
    return this.isArchivbleLivrableStatus(livrable.livrableStatus) && this.isArchivableLivrableSousStatus(livrable.status);
  }

  /**
   * @author YFA
   * @param livrableStatus 
   */
  isArchivbleLivrableStatus(livrableStatus: string){
    switch (livrableStatus) {
      case ARCHIVABLE_STATUT_LIVRABLE.ORIGINAL_ABSENT.VALUE:
        return ARCHIVABLE_STATUT_LIVRABLE.ORIGINAL_ABSENT.ARCHIVABLE;
      case ARCHIVABLE_STATUT_LIVRABLE.ORIGINAL_PRESENT.VALUE:
        return  ARCHIVABLE_STATUT_LIVRABLE.ORIGINAL_PRESENT.ARCHIVABLE;
      case ARCHIVABLE_STATUT_LIVRABLE.DONNEES_STOCKEES.VALUE:
        return ARCHIVABLE_STATUT_LIVRABLE.DONNEES_STOCKEES.ARCHIVABLE;
      case ARCHIVABLE_STATUT_LIVRABLE.GENERE.VALUE:
        return ARCHIVABLE_STATUT_LIVRABLE.GENERE.ARCHIVABLE;
      case ARCHIVABLE_STATUT_LIVRABLE.GENERE_ERREUR.VALUE:
        return ARCHIVABLE_STATUT_LIVRABLE.GENERE_ERREUR.ARCHIVABLE;
      case ARCHIVABLE_STATUT_LIVRABLE.GENERE_WARNING.VALUE:
        return ARCHIVABLE_STATUT_LIVRABLE.GENERE_WARNING.ARCHIVABLE;
      case ARCHIVABLE_STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT.VALUE:
        return ARCHIVABLE_STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT.ARCHIVABLE;
      default:
        return false;
    }
  }

  /**
   * @author YFA
   * @param status 
   */
  isArchivableLivrableSousStatus(status: string): boolean{
    switch(status){
      case ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FOND_A_VALIDER_METIER.ETAT:
        return ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FOND_A_VALIDER_METIER.ARCHIVABLE;
      case ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FORME_A_VALIDER_METIER.ETAT:
        return ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FORME_A_VALIDER_METIER.ARCHIVABLE;
      case ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FORME_INVALIDE_METIER_CORRIGE.ETAT:
        return ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FORME_INVALIDE_METIER_CORRIGE.ARCHIVABLE;
      case ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FOND_INVALIDE_METIER_ATTENTE_CORRECTION.ETAT:
        return ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FOND_INVALIDE_METIER_ATTENTE_CORRECTION.ARCHIVABLE;
      case ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FORME_INVALIDE_METIER_ATTENTE_CORRECTION.ETAT:
        return ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FORME_INVALIDE_METIER_ATTENTE_CORRECTION.ARCHIVABLE;
      case ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FORME_VALIDE_METIER.ETAT:
        return ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FORME_VALIDE_METIER.ARCHIVABLE;
      case ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FORME_VALIDE_SI.ETAT:
        return ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.FORME_VALIDE_SI.ARCHIVABLE;
      case ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.ARCHIVE.ETAT:
        return ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.ARCHIVE.ARCHIVABLE
      case ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.A_ENVOYER.ETAT:
        return ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.A_ENVOYER.ARCHIVABLE
      case ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.ENVOYE.ETAT:
        return ARCHIVABLE_SOUS_ETAT_LIVRABLE_MESSAGE.ENVOYE.ARCHIVABLE
      default:
        return false;
    }
  }
}