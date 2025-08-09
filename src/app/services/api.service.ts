import { inject, Injectable } from '@angular/core';
import { publicApi } from './publicApi/publicApi';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError, finalize } from 'rxjs/operators';

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
downloadFileWithForm = publicApi.downloadFile;
uploadAttachFilesWithForm = publicApi.uploadAttachFilesWithForm;
login = publicApi.customLogin;
private http = inject(HttpClient);

 constructor() {}

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
    return this.http.post(this.uploadAttachFilesWithForm, formData);
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

 customLogin(userdata: any): Observable<any> {
  const params = new HttpParams()
    .set('emailId', userdata.emailId)
    .set('reference', userdata.reference)
    .set('checkedin', userdata.checked);
  const headers = new HttpHeaders({ 'Accept': 'application/json' });

  return this.http.post<any>(this.login, params.toString(), { headers, withCredentials: true, 
    responseType: 'json' as const, }).pipe(
    map((res: any) => {
      if (res[0]?.status === 'success' && res[0]?.data !== '') {
        return res;
      } else {
        return res;
      }
    }),
    catchError(err => {
      console.error('Login failed', err);
      throw err;
    }),
    finalize(() => {
      // this.loaderService.hide();
    })
  );
}

}
