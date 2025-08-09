import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ToiEducationComponent } from './components/toi-education/toi-education.component';
import { CheckStatusComponent } from './components/toi-education/check-status/check-status.component';
import { NewScholarshipComponent } from './components/toi-education/new-scholarship/new-scholarship.component';
import { ErrorExitComponent } from './components/errorExit/errorexit.component';
import { CustomLoginComponent } from './components/custom-login/custom-login.component';


export const routes: Routes = [
  { path: '', redirectTo: '/customlogin', pathMatch: 'full' },
    { path: 'customlogin', component: CustomLoginComponent},
  { path: 'toi-education', component: ToiEducationComponent},
    { path: 'check-status', component: CheckStatusComponent },
    { path: 'new-scholarship', component: NewScholarshipComponent },
     { path: 'error/:val', component: ErrorExitComponent}
       
];
