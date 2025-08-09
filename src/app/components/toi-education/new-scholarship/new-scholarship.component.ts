import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiDirectivesModule } from '../../../../../projects/bccl-library/src/lib/directives/ui-directives.module';
import { RouterOutlet, RouterModule } from '@angular/router';
import { getSharedMenu, setPopupService, MenuItem } from '../../../services/shared/menu.config';
import { PopupService } from '../../../services/shared/popup.service';
import { ApiService } from '../../../services/api.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Location } from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LoaderService } from '../../../services/shared/loader.service';
import { CommonDialogService } from '../../../services/shared/common-dialog.service';

export function maxZeroValidator(control: AbstractControl): ValidationErrors | null {
  const value = parseFloat(control.value);
  if (!isNaN(value) && value === 0) {
    return { maxZero: true };
  }
  return null;
}

export function crossFieldRequiredValidator(
  field1: string,
  field2: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control1 = group.get(field1);
    const control2 = group.get(field2);

    if (!control1 || !control2) return null;

    const val1 = control1.value;
    const val2 = control2.value;

    // Only mark the group invalid; don't set errors on individual fields
    if ((val1 && !val2) || (!val1 && val2)) {
      return { requiredPair: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-new-scholarship',
  standalone: true,
  imports: [ReactiveFormsModule, UiDirectivesModule, RouterOutlet, RouterModule, CommonModule],
  templateUrl: './new-scholarship.component.html',
  styleUrl: './new-scholarship.component.scss'
})
export class NewScholarshipComponent implements OnInit {
  menu: MenuItem[] = [];
  body = new HttpParams();
  studentForm: FormGroup;
  applicationID = '';
  tooYoung = false;
  flag = '';
  status = '';
  isResultDateOutOfRange = false;
  dobTooRecent: boolean = false; // Flag to track if DOB is less than 14 years
  achiver: boolean = false;
  special: boolean = false;
  selectedFiles: { [key: string]: File } = {};
  removeFiles: { [key: string]: string } = {};
  genderOptions = [
    { label: 'Male', id: 'Male' },
    { label: 'Female', id: 'Female' },
    { label: 'Other', id: 'Other' }
  ];

  maritalStatuses = [
    { label: 'Unmarried', id: 'Unmarried' },
    { label: 'Married', id: 'Married' }
  ];

  attempts = [
    { label: 'Yes', id: 'Yes' },
    { label: 'No', id: 'No' }
  ];

  schemes = [
    { label: 'Under Graduate', id: 'Under Graduate' },
    { label: 'Graduate', id: 'Graduate' },
    { label: 'Post Graduate', id: 'Post Graduate' },
    { label: 'Students with special needs', id: 'Students with special needs' },
    { label: 'National/State Level Achievers', id: 'National/State Level Achievers' }
  ];

  courseOptions: { [key: string]: { label: string; id: string }[] } = {
    graduate: [
      { label: 'B.TECH IN COMPUTER SCIENCE', id: 'btechCS' },
      { label: 'B.TECH IN ELECTRONICS & COMMUNICATION', id: 'btechEC' },
      { label: 'B.TECH IN MECHANICAL', id: 'btechM' },
      { label: 'B.TECH IN BIOTECHNOLOGY & ENGINEERING PHYSICS', id: 'btechBEP' },
      { label: 'BBA', id: 'BBA' },
      { label: '5 YEARS INTEGRATED BBA-LLB (HONS)', id: 'BBA-LLB' },
      { label: 'BA JOURNALISM & MASS COMMUNICATION', id: 'bajmc' },
      { label: 'Others', id: 'Others' }
    ],
    postGraduate: [
      { label: 'MBA', id: 'MBA' },
      { label: 'Others', id: 'Others' }
    ],
    default: [
      { label: 'Others', id: 'Others' }
    ]
  };

  currentCourseOptions: { label: string; id: string }[] = this.courseOptions['default'];
  showOtherCourseInput: boolean = false;

  durationYears = [
    { label: '1 Year', id: '1' },
    { label: '2 Years', id: '2' },
    { label: '3 Years', id: '3' },
    { label: '4 Years', id: '4' },
    { label: '5 Years', id: '5' }
  ];

  years = [
    { label: '1st Year', id: '1' },
    { label: '2nd Year', id: '2' },
    { label: '3rd Year', id: '3' },
    { label: '4th Year', id: '4' },
    { label: '5th Year', id: '5' }
  ];

  constructor(private fb: FormBuilder, private loader: LoaderService, private popupService: PopupService, private api: ApiService, private location: Location, private dialog: CommonDialogService) {
    this.studentForm = this.fb.group({
      childName: ['', [Validators.maxLength(100)]],
      childDob: [''],
      childGender: [''],
      childMarritalStatus: [''],
      childEmailId: ['', [Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), Validators.maxLength(100)]],
      childContactNo: ['', Validators.pattern(/^[6-9]\d{9}$/)],
      parentName: [{ value: '', disabled: true }],
      childMobile: ['', Validators.pattern(/^[6-9]\d{9}$/)],
      examPassed: ['', [Validators.maxLength(100)]],
      firstAttempt: [''],
      passedYear: [''],
      aggregate: [{ value: '', disabled: true }],
      marksType: [''],
      marksObtained: [''],
      marksTotal: ['', [maxZeroValidator]],
      cgpaA: [''],
      cgpaB: ['', [maxZeroValidator]],
      schemeApplied: [''],
      courseApplied: [''],
      otherCourse: ['', [Validators.maxLength(100)]],
      durationOfCourse: [''],
      schemeYears: [''],
      nameOfCollege: ['', [Validators.maxLength(100)]],
      attachment1: [null],
      attachment2: [null],
      attachment3: [null],
      attachment4: [null]
    }, {
      validators: [
        crossFieldRequiredValidator('marksObtained', 'marksTotal'),
        crossFieldRequiredValidator('cgpaA', 'cgpaB')
      ]
    });
  }

  ngOnInit(): void {
    setPopupService(this.popupService);
    this.setparent();
    this.menu = getSharedMenu();
    this.handleResultDateLimit();
    this.handleCgpaAndMarksLogic();
    this.handleAggregateCalculation();
    const state = history.state;
    const data = history.state?.studentData;
    this.flag = history.state?.flag;
    if (data && Array.isArray(data)) {
      console.log(data)
      this.populateFormFromStudentData(data, this.flag);
    }
    this.handleDOB();
  }

  setparent() {
    this.studentForm.get('parentName')?.setValue(sessionStorage.getItem('parentName'));
  }

  handleCgpaAndMarksLogic(): void {
    const cgpaA = this.studentForm.get('cgpaA');
    const cgpaB = this.studentForm.get('cgpaB');
    const marksA = this.studentForm.get('marksObtained');
    const marksB = this.studentForm.get('marksTotal');

    const disableMarks = () => {
      if (marksA?.enabled) marksA.setValue(null, { emitEvent: false });
      if (marksB?.enabled) marksB.setValue(null, { emitEvent: false });
      marksA?.disable({ emitEvent: false });
      marksB?.disable({ emitEvent: false });
    };

    const disableCgpa = () => {
      if (cgpaA?.enabled) cgpaA.setValue(null, { emitEvent: false });
      if (cgpaB?.enabled) cgpaB.setValue(null, { emitEvent: false });
      cgpaA?.disable({ emitEvent: false });
      cgpaB?.disable({ emitEvent: false });
    };

    const enableAll = () => {
      marksA?.enable({ emitEvent: false });
      marksB?.enable({ emitEvent: false });
      cgpaA?.enable({ emitEvent: false });
      cgpaB?.enable({ emitEvent: false });
    };

    const updateFields = () => {
      const isCgpaFilled = cgpaA?.value || cgpaB?.value;
      const isMarksFilled = marksA?.value || marksB?.value;

      if (isCgpaFilled) {
        disableMarks();
      } else if (isMarksFilled) {
        disableCgpa();
      } else {
        enableAll();
      }
    };

    cgpaA?.valueChanges.subscribe(updateFields);
    cgpaB?.valueChanges.subscribe(updateFields);
    marksA?.valueChanges.subscribe(updateFields);
    marksB?.valueChanges.subscribe(updateFields);
  }

  handleAggregateCalculation(): void {
    const marksA = this.studentForm.get('marksObtained');
    const marksB = this.studentForm.get('marksTotal');
    const cgpaA = this.studentForm.get('cgpaA');
    const cgpaB = this.studentForm.get('cgpaB');
    const aggregate = this.studentForm.get('aggregate');

    const updateAggregateFromMarks = () => {
      const valA = parseFloat(marksA?.value);
      const valB = parseFloat(marksB?.value);
      if (!isNaN(valA) && !isNaN(valB) && valB > 0 && valA <= valB) {
        const result = (valA / valB) * 100;
        aggregate?.setValue(result.toFixed(2));
      } else {
        aggregate?.setValue('');
      }
    };

    const updateAggregateFromCGPA = () => {
      const valA = parseFloat(cgpaA?.value);
      const valB = parseFloat(cgpaB?.value);
      if (!isNaN(valA) && !isNaN(valB) && valB > 0 && valA <= valB) {
        const result = (valA / valB) * 95;
        aggregate?.setValue(result.toFixed(2));
      } else {
        aggregate?.setValue('');
      }

    };

    marksA?.valueChanges.subscribe(() => updateAggregateFromMarks());
    marksB?.valueChanges.subscribe(() => updateAggregateFromMarks());
    cgpaA?.valueChanges.subscribe(() => updateAggregateFromCGPA());
    cgpaB?.valueChanges.subscribe(() => updateAggregateFromCGPA());
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();

      const firstInvalidControl = Object.keys(this.studentForm.controls).find((key) => {
        const control = this.studentForm.get(key);
        return control && control.invalid && control.enabled;
      });

      if (firstInvalidControl) {
        const element = document.querySelector(`[formControlName="${firstInvalidControl}"]`) as HTMLElement;
        if (element) setTimeout(() => element.focus(), 0);
      }

      ['attachment1', 'attachment2'].forEach((key) => {
        const control = this.studentForm.get(key);
        if (control && !control.value ) {
        control.setErrors({ uploadFailed: true });
      }

    });
    
    this.dialog.alert('Please fill all required fields correctly.', 'ALERT');
      return;
    }
    
    const raw = this.studentForm.getRawValue();

    // ✅ Determine CGPA or Marks block used
    const usingCGPA = !!this.studentForm.get('cgpaA')?.value || !!this.studentForm.get('cgpaB')?.value;
    const usingMarks = !!this.studentForm.get('marksObtained')?.value || !!this.studentForm.get('marksTotal')?.value;

    // ✅ Format DOB
    if (raw.childDob) {
      const [dd, mm, yyyy] = raw.childDob.split('-');
      raw.childDob = `${yyyy}-${mm}-${dd}`;
    }

    const createdBy = sessionStorage.getItem('TOIID');
    if (!createdBy) {
      this.dialog.alert('User session expired. Please login again.', 'ALERT');
      return;
    }

    // ✅ Patch marksType and values
    let marksObtained = raw.marksObtained;
    let marksTotal = raw.marksTotal;

    if (usingCGPA) {
      marksObtained = raw.cgpaA;
      marksTotal = raw.cgpaB;
      this.studentForm.patchValue({ marksType: 'CGPA', marksObtained, marksTotal });
    } else if (usingMarks) {
      this.studentForm.patchValue({ marksType: 'normal', marksObtained, marksTotal });
    }

    // ✅ Calculate aggregate
    let aggregate = '';
    const mo = parseFloat(marksObtained);
    const mt = parseFloat(marksTotal);

    if (!isNaN(mo) && !isNaN(mt) && mt > 0 && mo <= mt) {
      aggregate = usingCGPA
        ? ((mo / mt) * 95).toFixed(2)
        : ((mo / mt) * 100).toFixed(2);
    }

    if (!aggregate) {
      this.dialog.alert('Aggregate could not be calculated. Please enter valid values.', 'ALERT');
      return;
    }

    this.studentForm.patchValue({ aggregate });

    const payload = this.studentForm.getRawValue();
    delete payload.cgpaA;
    delete payload.cgpaB;

    if (payload.courseApplied === 'Others' && payload.otherCourse?.trim()) {
      payload.courseApplied = payload.otherCourse;
    }

    // Application status logic
    if (this.flag === 'contiune') {
      this.status = 'C';
      this.applicationID = '';
    } else if (this.flag === 'edit') {
      if (this.status === 'L') this.status = 'EL';
      else if (this.status === 'LC') this.status = 'ELC';
    } else {
      this.status = 'N';
      this.applicationID = '';
    }

    const finalArray = [
      payload.childName,
      payload.childDob,
      payload.childGender,
      payload.childMarritalStatus,
      payload.childEmailId,
      payload.childMobile,
      payload.childContactNo,
      payload.examPassed,
      payload.passedYear,
      payload.firstAttempt,
      payload.schemeApplied,
      payload.schemeApplied,
      payload.marksType,
      marksObtained,
      marksTotal,
      marksObtained,
      payload.aggregate,
      payload.nameOfCollege,
      payload.durationOfCourse,
      payload.courseApplied,
      payload.docOption2 || 'No',
      payload.docOption3 || 'No',
      payload.attachment1,
      payload.attachment2,
      payload.attachment3 || 'NA',
      payload.attachment4 || 'NA',
      payload.attachment5 || 'NA',
      createdBy,
      createdBy,
      this.status,
      this.applicationID,
      0,
      payload.schemeYears
    ];
    this.loader.show();
    this.api.submitScholarshipForm(finalArray).subscribe({
      next: (res) => {
        if (res?.status === 'success') {
          this.applicationID = res?.data?.applicationId;
          this.loader.hide();
          this.dialog.alert('Form submitted successfully with applicationID: ' + res?.data?.applicationId, 'CONFIRMATION');
          this.onReset();
        } else if (res?.status === 'error') {
          this.loader.hide();
          this.dialog.alert('Duplicate entry found for the same user.');
        }
      },
      error: (err) => {
        console.error('Submission failed:', err);
        this.loader.hide();
        this.dialog.alert('Something went wrong while submitting. Please try again.');
      }
    });
    
  }

  onFileChange(event: { file: File | null }, controlName: string) {
    const { file } = event;
    const control = this.studentForm.get(controlName);

    if (!control) return;

    if (!file) {
      control.setValue(null); // Clear the control value
      control.setErrors({ uploadFailed: true }); // Optional custom error
      delete this.selectedFiles[controlName];
      return;
    }
    // ✅ Store the actual File object for validation to work
    this.selectedFiles[controlName] = file;
    this.removeFiles[controlName] = file.name;

    // Upload the file
  
    this.api.uploadAttachments(this.selectedFiles, this.applicationID).subscribe({
      next: (res) => {
        console.log('Files uploaded:', res);
        this.dialog.alert('File uploaded successfully.', 'CONFIRMATION');
        control.setValue(file.name); // Store name for reference
        control.setErrors(null);
        control.markAsTouched();
        control.updateValueAndValidity();
      },
      error: (err) => {
        console.error('File upload failed:', err);
        control.setValue(null);
        delete this.selectedFiles[controlName];
        this.dialog.alert('File upload failed. Please try again.');
      }
    });

    // Clear selectedFiles after each upload (optional — depends on your use case)
    this.selectedFiles = {};
  }

  onRemove(controlName: any) {

    const fileName = this.removeFiles[controlName];
    console.log(fileName);
    if (!fileName) {
      console.warn('No file name found for control:', controlName);
      return;
    }

    const encodedFileName = btoa(fileName);

    const body = new URLSearchParams();
    body.set('fileName', encodedFileName);
    body.set('type', '');
    body.set('applicationID', this.applicationID);
    body.set('flag', controlName.toUpperCase());

    this.api.deleteFile(body).subscribe({
      next: () => {

        console.log(`✅ File '${fileName}' deleted from server`);
        this.studentForm.get(controlName)?.setValue(null);
        this.studentForm.get(controlName)?.setErrors({ uploadFailed: true });
        delete this.removeFiles[controlName];
      },
      error: (err) => {
        console.error('❌ Error deleting file:', err);
        this.dialog.alert('Failed to remove file from server.');
      }
    });
  }

  onSchemeChange(event: any): void {
    const scheme = event?.target?.value || event;

    const attachment3 = this.studentForm.get('attachment3');
    const attachment4 = this.studentForm.get('attachment4');

    this.achiver = false;
    this.special = false;

    if (scheme === 'Graduate') {
      this.currentCourseOptions = this.courseOptions['graduate'];
    } else if (scheme === 'Post Graduate') {
      this.currentCourseOptions = this.courseOptions['postGraduate'];
    } else {
      this.currentCourseOptions = this.courseOptions['default'];

      if (scheme === 'National/State Level Achievers') {
        this.achiver = true;
      } else if (scheme === 'Students with special needs') {
        this.special = true;
      }
    }

    if (this.special) {
      attachment3?.setValidators([Validators.required]);
    } else {
      attachment3?.clearValidators();
      attachment3?.setValue(null);
    }
    attachment3?.updateValueAndValidity();

    if (this.achiver) {
      attachment4?.setValidators([Validators.required]);
    } else {
      attachment4?.clearValidators();
      attachment4?.setValue(null);
    }
    attachment4?.updateValueAndValidity();

    this.studentForm.patchValue({
      courseApplied: '',
      otherCourse: ''
    });

    this.showOtherCourseInput = false;
  }

  onCourseChange(event: any): void {
    const selectedCourse = event?.target?.value || event;
    const otherCourseControl = this.studentForm.get("otherCourse");

    this.showOtherCourseInput = selectedCourse === 'Others';

    if (this.showOtherCourseInput) {
      otherCourseControl?.setValidators([Validators.required]);
    } else {
      otherCourseControl?.clearValidators();
      otherCourseControl?.setValue(''); // Optional: clear the input if not 'others'
    }

    otherCourseControl?.updateValueAndValidity();
  }

  async downloadAndConvertFile(fileName: string): Promise<File | null> {
    try {
      const blob = await this.api.downloadFile(fileName).toPromise();
      if (!blob) return null;
      return new File([blob], fileName, { type: blob.type || 'application/octet-stream' });
    } catch (err) {
      console.error(`Failed to download ${fileName}`, err);
      return null;
    }
  }

  populateFormFromStudentData(data: any[], flag: any): void {
    if (!Array.isArray(data)) return;
    console.log('flag :', flag);

    if (flag === 'contiune') {
      const genderValue = this.getOptionIdFromLabel(this.genderOptions, data[3]);
      const maritalStatusValue = this.getOptionIdFromLabel(this.maritalStatuses, data[4]);

      setTimeout(() => {
        this.studentForm.patchValue({
          childName: data[1] || '',
          childDob: this.formatDateToDDMMYYYY(data[2]),
          childGender: genderValue,
          childMarritalStatus: maritalStatusValue,
          childEmailId: data[5] || '',
          childMobile: data[6],
          childContactNo: data[7]
        });

        this.applicationID = data[0] || '';
        this.status = data[30];
        // this.studentForm.get('parentName')?.setValue(data[37] || '');
        this.studentForm.get('childName')?.disable();
        this.studentForm.get('childDob')?.disable();
        this.studentForm.get('childGender')?.disable();
      });

    } else if (flag === 'edit') {
      const genderValue = this.getOptionIdFromLabel(this.genderOptions, data[3]);
      const maritalStatusValue = this.getOptionIdFromLabel(this.maritalStatuses, data[4]);
      const firstAttemptValue = this.getOptionIdFromLabel(this.attempts, data[10]);
      const schemeAppliedValue = this.getOptionIdFromLabel(this.schemes, data[11]);
      const schemeYearsValue = this.getOptionIdFromLabel(this.years, data[20]?.slice(-1));
      const durationOfCourseValue = this.getOptionIdFromLabel(this.durationYears, data[19]);

      const rawCourseId = data[20]?.split(' - ')[0]?.trim();
      let matchedCourseId = '';
      let isOtherCourse = false;

      const allCourses = Object.values(this.courseOptions).flat();
      const matched = allCourses.find(opt => opt.id === rawCourseId);

      if (matched) {
        matchedCourseId = matched.id;
        isOtherCourse = matched.id === 'Others';
      } else {
        matchedCourseId = 'Others';
        isOtherCourse = true;
      }

      this.showOtherCourseInput = isOtherCourse;

      const schemeLower = data[11]?.toLowerCase();
      if (schemeLower === 'graduate') {
        this.currentCourseOptions = this.courseOptions['graduate'];
      } else if (schemeLower === 'post graduate') {
        this.currentCourseOptions = this.courseOptions['postGraduate'];
      } else {
        this.currentCourseOptions = this.courseOptions['default'];
      }

      const scheme = data[11];
      this.special = scheme === 'Students with special needs';
      this.achiver = scheme === 'National/State Level Achievers';

      setTimeout(() => {
        this.studentForm.patchValue({
          childName: data[1] || '',
          childDob: this.formatDateToDDMMYYYY(data[2]),
          childGender: genderValue,
          childMarritalStatus: maritalStatusValue,
          childEmailId: data[5] || '',
          childMobile: data[6],
          childContactNo: data[7],
          examPassed: data[8] || '',
          passedYear: this.formatDateToDDMMYYYY(data[9]),
          firstAttempt: firstAttemptValue,
          nameOfCollege: data[18] || '',
          aggregate: data[17] || '',
          marksType: data[13] || '',
          schemeApplied: schemeAppliedValue,
          courseApplied: matchedCourseId,
          otherCourse: isOtherCourse ? rawCourseId : '',
          durationOfCourse: durationOfCourseValue,
          schemeYears: schemeYearsValue
        });

        // this.studentForm.get('parentName')?.setValue(data[37] || '');
        this.studentForm.get('childName')?.enable();
        this.studentForm.get('childDob')?.enable();
        this.studentForm.get('childGender')?.enable();

        const attachment3 = this.studentForm.get('attachment3');
        const attachment4 = this.studentForm.get('attachment4');

        if (this.special) {
          attachment3?.setValidators([Validators.required]);
        } else {
          attachment3?.clearValidators();
        }
        attachment3?.updateValueAndValidity();

        if (this.achiver) {
          attachment4?.setValidators([Validators.required]);
        } else {
          attachment4?.clearValidators();
        }
        attachment4?.updateValueAndValidity();
      });

      if (data[13] === 'normal') {
        setTimeout(() => {
          this.studentForm.patchValue({
            marksObtained: data[14] || '',
            marksTotal: data[15] || '',
          });
        });
      } else {
        setTimeout(() => {
          this.studentForm.patchValue({
            cgpaA: data[14] || '',
            cgpaB: data[15] || '',
          });
        });
      }

      this.applicationID = data[0];
      this.status = data[30];

      // 🔹 Populate uploaded attachments
      const filePromises: Promise<void>[] = [];
      // 🔹 Prefill uploaded attachments WITHOUT uploading again
      const attachmentPrefills: {
        key: 'attachment1' | 'attachment2' | 'attachment3' | 'attachment4';
        fileName: string | null;
        condition?: boolean;
      }[] = [
          { key: 'attachment1', fileName: data[23] },
          { key: 'attachment2', fileName: data[24] },
          { key: 'attachment3', fileName: data[25], condition: this.special },
          { key: 'attachment4', fileName: data[38], condition: this.achiver },
        ];

      attachmentPrefills.forEach(({ key, fileName, condition }) => {
        if (fileName && (condition === undefined || condition)) {
          this.studentForm.get(key)?.setValue(fileName);
          this.studentForm.get(key)?.setErrors(null);
          this.removeFiles[key] = fileName;
        }
      });


      Promise.all(filePromises).then(() => {
        console.log('✅ All attachments populated.');
      });
    }
  }

  getOptionIdFromLabel(
    options: { label: string; id: string }[],
    label: string | number
  ): string {
    const normalizedLabel = String(label).toLowerCase().trim();

    // 1. Exact match
    let found = options.find(opt =>
      opt.label?.toLowerCase()?.trim() === normalizedLabel
    );

    // 2. Partial match (e.g., '3' in '3 Years')
    if (!found) {
      found = options.find(opt =>
        opt.label?.toLowerCase()?.includes(normalizedLabel)
      );
    }
    return found?.id || '';
  }

  formatDateToDDMMYYYY(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // DD-MM-YYYY
    }
    return dateStr;
  }

  handleDOB(): void {
    const today = new Date();
    const YearsAgo = new Date();
    YearsAgo.setFullYear(today.getFullYear() - 12); // Minimum valid DOB

    const dobControl = this.studentForm.get('childDob');

    dobControl?.valueChanges.subscribe(date => {
      const selected = new Date(date);

      if (selected > YearsAgo) {
        this.dobTooRecent = true;
        dobControl.setErrors({ tooYoung: true });
      } else {
        this.dobTooRecent = false;
        if (dobControl.hasError('tooYoung')) {
          const errors = { ...dobControl.errors };
          delete errors['tooYoung'];
          dobControl.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    });
  }

  handleResultDateLimit(): void {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Normalize time
    oneYearAgo.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const resultControl = this.studentForm.get('passedYear');

    resultControl?.valueChanges.subscribe((date: any) => {
      const selected = new Date(date);
      selected.setHours(0, 0, 0, 0);

      const isOutOfRange = selected < oneYearAgo || selected >= today;

      this.isResultDateOutOfRange = isOutOfRange;

      if (isOutOfRange) {
        resultControl.setErrors({ ...resultControl.errors, outOfRange: true });
      } else {
        if (resultControl.hasError('outOfRange')) {
          const errors = { ...resultControl.errors };
          delete errors['outOfRange'];
          resultControl.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    });
  }

  onReset(): void {

    if (this.flag === 'contiune') {
      const resultControl = this.studentForm.get('passedYear');
      if (resultControl?.hasError('outOfRange')) {
        resultControl.setErrors(null);
      }
      // Store disabled field values first (so we can preserve them)
      const childName = this.studentForm.get('childName')?.value;
      const childDob = this.studentForm.get('childDob')?.value;
      const childGender = this.studentForm.get('childGender')?.value;

      // Reset the entire form
      this.studentForm.reset();

      // Restore disabled field values after reset
      this.studentForm.get('childName')?.setValue(childName);
      this.studentForm.get('childDob')?.setValue(childDob);
      this.studentForm.get('childGender')?.setValue(childGender);

      this.currentCourseOptions = this.courseOptions['default'];
      this.showOtherCourseInput = false;
      this.isResultDateOutOfRange = false;
      this.applicationID = '';
      this.setparent();
      this.handleCgpaAndMarksLogic();
      return
    }
    this.studentForm.reset();

    // Clear custom validation error manually for resultDate
    const resultControl = this.studentForm.get('passedYear');
    if (resultControl?.hasError('outOfRange')) {
      resultControl.setErrors(null);
    }

    this.studentForm.get('childName')?.enable();
    this.studentForm.get('childDob')?.enable();
    this.studentForm.get('childGender')?.enable();
    this.currentCourseOptions = this.courseOptions['default'];
    this.showOtherCourseInput = false;
    this.isResultDateOutOfRange = false;
    this.applicationID = '';
    this.setparent();
    this.handleCgpaAndMarksLogic();
  }

  onBack(): void {
    this.location.back();
  }
}

