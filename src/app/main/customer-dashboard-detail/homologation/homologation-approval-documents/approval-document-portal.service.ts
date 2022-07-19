import { DOCUMENTS_CONTRACTUEL, PIECES_JUSTIFICATIVES } from './../../../../_core/constants/constants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApprovalDocumentPortalService {
  // Documents contractuels
  CON = 'CON';
  CONT = 'CONT';
  AUTBLOC = 'AUTBLOC';
  AMEX = 'AMEX';
  SEPA = 'SEPA';
  CED1 = 'CED1';
  CED2 = 'CED2';
  CED3 = 'CED3';
  CED4 = 'CED4';
  CED5 = 'CED5';
  ATTESTTP1 = 'ATTESTTP1';
  ATTESTTP2 = 'ATTESTTP2';
  ATTESTTP3 = 'ATTESTTP3';
  ATTESTTP4 = 'ATTESTTP4';
  ATTESTTP5 = 'ATTESTTP5';
  AMEXTP1 = 'AMEXTP1';
  AMEXTP2 = 'AMEXTP2';
  AMEXTP3 = 'AMEXTP3';
  AMEXTP4 = 'AMEXTP4';
  AMEXTP5 = 'AMEXTP5';
  SEPATP1 = 'SEPATP1';
  SEPATP2 = 'SEPATP2';
  SEPATP3 = 'SEPATP3';
  SEPATP4 = 'SEPATP4';
  SEPATP5 = 'SEPATP5';
  AMEXMOBILE = 'AMEXMOBILE';
  SEPAMOBILE = 'SEPAMOBILE';
  SEPAFIBRE = 'SEPAFIBRE';
  AMEXFIBRE = 'AMEXFIBRE';
  AMEXMOBILETP1 = 'AMEXMOBILETP1';
  AMEXMOBILETP2 = 'AMEXMOBILETP2';
  AMEXMOBILETP3 = 'AMEXMOBILETP3';
  AMEXMOBILETP4 = 'AMEXMOBILETP4';
  AMEXMOBILETP5 = 'AMEXMOBILETP5';
  SEPAMOBILETP1 = 'SEPAMOBILETP1';
  SEPAMOBILETP2 = 'SEPAMOBILETP2';
  SEPAMOBILETP3 = 'SEPAMOBILETP3';
  SEPAMOBILETP4 = 'SEPAMOBILETP4';
  SEPAMOBILETP5 = 'SEPAMOBILETP5';
  SEPAFIBRETP1 = 'SEPAFIBRETP1';
  SEPAFIBRETP2 = 'SEPAFIBRETP2';
  SEPAFIBRETP3 = 'SEPAFIBRETP3';
  SEPAFIBRETP4 = 'SEPAFIBRETP4';
  SEPAFIBRETP5 = 'SEPAFIBRETP5';
  AMEXFIBRETP1 = 'AMEXFIBRETP1';
  AMEXFIBRETP2 = 'AMEXFIBRETP2';
  AMEXFIBRETP3 = 'AMEXFIBRETP3';
  AMEXFIBRETP4 = 'AMEXFIBRETP4';
  AMEXFIBRETP5 = 'AMEXFIBRETP5';

  // Pièces justificatives
  CHANN = 'CHANN';
  PIP = 'PIP';
  PIB = 'PIB';
  PIRL = 'PIRL';
  PITP1 = 'PITP1';
  PITP2 = 'PITP2';
  PITP3 = 'PITP3';
  PITP4 = 'PITP4';
  PITP5 = 'PITP5';
  PIDS = 'PIDS';
  PIDD = 'PIDD';
  PIDC1 = 'PIDC1';
  PIDC2 = 'PIDC2';
  PIDC3 = 'PIDC3';
  PIDC4 = 'PIDC4';
  PIDC5 = 'PIDC5';
  KBIST = 'KBIST';
  KBISTP1 = 'KBISTP1';
  KBISTP2 = 'KBISTP2';
  KBISTP3 = 'KBISTP3';
  KBISTP4 = 'KBISTP4';
  KBISTP5 = 'KBISTP5';
  KBISTP6 = 'KBISTP6';
  FRMDS = 'FRMDS';
  FRDR = 'FRDR';
  RIB1 = 'RIB1';
  RIB2 = 'RIB2';
  RIB3 = 'RIB3';
  RIB4 = 'RIB4';
  RIB5 = 'RIB5';
  RIB6 = 'RIB6';

  public getValue(choix: string) {
    const label = this.getApprovalDocumentValueFirstCase(choix);
    return label.length !== 0 ? label:this.getApprovalDocumentValueSecondCase(choix);
  }
    getApprovalDocumentValueSecondCase(choix: string) {
    let label = '';
    switch (choix.split('-')[0]) {
      case this.CHANN:
        label = PIECES_JUSTIFICATIVES.CHANN;
        break;
      case this.PIP:
        label = PIECES_JUSTIFICATIVES.PIP;
        break;
      case this.PIB:
        label = PIECES_JUSTIFICATIVES.PIB;
        break;
      case this.PIRL:
        label = PIECES_JUSTIFICATIVES.PIRL;
        break;
      case this.PITP1:
      case this.PITP2:
      case this.PITP3:
      case this.PITP4:
      case this.PITP5:
        label = PIECES_JUSTIFICATIVES.PITP;
        break;
      case this.PIDS:
        label = PIECES_JUSTIFICATIVES.PIDS;
        break;
      case this.PIDD:
        label = PIECES_JUSTIFICATIVES.PIDD;
        break;
      case this.PIDC1:
      case this.PIDC2:
      case this.PIDC3:
      case this.PIDC4:
      case this.PIDC5:
        label = PIECES_JUSTIFICATIVES.PIDC;
        break;
      case this.KBIST:
        label = PIECES_JUSTIFICATIVES.KBIST;
        break;
      case this.KBISTP1:
      case this.KBISTP2:
      case this.KBISTP3:
      case this.KBISTP4:
      case this.KBISTP5:
      case this.KBISTP6:
        label = PIECES_JUSTIFICATIVES.KBISTP;
        break;
      case this.FRMDS:
        label = PIECES_JUSTIFICATIVES.FRMDS
        break;
      case this.FRDR:
        label = PIECES_JUSTIFICATIVES.FRDR;
        break;
      case this.RIB1:
      case this.RIB2:
      case this.RIB3:
      case this.RIB4:
      case this.RIB5:
      case this.RIB6:
        label = PIECES_JUSTIFICATIVES.RIB;
        break;
      default:
        break;
    }
    return label;
}
    getApprovalDocumentValueFirstCase(choix: string) {
        let label = '';
        switch (choix.split('-')[0]) {
            // Documents contractuels
            case this.CON:
            case this.CONT:
              label = DOCUMENTS_CONTRACTUEL.CON;
              break;
            case this.AUTBLOC:
              label = DOCUMENTS_CONTRACTUEL.AUTBLOC;
              break;
            case this.SEPA:
              label = DOCUMENTS_CONTRACTUEL.SEPA;
              break;
            case this.CED1:
            case this.CED2:
            case this.CED3:
            case this.CED4:
            case this.CED5:
              label = DOCUMENTS_CONTRACTUEL.CED;
              break;
            case this.ATTESTTP1:
            case this.ATTESTTP2:
            case this.ATTESTTP3:
            case this.ATTESTTP4:
            case this.ATTESTTP5:
              label = DOCUMENTS_CONTRACTUEL.ATTESTTP;
              break;
            case this.AMEXTP1:
            case this.AMEXTP2:
            case this.AMEXTP3:
            case this.AMEXTP4:
            case this.AMEXTP5:
              label = DOCUMENTS_CONTRACTUEL.AMEXTP
              break;
            case this.SEPATP1:
            case this.SEPATP2:
            case this.SEPATP3:
            case this.SEPATP4:
            case this.SEPATP5:
              label = DOCUMENTS_CONTRACTUEL.SEPATP
              break;
            case this.AMEXMOBILE:
            case this.AMEXFIBRE:
            case this.AMEX:
              label = DOCUMENTS_CONTRACTUEL.AMEX;
              break;
            case this.SEPAMOBILE:
              label = DOCUMENTS_CONTRACTUEL.SEPA_MOBILE
              break;
            case this.SEPAFIBRE:
              label = DOCUMENTS_CONTRACTUEL.SEPA_FIBRE
              break;
            case this.AMEXMOBILETP1:
            case this.AMEXMOBILETP2:
            case this.AMEXMOBILETP3:
            case this.AMEXMOBILETP4:
            case this.AMEXMOBILETP5:
              label = DOCUMENTS_CONTRACTUEL.AMEXMOBILETP
              break;
            case this.SEPAMOBILETP1:
            case this.SEPAMOBILETP2:
            case this.SEPAMOBILETP3:
            case this.SEPAMOBILETP4:
            case this.SEPAMOBILETP5:
              label = DOCUMENTS_CONTRACTUEL.SEPAMOBILETP
              break;
            case this.SEPAFIBRETP1:
            case this.SEPAFIBRETP2:
            case this.SEPAFIBRETP3:
            case this.SEPAFIBRETP4:
            case this.SEPAFIBRETP5:
              label = DOCUMENTS_CONTRACTUEL.SEPAFIBLETP;
              break;
            case this.AMEXFIBRETP1:
            case this.AMEXFIBRETP2:
            case this.AMEXFIBRETP3:
            case this.AMEXFIBRETP4:
            case this.AMEXFIBRETP5:
              label = DOCUMENTS_CONTRACTUEL.AMEXFIBRETP
              break;
            default:
              break;      
    }
    return label;
  }
}
