import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';

import { environment } from '../../../environments/environment';
import { DocumentVO } from '../../_core/models/documentVO';
import { DocumentSearchCriteria } from '../models/document-search-criteria';
import { PaginatedList } from '../models/models';
import { HttpBaseService } from './http-base.service';
import { ConfirmationDialogService } from '../../_shared/components/confirmation-dialog/confirmation-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends HttpBaseService<DocumentVO> {
  errorMessage = 'La facture que vous souhaitez télécharger est introuvable.';
  httpOptions = {
    observe: 'response' as const,
    responseType  : 'arraybuffer' as 'json',
  };
  constructor(httpClient: HttpClient, private readonly confirmationDialogService: ConfirmationDialogService) {
    super(httpClient, 'documents');
  }
  getDocumentsBy(id: string, typeDoc: number, annee: string ): Observable<DocumentVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/documents?customerId=${id}&typeDoc=${typeDoc}&annee=${annee}`)
    .pipe(map((data: any) => <DocumentVO[]>data));
  }

  listYear(): Observable<number[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/listyear`)
    .pipe(map((data: any) => <number[]>data));
  }

  downloadFile(fileName: string , nichIdentif: string): Observable<any> {
    const downloadURL = `${environment.baseUrl}/${this.endpoint}/downloadfile?fileName=${fileName}&nicheIdentifiant=${nichIdentif}`;
    const httpOptions = {
      observe: 'response' as const,
      responseType  : 'arraybuffer' as 'json',
    };
    return this.httpClient.get(downloadURL, httpOptions);
  }

  /**
   * telechargement des documents 
   * @param documents
   * @param nicheIdentifiant
   */
  downloadFiles(documents: DocumentVO[],nicheIdentifiant: string):  DocumentVO[]{
 
    for(let document of documents ) { 
    let downloadURL = `${environment.baseUrl}/${this.endpoint}/downloadfile?fileName=${document.fileName}&nicheIdentifiant=${nicheIdentifiant}`;
    this.httpClient.get(downloadURL,{responseType:'text'}).subscribe(
      (response) => {
        document.checkUrl = true;
        document.dowloadUrl = downloadURL;
      }
    );
  }
    return documents;
  }

  getDocumentFullBy(id: string, targetType: string): Observable<DocumentVO[]> {
    return this.httpClient.get(`${environment.baseUrl}/${this.endpoint}/documentsfull?id=${id}&targetType=${targetType}`)
    .pipe(map((data: any) => <DocumentVO[]>data));
  }

  /**
	 * @FIX  Ce Service à été dupliqué 
	 * suite au fait que le premier service "getDocumentFullBy"
	 * est utilisé dans plusieurs endroit
	 * et ce dernier 
	 * ne parametètre pas le targetId suite au target Type
	 * 
	 * @param id
	 * @param targetType
	 * @return
	 */
  getDocumentFullByTargetType(id: string, targetType: string): Observable<DocumentVO[]> {
    return this.httpClient.get(`${environment.baseUrl}/${this.endpoint}/documentsfullByTargetType?id=${id}&targetType=${targetType}`)
    .pipe(map((data: any) => <DocumentVO[]>data));
  }

  getRequestDocuments(id: number): Observable<DocumentVO[]> {
    return this.httpClient.get<DocumentVO[]>(`${environment.baseUrl}/${this.endpoint}/documents/request/${id}`);
  }

  documentsMonitoring(documentSearchCriteria: DocumentSearchCriteria): Observable<PaginatedList<DocumentVO[]>> {
    return this.httpClient.post<PaginatedList<DocumentVO[]>>(`${environment.baseUrl}/${this.endpoint}/monitoring`, documentSearchCriteria);
  }

  saveDocument(documentTitleId: string, typeDocument: string, titreDocument: string,
    documentTypeId:string, file: File, customerId: string, dateCreation: string): Observable<DocumentVO> {
    const data: FormData = new FormData();
    data.append('documentTitleId', documentTitleId);
    data.append('typeDocument', typeDocument);
    data.append('titreDocument', titreDocument);
    data.append('documentTypeId', documentTypeId);
    data.append('file', file);
    data.append('customerId', customerId);
    data.append('dateCreation', dateCreation)
    return this.httpClient.
    post<DocumentVO>(`${environment.baseUrl}/${this.endpoint}/saveDocument`, data);
  }

  deleteDocument(documentId: number): Observable<DocumentVO> {
    return this.httpClient.delete<DocumentVO>(`${environment.baseUrl}/${this.endpoint}/${documentId}`);
  }

  changeVisibilityPortail(doc: DocumentVO): Observable<any> {
    return this.httpClient.post<DocumentVO>(`${environment.baseUrl}/${this.endpoint}/visibility`, doc);
  }

  saveFullDocument(documentTitleId: string, typeDocument: string, titreDocument: string,
    documentTypeId: string, file: File,
     targetId: string, targetType: string, isAccessibleFromPortal: string): Observable<DocumentVO> {
    const data: FormData = new FormData();
    data.append('documentTitleId', documentTitleId);
    data.append('typeDocument', typeDocument);
    data.append('titreDocument', titreDocument);
    data.append('documentTypeId', documentTypeId);
    data.append('file', file);
    data.append('targetId', targetId);
    data.append('targetType', targetType);
    data.append('isAccessibleFromPortal', isAccessibleFromPortal);
    return this.httpClient.post<DocumentVO>(`${environment.baseUrl}/${this.endpoint}/saveFullDocument`, data);
  }

  showAndDownloadFile(customerId , fileName){
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.get(`${environment.baseUrl}/${this.endpoint}/document/${customerId}/${fileName}` , {observe: 'response' , headers, responseType: 'blob' });
  }

  /* upload temporary approval documents */
  uploadTmpDocument(userId: any, file: File) {
    const data: FormData = new FormData();
    data.append('userId', userId.toString());
    data.append('file', file);
    return this.httpClient.post(`${environment.baseUrl}/${this.endpoint}/document/uploadDocument`, data);
  }

   /* upload temporary approval documents */
   uploadBillToPenicheServer(file: File) {
    const data: FormData = new FormData();
    data.append('file', file);
    return this.httpClient.post(`${environment.baseUrl}/${this.endpoint}/document/uploadBillToPenicheServer`, data);
  }
  getCustomerBillsByFileName(filename: string): Observable<any> {
    const downloadURL = `${environment.baseUrl}/${this.endpoint}/download/bill/${filename}`;
    const httpOptions = {
      observe: 'response' as const,
      responseType  : 'arraybuffer' as 'json',
    };
    return this.httpClient.get(downloadURL, httpOptions);
  }

  downloadBill(filename: string): void {
    this.getCustomerBillsByFileName(filename).subscribe(
        (data) => {
          this.onSsuccessFileTreatement(data, filename);
        }, 
        (_error) => {
          this.onErrorFileTreatement();
        }
      );   
  }

  public onErrorFileTreatement() {
    this.confirmationDialogService.
      confirm('', `Erreur Technique : ${this.errorMessage}`, 'Ok', null, 'lg', false);
  }

  public onSsuccessFileTreatement(data: any, filename: string) {
    const type = data.headers.get('Content-Type');
    const file = saveAs(new Blob([data.body], { type }), filename);
    if (type !== 'application/octet-stream') {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } else {
      const element = document.createElement('a');
      element.target = '_blank';
      element.href = URL.createObjectURL(file);
      element.download = filename;

      document.body.appendChild(element);
      element.click();
    }
  }

  
   /* upload temporary cri documents */
  uploadTmpFiles(userId: number, documentTitleId: number, typeDocument: string, titreDocument: string,
    documentTypeId: number, file: File, originalFileName: string, customizedName: string, targetId: number): Observable<DocumentVO> {
    const data: FormData = new FormData();
    data.append('userId', userId.toString());
    data.append('documentTitleId', documentTitleId.toString());
    data.append('typeDocument', typeDocument);
    data.append('titreDocument', titreDocument);
    data.append('documentTypeId', documentTypeId.toString());
    data.append('file', file);
    data.append('originalFileName', originalFileName);
    data.append('customizedName', customizedName);
    data.append('targetId', targetId.toString());
    return this.httpClient.post<DocumentVO>(`${environment.baseUrl}/${this.endpoint}/document/uploadTmpFiles`, data);
  }

  /* download temporary cri documents */
  showTmpDocument(userId: any, filename: any): Observable<any> {
    const httpOptions = {
      observe: 'response' as const,
      responseType  : 'arraybuffer' as 'json',
    };
    return this.httpClient.get(`${environment.baseUrl}/${this.endpoint}/document/showTmpDocument/${userId}/${filename}`, httpOptions);
  }

  /* delete temporary cri documents */
  deleteTmpDocument(deletedFile: File, fileName: string, userId: number): any {
    return this.httpClient.post(`${environment.baseUrl}/${this.endpoint}/deleteTmpDocument/${userId}/${fileName}`, deletedFile);
  }


  saveCriDocument(documentTitleId: string, typeDocument: string, titreDocument: string, 
    documentTypeId:string, file: File, dateCreation: string,
    requestId : string , interventionReportId : string): Observable<DocumentVO> {
    const data: FormData = new FormData();
    data.append('documentTitleId', documentTitleId);
    data.append('typeDocument', typeDocument);
    data.append('titreDocument', titreDocument);
    data.append('documentTypeId', documentTypeId);
    data.append('file', file);
    data.append('dateCreation', dateCreation);
    data.append('requestId', requestId);
    data.append('interventionReportId', interventionReportId)
    return this.httpClient.
    post<DocumentVO>(`${environment.baseUrl}/${this.endpoint}/saveCriDocument`, data);
  }

  deleteSavedDocumentCri(documentId: number): any {
     return this.httpClient.post(`${environment.baseUrl}/${this.endpoint}/deleteSavedCriDocument/${documentId}`, null);
  }

  downloadBillByFiligrane(filename: string , filigraneOut: boolean){
    return this.httpClient.get(`${environment.baseUrl}/${this.endpoint}/download-bill/${filename}/${filigraneOut}` , this.httpOptions);
  }

  downloadOriginalBill(filename: string) {
    return this.httpClient.get(`${environment.baseUrl}/${this.endpoint}/download-bill/original/${filename}` , this.httpOptions);
  }

/**
 * permet de telecharger un fichier excel50D depuis peniche
 * @param fileName
 * @returns
 */
  downloadExcel50D(fileName: string) {
    return this.httpClient.get(`${environment.baseUrl}/${this.endpoint}/download-excel50D/${fileName}` , this.httpOptions);
  }

  checkIsExisteFileByListNames(targetId: string , filesName: string[]): Observable<string[]> {
    let url = `${environment.baseUrl}/documents/checkIsExisteFileByListNames?targetId=${targetId}`;
    if ( filesName !== null) {
      filesName.forEach( s => url += '&filesName=' + s);
    } else {
      url += '&filesName=';
    }
    return this .httpClient.get<string[]>(url);
  }

  saveDocumentWithListFiles(titleId: string, type: string, title: string,
    typeId:string, files: File[], customerId: string, dateCreation: string): Observable<DocumentVO[]> {
    const data: FormData = new FormData();
    data.append('titleId', titleId);
    data.append('type', type);
    data.append('dateCreation', dateCreation)
    data.append('title', title);
    data.append('typeId', typeId);
    if (files && files.length) {
      files.forEach(file => data.append('files', file));
    }
    data.append('customerId', customerId);
    return this.httpClient.
    post<DocumentVO[]>(`${environment.baseUrl}/${this.endpoint}/saveDocumentWithListFiles`, data);
  }
}
