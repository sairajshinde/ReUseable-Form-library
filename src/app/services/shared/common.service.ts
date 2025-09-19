import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class CommonService {

  constructor() { }
   authorization: any;
   authorizationkey: any;
updateemployeedetails(signedin : any)
{
         if(signedin == "true")
         {
          sessionStorage.setItem('signedin', signedin);
         }
         else
         {
           sessionStorage.setItem('signedin', '');
         }
  }
updatetoken(user:any, userkey:any ){
  localStorage.setItem('currentUser', user);
  localStorage.setItem('currentUserkey', userkey);
}
  employeedetails(data: any){
    if(data){
      sessionStorage.setItem('TOIID', data.timescapeUserOID);
      sessionStorage.setItem('parentName', data.empFullName);
      sessionStorage.setItem('emailId', data.emailId);
    }
  }

  clearAuthDATA(){
    sessionStorage.removeItem('reference');
    sessionStorage.removeItem('TOIID');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authKey');
    sessionStorage.removeItem('emailId');
    sessionStorage.removeItem('parentName');
    sessionStorage.removeItem('signedin');
    sessionStorage.removeItem('isProcessor');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserkey');
  }

  getEmail(){
    return sessionStorage.getItem('emailId');
  }
  getTOID(){
    return sessionStorage.getItem('TOIID');
  }
  setProcessorRole(isProcessor: boolean) {
    console.log('Processor role set to:', isProcessor);
     if(isProcessor === true)
         {
          sessionStorage.setItem('isProcessor', isProcessor.toString());
         }
         else
         {
           sessionStorage.setItem('isProcessor', 'false');
         }
  }

  getProcessorRole(): boolean{ return sessionStorage.getItem('isProcessor') === 'true';}
  isProcessorRole(): boolean{ return sessionStorage.getItem('isProcessor') === 'true'}
  gettoken(){
  let user:any={};
  user.value= localStorage.getItem('currentUser');
   user.keyvalue= localStorage.getItem('currentUserkey');
   user.emailID = sessionStorage.getItem('emailId');
   user.TOIID = sessionStorage.getItem('TOIID');
  return user;
}
}
