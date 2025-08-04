import { Injectable } from '@angular/core';
import { publicApi } from './publicApi/publicApi';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class ApiService {

addEntry = publicApi.addEntry;
dublicateEntry = publicApi.dublicateEntry;
uploadFilesWithForm = publicApi.uploadFilesWithForm;
checkstatus = publicApi.checkstatus;
generateCertificate = publicApi.generateCertificate;
deleteFileWithForm = publicApi.deleteFile;
downloadFileWithForm = publicApi.downloadFile

 constructor(private http: HttpClient) {}

checkDuplicateEntry(body: HttpParams): Observable<any> {
  const headers = new HttpHeaders({ 
    'Content-Type': 'application/x-www-form-urlencoded' 
  });
  return this.http.post<any>(this.dublicateEntry, body, { headers });
}

submitScholarshipForm(valuesArray: any): Observable<any> {
  return this.http.post(this.addEntry, valuesArray); // adjust the URL accordingly
}


downloadCertificate(body: URLSearchParams): Observable<Blob> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  return this.http.post(this.generateCertificate, body.toString(), {
    headers,
    responseType: 'blob'
  });
}

uploadAttachments(selectedFiles: any, applicationId?: string): Observable<any> {
  const formData = new FormData();

  if (selectedFiles['attachment1']) {
    formData.append('file1', selectedFiles['attachment1']);
  }
  if (selectedFiles['attachment2']) {
    formData.append('file2', selectedFiles['attachment2']);
  }
  if (selectedFiles['attachment3']) {
    formData.append('file3', selectedFiles['attachment3']);
  }
  if (selectedFiles['attachment4']) {
    formData.append('file4', selectedFiles['attachment4']);
  }
  if (selectedFiles['cheque']) {
    formData.append('attachfile', selectedFiles['cheque']);
  }

  // ✅ Optional applicationId
  if (applicationId) {
    formData.append('applicationId', applicationId  || '' );
  }

  return this.http.post(this.uploadFilesWithForm, formData);
}

deleteFile(body: URLSearchParams): Observable<any> {
  return this.http.post(this.deleteFileWithForm,
    body.toString());
}

downloadFile(fileName: string): Observable<Blob> {
  const encodedName = btoa(fileName); // Base64 encode
  const params = new HttpParams()
    .set('fileName', encodedName)
    .set('type', '');

  return this.http.get('/scholarship/downloadFile', {
    params,
    responseType: 'blob' // Important for file download
  });
}


 getDetailsByTOID() {
    return this.http.post<any[]>(this.checkstatus, '');
  }
}
