import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
  
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

  employeedetails(data: any){
    if(data){
      sessionStorage.setItem('TOIID', data.timescapeUserOID);
      sessionStorage.setItem('parentName', data.empFullName);
      sessionStorage.setItem('emailId', data.emailId);
    }
  }
  
}
