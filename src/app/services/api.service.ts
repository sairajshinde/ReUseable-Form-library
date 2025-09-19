import { inject, Injectable } from '@angular/core';
import { publicApi } from './publicApi/publicApi';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { map, catchError, finalize } from 'rxjs/operators';
import { LoaderService } from './shared/loader.service';
import { CommonService } from './shared/common.service';
import * as CryptoJS from 'crypto-js';


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
checkRole = publicApi.listRole;
checkPendingRequest = publicApi.checkPendingRequest;
updatePendingRequest = publicApi.updatePendingRequest;
showAcceptedList = publicApi.showAcceptedList;

private http = inject(HttpClient);

 constructor(private loaderService: LoaderService, private common: CommonService) {}

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

// uploadAttachments(selectedFiles: any, applicationId?: string): Observable<any> {
//   const formData = new FormData();

//   if (selectedFiles['attachment1']) {
//     formData.append('file1', selectedFiles['attachment1']);
//   }
//   if (selectedFiles['attachment2']) {
//     formData.append('file2', selectedFiles['attachment2']);
//   }
//   if (selectedFiles['attachment3']) {
//     formData.append('file3', selectedFiles['attachment3']);
//   }
//   if (selectedFiles['attachment4']) {
//     formData.append('file4', selectedFiles['attachment4']);
//   }
//   if (selectedFiles['cheque']) {
//     formData.append('attachfile', selectedFiles['cheque']);
//     return this.http.post(this.uploadAttachFilesWithForm, formData);
//   }

//   // ✅ Optional applicationId
//   if (applicationId) {
//     formData.append('applicationId', applicationId  || '' );
//   }

//   return this.http.post(this.uploadFilesWithForm, formData);
// }
uploadAttachments(selectedFiles: any, applicationId?: string): Observable<any> {
  const formData = new FormData();

  if (selectedFiles['attachment1']) formData.append('file1', selectedFiles['attachment1']);
  if (selectedFiles['attachment2']) formData.append('file2', selectedFiles['attachment2']);
  if (selectedFiles['attachment3']) formData.append('file3', selectedFiles['attachment3']);
  if (selectedFiles['attachment4']) formData.append('file4', selectedFiles['attachment4']);
  formData.append('applicationId', applicationId ?? '');
  if (selectedFiles['cheque']) {
    formData.append('attachfile', selectedFiles['cheque']);
    return this.http.post(this.uploadAttachFilesWithForm, formData);
  }

  return this.http.post(this.uploadFilesWithForm, formData);
}

deleteFile(body: URLSearchParams): Observable<any>{
  return this.http.post(this.deleteFileWithForm, body.toString());
}

downloadFile(
  fileName: string,
  type: any = '',
  applicationId: any = '',
  flag :any =''
): Observable<HttpResponse<Blob>> {
  const encodedName = btoa(fileName || '');

  const params = new HttpParams()
    .set('fileName', encodedName)
    .set('type', type ?? '')
    .set('applicationId', applicationId ?? '')
    .set('flag', flag);

  return this.http.get(this.downloadFileWithForm, {
    params,
    responseType: 'blob' as 'json',   // 👈 required cast
    observe: 'response'
  }) as Observable<HttpResponse<Blob>>;  // 👈 final cast fixes typing
}




downloadCheque(fileName: string, type: any = '', applicationId: any = ''): Observable<HttpResponse<Blob>> {
  const encodedName = btoa(fileName || '');

  const params = new HttpParams()
    .set('fileName', encodedName)
    .set('type', type ?? '')
    .set('applicationId', applicationId ?? '');

  return this.http.get(this.downloadFileWithForm, {
    params,
    responseType: 'blob',
    observe: 'response'
  }).pipe(
    // ✅ Intercept and check for JSON error before returning
    map((response: HttpResponse<Blob>) => {
      const blob = response.body!;
      if (!blob) {
        throw new Error('Empty response from server.');
      }

      // Detect JSON (error payload)
      if (blob.type === 'application/json' || blob.type.startsWith('text/')) {
        return new Promise<HttpResponse<Blob>>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorJson = JSON.parse(reader.result as string);
              reject({
                message: errorJson.message || 'File not found.',
                success: false
              });
            } catch {
              reject({ message: 'Unexpected error while downloading the file.', success: false });
            }
          };
          reader.readAsText(blob);
        }) as unknown as HttpResponse<Blob>;
      }

      // ✅ Real file → return response as-is
      return response;
    }),
    catchError((err) => {
      console.error('DownloadFile error:', err);
      return throwError(() => err);
    })
  );
}




 deleteCheque (fileName: string, applicationID:string, controlName: string): Observable<any>{
  const encodedFileName = btoa(fileName);
    const body = new URLSearchParams();
    body.set('fileName', encodedFileName);
    body.set('type', 'attach');
    body.set('applicationID', applicationID);
    body.set('flag', controlName.toUpperCase());

    return this.http.post(this.deleteFileWithForm,
    body.toString());
 }

 checklist() {
   return this.http.post<any[]>(this.checkRole, '');
 }

 getPendingRequest(cycleStartDate:any, year:any, month:any ){
   const params = new HttpParams()
    .set('cycleStartDate', cycleStartDate)
    .set('year', year)
    .set('month', month);
  return this.http.post<any[]>(this.checkPendingRequest, params.toString());
 }

  getAcceptedList(plan:any, cycleStartDate:any, ){
   const params = new HttpParams()
   .set('plan', plan)
    .set('cycleStartDate', cycleStartDate)
  return this.http.post<any[]>(this.showAcceptedList, params.toString());
 }

 updatePending(applicationId:any, status:any, remarks:any, prevStatus:any ){
    const params = new HttpParams()
    .set('applicationId', applicationId)
    .set('status', status)
    .set('schemeCount', "0")
    .set('remarks', remarks || 'NA')
    .set('prevStatus', prevStatus);
  return this.http.post<any[]>(this.updatePendingRequest, params.toString());
 }

  getDetailsByTOID() {
    return this.http.post<any[]>(this.checkstatus, '');
  }

//  customLogin(userdata: any): Observable<any> {
//   const params = new HttpParams()
//     .set('emailId', userdata.emailId)
//     .set('reference', userdata.reference)
//     .set('checkedin', userdata.checked);
//   const headers = new HttpHeaders({ 'Accept': 'application/json' });
//   this.loaderService.show();
//   return this.http.post<any>(this.login, params.toString(), { headers, withCredentials: true, 
//     responseType: 'json' as const, }).pipe(
//     map((res: any) => {
//       if (res[0]?.status === 'success' && res[0]?.data !== '') {
//       let variable = res.headers.get('Authorization');

//       this.common.authorization = variable;
//       let variable1 = res.headers.get('Authorizationkey');

//       this.common.authorizationkey = variable1;
//       if (variable != null && variable1 != null) {
//         this.common.updatetoken(variable, variable1);
//       }
//         return res;
//       } else {
//         return res;
//       }
//     }),
//     catchError(err => {
//       console.error('Login failed', err);
//       throw err;
//     }),
//     finalize(() => {
//       this.loaderService.hide();
//     })
//   );
// }



// customLogin(userdata: any): Observable<any> {
//   const params = new HttpParams()
//     .set('emailId', userdata.emailId)
//     .set('reference', userdata.reference)
//     .set('checkedin', userdata.checked);

//   const headers = new HttpHeaders({
//     'Accept': 'application/json'
//     // You can also add static auth headers here if needed
//     // 'Authorization': 'your-key',
//     // 'Authorizationkey': 'your-key'
//   });

//   this.loaderService.show();

//   return this.http.post<any>(
//     this.login,
//     params.toString(),
//     {
//       headers,
//       withCredentials: true,
//       responseType: 'json',
//       observe: 'response'  // ✅ Important: allows access to headers
//     }
//   ).pipe(
//     map((res: HttpResponse<any>) => {
//       if (res.body?.[0]?.status === 'success' && res.body?.[0]?.data !== '') {
        
//         const variable = res.headers.get('authorization');    
//         const variable1 = res.headers.get('authorizationkey');

//         if (variable && variable1) {
//           this.common.authorization = variable;
//           this.common.authorizationkey = variable1;
//           this.common.updatetoken(variable, variable1);
//         }
//         return res.body;  
//       } else {
//         return res.body;
//       }
//     }),
//     catchError(err => {
//       console.error('Login failed', err);
//       throw err;
//     }),
//     finalize(() => {
//       this.loaderService.hide();
//     })
//   );
// }


customLogin(userdata: any): Observable<any> {
  const params = new HttpParams()
    .set('emailId', userdata.emailId)
    .set('reference', userdata.reference)
    .set('checkedin', userdata.checked);

  const headers = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  this.loaderService.show();

  return this.http.post<any>(
    this.login,
    params.toString(),
    {
      headers,
      withCredentials: true,
      observe: 'response'
    }
  ).pipe(
    map((res: HttpResponse<any>) => {
      const body = res.body;

      if (body?.[0]?.status === 'success' && body?.[0]?.data1) {
        // ✅ tokens from headers
        const token = res.headers.get('authorization');
        const tokenKey = res.headers.get('authorizationkey');

        if (token && tokenKey) {
          this.common.authorization = token;
          this.common.authorizationkey = tokenKey;
          this.common.updatetoken(token, tokenKey);

          // store if needed
          sessionStorage.setItem('authToken', token);
          sessionStorage.setItem('authKey', tokenKey);
        }

        // ✅ Crypto key/iv
        const keyStr = userdata.emailId.substring(0, 8) + 'bccl1234';
        const Cryptokey = CryptoJS.enc.Utf8.parse(keyStr);
        const Cryptoiv = CryptoJS.enc.Utf8.parse(keyStr);

        try {
          // ✅ decrypt encrypted payload
          const decrypted = CryptoJS.AES.decrypt(body[0].data1, Cryptokey, {
            iv: Cryptoiv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });

          const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
          const result = JSON.parse(decryptedText);

          return result; // ✅ return decrypted object
        } catch (e) {
          console.error('Decryption failed:', e);
          throw new Error('Invalid encrypted payload');
        }
      }

      return body; 
    }),
    catchError(err => {
      console.error('Login failed', err);
      return throwError(() => err);
    }),
    finalize(() => {
      this.loaderService.hide();
    })
  );
}

}
