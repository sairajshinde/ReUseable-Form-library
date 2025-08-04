import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { UiDirectivesModule } from '../../../../../projects/bccl-library/src/public-api';
import { getSharedMenu, setPopupService, MenuItem } from '../../../services/shared/menu.config';
import { PopupService } from '../../../services/shared/popup.service';
import { ApiService } from '../../../services/api.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
declare var bootstrap: any;

@Component({
  selector: 'app-check-status',
  standalone: true,
  imports: [
    UiDirectivesModule,
    RouterOutlet,
    RouterModule,
    CommonModule
  ],
  templateUrl: './check-status.component.html',
  styleUrl: './check-status.component.scss'
})
export class CheckStatusComponent implements OnInit {
  menu: MenuItem[] = [];
  tableData: any[] = [];
  selectedStudentDetails: any = {};
  tableColumns = [
    {key: 'studentId', label: 'Student ID',  isLink: true},
    { key: 'childName', label: 'Name' },
    { key: 'schemeApplied', label: 'Scheme' },
    { key: 'schemeYears', label: 'Year' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', isAction: true }
  ];
fieldList = [
  { key: 'childName', label: 'Name of the Student' },
  { key: 'childDob', label: 'Date of Birth' },
  { key: 'childGender', label: 'Gender' },
  { key: 'childEmailId', label: 'Email ID' },
  { key: 'childMaritalStatus', label: 'Marital Status' },
  { key: 'childContactNo', label: 'Student Contact No.' },
  { key: 'parentName', label: 'Name of the Employee (Parent)' },
  { key: 'parentContact', label: 'Employee Contact No.' },
  { key: 'examPassed', label: 'Exam Passed' },
  { key: 'firstAttempt', label: 'Passed in First Attempt' },
  { key: 'resultDate', label: 'Result Date' },
  { key: 'marksObtained', label: 'Marks Obtained' },
  { key: 'marksTotal', label: 'Marks Out Of' },
  { key: 'aggregate', label: 'Aggregate (%)' },
  { key: 'schemeApplied', label: 'Scheme Applied' },
  { key: 'courseApplied', label: 'Course Applied' },
  { key: 'courseDuration', label: 'Duration of the Course' },
  { key: 'currentYear', label: 'Current Year' },
  { key: 'collegeName', label: 'Name of College' },
  { key: 'doc1', label: 'Student Marksheet' },
  { key: 'doc2', label: 'Admission Letter' },
  { key: 'doc3', label: 'Special Student supporting document' },
  { key: 'doc4', label: 'National / State Level Achievement Certificate' }
];

  constructor(private popupService: PopupService, private api: ApiService, public router: Router) {}

  ngOnInit(): void {
    setPopupService(this.popupService);
    this.menu = getSharedMenu();
    this.fetchStudentData();
  }

  fetchStudentData(): void {
    this.api.getDetailsByTOID().subscribe({
      next: (res) => {
        const rawData = res?.[0]?.data || [];
        this.tableData = rawData.map((item: any[]) => {
          const statusLabel = this.mapStatus(item[30]);
          return {
            studentId: this.getStudentLink(item[0], item),
            childName: item[1],
            schemeApplied: item[11],
            schemeYears: item[31],
            status: statusLabel,
            actions: this.getActions(statusLabel, item),
            rawData: item
          };
        });
      },
      error: (err) => {
        console.error('Failed to load data:', err);
        alert('Unable to fetch student data.');
      }
    });
  }

  mapStatus(code: string): string {
    if (['L', 'LC'].includes(code)) return 'In Process';
    if (['A', 'AC'].includes(code)) return 'Accepted';
    if (['R', 'RC'].includes(code)) return 'Rejected';
    if (code === 'P') return 'Awarded';
    return 'Unknown';
  }

  getStudentLink(id: string, student: any): { label: string, tooltip?: string, callback: () => void } {
    return {
      label: id,
      tooltip: 'View application',
      callback: () => this.showStudentDetailsModal(student)
    };
  }

  getActions(status: string, student: any): any[] {
    const actions: any[] = [];
    if (status === 'In Process') {
      actions.push({
        icon: '✏️',
        label: 'Edit Application',
        tooltip: 'Edit this application',
        callback: () => this.editStudent(student)
      });
    }
    if (status === 'Awarded') {
      actions.push(
        {
          icon: '📤',
          label: 'Upload Cheque',
          tooltip: 'Upload Cheque',
          callback: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.jpg,.jpeg,.png';
            input.style.display = 'none';

            input.addEventListener('change', (event: any) => {
              const file: File = event.target.files[0];
              if (file) {
                this.uploadCheque(student, file);
              }
            });

            document.body.appendChild(input);
            input.click();

            input.addEventListener('click', () => {
              setTimeout(() => document.body.removeChild(input), 1000);
            });
          }
        },
        {
          icon: '📄',
          label: 'Download Certificate',
          tooltip: 'Download Certificate',
          callback: () => this.downloadCertificate(student)
        },
        {
          icon: '🔁',
          label: 'Continue Scholarship',
          tooltip: 'Continue to Next Year',
          callback: () => this.continueScholarship(student)
        }
      );
    }
    return actions;
  }

  editStudent(student: any) {
    this.router.navigate(['/new-scholarship'], {
      state: { studentData: student, flag : 'edit' }
    });
  }

  uploadCheque(student: any, file: File): void {
    const selectedFiles: { [key: string]: File } = {};
    if (file) {
      selectedFiles['cheque'] = file;
      this.api.uploadAttachments(selectedFiles).subscribe({
        next: (res) => {
          console.log('Files uploaded:', res);
        },
        error: (err) => {
          console.error('File upload failed:', err);
          alert('File upload failed. Please try again.');
        }
      });
    }
  }

  downloadCertificate(student: any): void {
    const body = new URLSearchParams();
    body.set('passedYear', student[9]);
    body.set('name', student[1]);
    body.set('category', student[37]);
    body.set('exam', student[8]);

    alert(`Downloading Certificate for: ${student[1]}`);

    this.api.downloadCertificate(body).subscribe({
      next: (blob: Blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `${student[1]}-certificate.pdf`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: (err) => {
        console.error('Download failed', err);
        alert('Failed to download certificate.');
      }
    });
  }

  continueScholarship(student: any) {
    this.router.navigate(['/new-scholarship'], {
      state: { studentData: student, flag : 'contiune' }
    });
  }


  showStudentDetailsModal(data: any[]): void {
    const clean = (val: any) => val && val !== 'NA' && val !== '0' && val.toString().trim() !== '';
    this.selectedStudentDetails = {
      applicationId: clean(data[0]) ? data[0] : null,
      childName: clean(data[1]) ? data[1] : null,
      childDob: clean(data[2]) ? data[2] : null,
      childGender: clean(data[3]) ? data[3] : null,
      childEmailId: clean(data[5]) ? data[5] : null,
      childMaritalStatus: clean(data[4]) ? data[4] : null,
      childContactNo: clean(data[6]) ? data[6] : null,
      parentName: clean(data[37]) ? data[37] : null,
      parentContact: clean(data[7]) ? data[7] : null,
      examPassed: clean(data[8]) ? data[8] : null,
      firstAttempt: clean(data[10]) ? data[10] : null,
      resultDate: clean(data[9]) ? data[9] : null,
      collegeName: clean(data[18]) ? data[18] : null,
      marksObtained: clean(data[14]) ? data[14] : null,
      marksTotal: clean(data[15]) ? data[15] : null,
      aggregate: clean(data[17]) ? data[17] : null,
      schemeApplied: clean(data[11]) ? data[11] : null,
      courseApplied: clean(data[20]) ? data[20] : null,
      courseDuration: clean(data[19]) ? data[19] : null,
      currentYear: clean(data[20]) ? data[20]?.slice(-1) : null,
      doc1: clean(data[23]) ? data[23] : null,
      doc2: clean(data[24]) ? data[24] : null,
      doc3: clean(data[25]) ? data[25] : null,
      doc4: clean(data[38]) ? data[38] : null
    };

    const modalElement = document.getElementById('studentDetailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
