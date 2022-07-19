import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class CommonService{
    /**
   * this bloc is for downloading InstallationPV
   * */
  blobToArrayBuffer(base64: any): any {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  saveResponseFileAsPdf(reportName: any, byte: any): any {
    const blob = new Blob([byte], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    const fileName = reportName;
    window.open(link.href);
    link.download = fileName;
    link.click();
  }

  sortAdresseRdv(adresseRdv) {
    let adresseRdvClone = adresseRdv.slice();
    const pricipalAdresses = adresseRdvClone.filter((adresse) =>
      adresse.types[0].label.includes('Principal')
    );
    adresseRdvClone = adresseRdv.slice();
    const professionnelAdresses = adresseRdvClone.filter((adresse) =>
      adresse.types[0].label.includes('Professionnel')
    );
    adresseRdvClone = adresseRdv.slice();
    const secondaireAdresses = adresseRdvClone.filter((adresse) =>
      adresse.types[0].label.includes('Secondaire')
    );
    adresseRdvClone = adresseRdv.slice();
    const temporaireAdresses = adresseRdvClone.filter((adresse) =>
      adresse.types[0].label.includes('Temporaire')
    );
    return [
      ...pricipalAdresses,
      ...secondaireAdresses,
      ...professionnelAdresses,
      ...temporaireAdresses,
    ];
  }
}
