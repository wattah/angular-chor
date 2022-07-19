import { Injectable } from '@angular/core';
import { CM_MEDIA_REF_KEY } from '../../../_core/constants/constants';
import { CmInterlocutorVO } from '../../../_core/models/cm-Interlocutor-vo';
import { InterlocutorVO } from '../../../_core/models/interlocutor-vo';
import { PostalAdresseVO } from '../../../_core/models/postalAdresseVO';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';

@Injectable({
  providedIn: 'root'
})
  export class Interlocutor360Service {

    separator = '\n';
    secondaires = 'secondaires';

  cmListByMediaRef(cmList: CmInterlocutorVO[], mediaRef: string, isPrincipal: boolean, isSecondaire: boolean): CmInterlocutorVO[] {
    if (!isNullOrUndefined(cmList)) {
      const list = cmList.filter(cm => cm.mediaRefKey === mediaRef
        && ( (!isNullOrUndefined(cm.value) && cm.value !== '') || (mediaRef === CM_MEDIA_REF_KEY.POSTAL_ADDRESS && cm.postalAddres !== null)) );
      if (list && mediaRef === CM_MEDIA_REF_KEY.TEL_MOBILE && isPrincipal) {
        return list.slice(0, 2);
      }
      if (list && isSecondaire && (mediaRef === CM_MEDIA_REF_KEY.POSTAL_ADDRESS ||
              mediaRef === CM_MEDIA_REF_KEY.TEL_FIXE || mediaRef === CM_MEDIA_REF_KEY.TEL_MOBILE)) {
        return list 
       }
        return list.slice(0, 1);
    }
    return [];
  }

  checkOneCmAndGetList(cmList: CmInterlocutorVO[], key: string, mediaRef: string): any[] {
    const list = cmList.filter(cm => cm.mediaRefKey === mediaRef );
    if (list && key === CM_MEDIA_REF_KEY.TEL_MOBILE) {
      return list.slice(0, 2);
    }  
    if (list) {
      return list.slice(0, 1);
    }
    return cmList.filter(cm => (cm !== null && cm.mediaRefKey === mediaRef));
  }

  ordorInterlocutorsCM(values: InterlocutorVO[]): void {
    for (const interVo of values) {
      if (!isNullOrUndefined(interVo) && !isNullOrUndefined(interVo.contactMethodsVO)) {
        for (const cm of interVo.contactMethodsVO) {
          if (cm) {
            this.setOrder(cm);
            this.setIconInit(cm);
          }
        }
        this.sort(interVo.contactMethodsVO);
      }
    }
  }

  sort(values: Array<CmInterlocutorVO>) {
    values.sort((a, b) => {
      if (a && b) {
        if (a.order > b.order) {
          return 1;
        }
        if (a.order < b.order) {
          return -1;
        }
      }
      return 0;
    });
  }

  setOrder(cmvo: CmInterlocutorVO): void {
    cmvo.order = -1;
    if (cmvo.mediaRefKey === CM_MEDIA_REF_KEY.TEL_FIXE) {
      cmvo.order = 0;
    } 
    if (cmvo.mediaRefKey === CM_MEDIA_REF_KEY.TEL_MOBILE) {
      cmvo.order = 1;
    }
    if (cmvo.mediaRefKey === CM_MEDIA_REF_KEY.EMAIL) {
      cmvo.order = 2;
    }
    if (cmvo.mediaRefKey === CM_MEDIA_REF_KEY.POSTAL_ADDRESS) {
      cmvo.order = 3;
    }
  }

  setIcon(cmvo: CmInterlocutorVO): void {
    if (cmvo.mediaRefKey === CM_MEDIA_REF_KEY.TEL_FIXE) {
      if ( cmvo.isExpired) {
        cmvo.iconAlert = 'icon phone-home icon-alert';
      } else {
        setTimeout (() => {
          cmvo.iconAlert = 'icon phone-home';
        }, 5000);
        cmvo.iconAlert = 'icon phone-home icon-check';
      }
    } 
    if ( cmvo.mediaRefKey === CM_MEDIA_REF_KEY.TEL_MOBILE) {
      if ( cmvo.isExpired) {
        cmvo.iconAlert = 'icon phone-mobile icon-alert';
      } else {
        setTimeout (() => {
          cmvo.iconAlert = 'icon phone-mobile';
        }, 5000);
        cmvo.iconAlert = 'icon phone-mobile icon-check';
      }
    }
    if (cmvo.mediaRefKey === CM_MEDIA_REF_KEY.EMAIL) {
      if ( cmvo.isExpired) {
        cmvo.iconAlert = 'icon mail icon-alert';
      } else {
        setTimeout (() => {
          cmvo.iconAlert = 'icon mail';
        }, 5000);
        cmvo.iconAlert = 'icon mail icon-check';
      }
    }
    this.setIconeMailAdresse(cmvo, true);
  }

  setIconeMailAdresse(cmvo: CmInterlocutorVO, timeOut: boolean) {
    if (cmvo.mediaRefKey === CM_MEDIA_REF_KEY.POSTAL_ADDRESS) {
      if ( cmvo.isExpired) {
        cmvo.iconAlert = 'icon icon-alert';
      } else {
        if (timeOut) {
          setTimeout (() => {
            cmvo.iconAlert = 'icon';
          }, 5000);
          cmvo.iconAlert = 'icon  icon-check';
        } else {
          cmvo.iconAlert = 'icon';
        }
      }  
    }
  }

  setIconInit(cmvo: CmInterlocutorVO): void {
    if (cmvo.mediaRefKey === CM_MEDIA_REF_KEY.TEL_FIXE) {
      if ( cmvo.isExpired) {
        cmvo.iconAlert = 'icon phone-home icon-alert';
      } else {
        cmvo.iconAlert = 'icon phone-home';
      }
    } 
    if ( cmvo.mediaRefKey === CM_MEDIA_REF_KEY.TEL_MOBILE) {
      if ( cmvo.isExpired) {
        cmvo.iconAlert = 'icon phone-mobile icon-alert';
      } else {
        cmvo.iconAlert = 'icon phone-mobile';
      }
    }
    if (cmvo.mediaRefKey === CM_MEDIA_REF_KEY.EMAIL) {
      if ( cmvo.isExpired) {
        cmvo.iconAlert = 'icon mail icon-alert';
      } else {
        cmvo.iconAlert = 'icon mail';
      }
    }
    this.setIconeMailAdresse(cmvo, false);
  }

  getFullAddress(adressPostal: PostalAdresseVO ): string {
    let str = '';
    str += this.separator + this.getAddress(adressPostal);
    return str;
  }
    
  getAddress(postalAddress: PostalAdresseVO): string {
    let str = '';
    if (!isNullOrUndefined(postalAddress.addrLine4)) {
      str += postalAddress.addrLine4 + this.separator ;
    }
    if (!isNullOrUndefined(postalAddress.addrLine5)) {
      str += postalAddress.addrLine5 + this.separator ;
    }
    if (!isNullOrUndefined(postalAddress.postalCode)) {
      str += `${postalAddress.postalCode} `;
    }
    if (!isNullOrUndefined(postalAddress.city)) {
      str += postalAddress.city;
    }
    if (!isNullOrUndefined(postalAddress.cedex)) {
      str += ` ${postalAddress.cedex}`;
    }
    return str;
  }
}
