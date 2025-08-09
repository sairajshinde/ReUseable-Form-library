import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiDirectivesModule } from '../../projects/bccl-library/src/lib/directives/ui-directives.module';
import { RouterOutlet } from '@angular/router';
import { PopupComponent } from './components/popup/popup.component';
import { provideHttpClient } from '@angular/common/http';
import { LoaderService } from './services/shared/loader.service';
import { Observable } from 'rxjs';
import { CommonDialogService } from './services/shared/common-dialog.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiDirectivesModule, RouterOutlet, PopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  constructor(
    public loaderService: LoaderService,
    private dialogService: CommonDialogService,
    vcr: ViewContainerRef
  ) {
    this.dialogService.setViewContainerRef(vcr);
  }
}


