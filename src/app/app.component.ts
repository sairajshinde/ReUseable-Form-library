import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiDirectivesModule } from '../../projects/bccl-library/src/lib/directives/ui-directives.module';
import { RouterOutlet } from '@angular/router';
import { PopupComponent } from './components/popup/popup.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiDirectivesModule, RouterOutlet, PopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  studentForm: FormGroup;

  maritalStatuses = ['Single', 'Married', 'Divorced'];
  genders = ['Male', 'Female', 'Other'];
  attempts = ['Yes', 'No'];
  schemes = ['Scheme A', 'Scheme B', 'Scheme C'];
  courses = ['Course A', 'Course B', 'Course C'];
  years = ['1st', '2nd', '3rd', '4th'];
  menu = [
  {
    label: 'NEW SCHOLARSHIP',
    route: '/new-scholarship'
  },
  {
    label: 'CHECK STATUS',
    route: '/check-status'
  },
  {
    label: '',
    icon: 'ℹ️', 
    onClick: () => alert('Info clicked!')
  }
];




  constructor(private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      name: [''],
      dob: ['', ],
      gender: [''],
      email: [''],
      maritalStatus: [''],
      studentContact: [''],
      parentName: [''],
      parentContact: [''],
      examPassed: [''],
      firstAttempt: [''],
      resultDate: [''],
      aggregate: [''],
      cgpa: [''],
      schemeApplied: [''],
      courseApplied: [''],
      duration: [''],
      currentYear: [''],
      university: [''],
      marksA: [''],
      outOfA: [''],
      marksB: [''],
      outOfB: [''],
      studentMarksheet: [null],
      admissionLetter: [null],
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      console.log('Form Data:', this.studentForm.value);
    } else {
      this.studentForm.markAllAsTouched();
    }
  }

  genderOptions = [
    { id: 'M', label: 'Male' },
    { id: 'F', label: 'Female' },
    { id: 'O', label: 'Other' }
  ];

  onReset(): void {
    this.studentForm.reset();
  }
}