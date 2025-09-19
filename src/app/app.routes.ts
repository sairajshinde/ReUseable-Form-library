import { Routes } from '@angular/router';
import { ToiEducationComponent } from './components/toi-education/toi-education.component';
import { ErrorExitComponent } from './components/errorExit/errorexit.component';
import { CustomLoginComponent } from './components/custom-login/custom-login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customlogin', pathMatch: 'full' },
  { path: 'customlogin', component: CustomLoginComponent},
  { path: 'toi-education', component: ToiEducationComponent},
  { path: 'check-status', loadComponent: () =>
    import ('./components/toi-education/check-status/check-status.component').then(m => m.CheckStatusComponent)},
  { path: 'new-scholarship',  loadComponent: () =>
    import ('./components/toi-education/new-scholarship/new-scholarship.component').then(m => m.NewScholarshipComponent)},
    { path: 'process',  loadComponent: () =>
    import ('./components/toi-education/process/process.component').then(m => m.ProcessComponent)},
    { path: 'view-short-list',  loadComponent: () =>
    import ('./components/toi-education/viewshort-list/viewshort-list.component').then(m => m.ViewshortListComponent)},
  { path: 'error/:val', component: ErrorExitComponent}
       
];
