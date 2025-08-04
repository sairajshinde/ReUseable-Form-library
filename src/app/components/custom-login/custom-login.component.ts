import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-custom-login',
  standalone: true,
  imports: [],
  template: ``,
  styles: ``
})
export class CustomLoginComponent implements OnInit{

  checked: boolean = false;
  user: any = {};
  public previousUrl: string | undefined;
  employee: any;

    constructor(private route: ActivatedRoute,
    private _router: Router,) { }
  ngOnInit() {
    this.callOnInit();
  }

  callOnInit(){
    localStorage.removeItem("reference");
      this.route.queryParams.subscribe(params => {
        console.log(JSON.stringify(params));
        // alert(params['reference']);
        // alert(params['application']);
        // alert(params['emailId']);
        // alert("referrer :: " + document.referrer);
        
        var tempData = JSON.parse(atob(params['tdata']));
        console.log(tempData);
        
        var reference = tempData.usr_reference;
        sessionStorage.setItem('reference', reference)
        console.log(reference,"reference=======>");
        var appInfo = tempData.usr_application;
        console.log(appInfo,"appInfo");
        var emailId = tempData.usr_email; //"sachin.kale@timesgroup.com"
        console.log(emailId,'emailId----------------------------');
        if (reference == "timescape") {
          // if(document.referrer.match('timesgroup.com')){
          this.customLogin(emailId, appInfo);
          // } else {
          //not authorised
          // this._router.navigate(['/error/1']);
          // }
        }
        else{
          this._router.navigate(['/error/1']);
        }
      });
  }

  customLogin(emailId:any, appInfo: any){
  
  }


}

