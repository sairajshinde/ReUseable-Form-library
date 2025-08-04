import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ToiEducationComponent } from './components/toi-education/toi-education.component';
import { CheckStatusComponent } from './components/toi-education/check-status/check-status.component';
import { NewScholarshipComponent } from './components/toi-education/new-scholarship/new-scholarship.component';

export const routes: Routes = [
  { path: '', redirectTo: '/toi-education', pathMatch: 'full' },
  {
  path: 'toi-education',
  component: ToiEducationComponent,
 
  },
    { path: 'check-status', component: CheckStatusComponent },
    { path: 'new-scholarship', component: NewScholarshipComponent }
];
