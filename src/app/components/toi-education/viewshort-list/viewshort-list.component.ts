import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { UiDirectivesModule } from '../../../../../projects/bccl-library/src/public-api';
import { getSharedMenu, setPopupService, MenuItem, initMenu } from '../../../services/shared/menu.config';
import { PopupService } from '../../../services/shared/popup.service';
import { LoaderService } from '../../../services/shared/loader.service';
import { ApiService } from '../../../services/api.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonDialogService } from '../../../services/shared/common-dialog.service';
import { environment } from '../../../../environments/environment';
import { publicApi } from '../../../services/publicApi/publicApi';
import { CommonService } from '../../../services/shared/common.service';
import { HttpResponse } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
declare var bootstrap: any;


@Component({
  selector: 'app-viewshort-list',
  standalone: true,
  imports: [UiDirectivesModule, 
    RouterOutlet,
    RouterModule,
    CommonModule,
  FormsModule],
  templateUrl: './viewshort-list.component.html',
  styleUrl: './viewshort-list.component.scss'
})
export class ViewshortListComponent implements OnInit {
menu: MenuItem[] = [];
 tableData: any[] = [];
today = new Date();
flag = '';
 selectedScheme: string = '';
 remarks: string = '';
  selectedStudentDetails: any = {};
tableColumns = [
  { key: 'srNo', label: 'Sr No.' },
  { key: 'applicationNo', label: 'Application No.', isLink: true },
  { key: 'employeeName', label: 'Name of Employee' },
  { key: 'designation', label: 'Designation' },
  { key: 'function', label: 'Function' },
  { key: 'appliedPlan', label: 'Applied Plan' },
  { key: 'aggregate', label: 'Aggregate' },
  { key: 'Action', label: 'Action', isAction: true },
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
   schemes = [
    { label: 'Under Graduate', id: 'Under Graduate' },
    { label: 'Graduate', id: 'Graduate' },
    { label: 'Post Graduate', id: 'Post Graduate' },
    { label: 'Students with special needs', id: 'Students with special needs' },
    { label: 'National/State Level Achievers', id: 'National/State Level Achievers' }
  ];
  currentYear = new Date().getFullYear();
 constructor (private popupService: PopupService,  private api: ApiService, public router: Router, private loader: LoaderService, private dialog : CommonDialogService, private common: CommonService){}
ngOnInit(): void {
  // 🔹 Restore processor role from sessionStorage and rebuild menu
  initMenu(this.common);

  // 🔹 Attach popup service (so ℹ️ icon works)
  setPopupService(this.popupService);

  // 🔹 Finally, get the built menu
  this.menu = getSharedMenu();

  // Your existing logic
  this.loadData();
  this.remarks = '';
  this.selectedScheme = 'Graduate';
}


loadData() {
  this.loader.show();
  Promise.resolve().then(() => {
 this.api.getAcceptedList(this.selectedScheme, this.currentYear).subscribe({
      next: (res) => {
        console.log('res', res);
        const rawData = res?.[0]?.data || [];

        let counter = 1;

        this.tableData = rawData.map((item: any[]) => {
          const statusLabel = this.mapStatus(item[30]);

          const row = {
            srNo: counter++, // sequential 1,2,3...
            applicationNo: this.getStudentLink(item[0], item),
            employeeName: item[34] || '',
            designation: item[35] || '',
            function: item[36] || '',
            appliedPlan: item[11] || '',
            aggregate: item[17] || '',
            Action: this.getActions(statusLabel, item), 
          };

          return row;
        });

        this.loader.hide();
      },
      error: (err) => {
        this.loader.hide();
        console.error('Failed to load data:', err);
        this.dialog.alert('Session expired! Please log in again.');
      },
    });
  });
}
  mapStatus(code: string): string {
    if (['L', 'LC'].includes(code)) return 'In Process';
    if (['A', 'AC'].includes(code)) return 'Accepted';
    if (['R', 'RC'].includes(code)) return 'Rejected';
    if (['P', 'PC'].includes(code)) return 'Awarded';
    return 'Unknown';
  }

 getActions(status: string, item: any): any[] {
  const actions: any[] = [];
  if (status === 'In Process'){
       actions.push({
      icon: '🔃',
      label: 'In Process',
      tooltip: 'In Process'
    });
  }
  if (status === 'Accepted') {
    actions.push({
      icon: '',
      label: 'Award',
      tooltip: 'Shortlisted',
      callback: () => this.awardApplication(item),
    });
  }
    if (status === 'Rejected') {
    actions.push({
      icon: '❌',
      label: '',
      tooltip: 'Rejected'
    });
  }

  if (status === 'Awarded') {
      actions.push(
        {
        icon: '🏆',
        label: '',
        tooltip: 'Awarded',
        className: 'btn btn-light flag disable'
      }
      )
    }
  
  return actions;
}

awardApplication(item: any[]) {
    this.dialog.confirm('Would you like to finalize and award this application?', 'CONFIRMATION')
    .then(result => {
      if (result) {
         console.log('Awared:', item[0]);
  const ApplicationNo = item[0];
  const prevStatus = item[30];
  let status = '';
  if(prevStatus === 'A'){
    status = 'P';
  } else if(prevStatus === 'AC'){
    status = 'PC';
  } else {
    status = 'P';
  }
  this.loader.show();
  Promise.resolve().then(() => {
    this.api.updatePending(ApplicationNo, status, this.remarks, prevStatus).subscribe({
      next: (res) => {
        this.loader.hide();
        console.log(res);
        const flag = res?.[0]?.data;
        if(flag){
          this.dialog.alert('Application awarded successfully', 'CONFIRMATION').then(() =>{
            this.loadData();
          })
        } else {
          this.dialog.alert('Unable to award this application.');
        }
      },
          error: (err) => {
            this.loader.hide();
            console.error('Failed to load data:', err);
            this.dialog.alert('Something went wrong while awarding the application. Please try again.');
          },
        })
      });
      }
    });

  
}
getStudentLink(id: string, student: any): { label: string, tooltip?: string, callback: () => void } {
    return {
      label: id,
      tooltip: 'View application',
      callback: () => this.showStudentDetailsModal(student)
    };
  }

onSchemeChange(event: any): void {
    const scheme = event?.target?.value || event;
    this.selectedScheme = scheme;
    this.loadData();
}
showStudentDetailsModal(data: any[]): void {
  this.flag = data[33];
  console.log(data);
  const clean = (val: any) => val && val !== 'NA' && val !== '0' && val.toString().trim() !== '';
    const formatDuration = (val: any) => clean(val) ? `${val} year(s)` : null;

  const formatCurrentYear = (courseApplied: any) => {
    if (!clean(courseApplied) || !courseApplied.includes('-')) return null;

    const yearPart = courseApplied.split('-').pop()?.trim(); // take last part after '-'
    const yearMap: { [key: string]: string } = {
      '1': '1st Year',
      '2': '2nd Year',
      '3': '3rd Year',
      '4': '4th Year',
      '5': '5th Year'
    };

    return yearMap[yearPart] || null;
  };

  this.selectedStudentDetails = {
    applicationId: clean(data[0]) ? data[0] : null,
    childName: clean(data[1]) ? data[1] : null,
    childDob: clean(data[2]) ? data[2] : null,
    childGender: clean(data[3]) ? data[3] : null,
    childEmailId: clean(data[5]) ? data[5] : null,
    childMaritalStatus: clean(data[4]) ? data[4] : null,
    childContactNo: clean(data[6]) ? data[6] : null,
    parentName: clean(data[34]) ? data[34] : null,
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
    courseDuration: formatDuration(data[19]),
    currentYear: formatCurrentYear(data[20]),
    doc1: clean(data[23]) ? data[23] : null,
    doc2: clean(data[24]) ? data[24] : null,
    doc3: clean(data[25]) ? data[25] : null,
    doc4: clean(data[41]) ? data[41] : null
  };

  const modalElement = document.getElementById('studentDetailsModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

downloadDocument(fileName: string, type: string = '', applicationId: string = ''): void {
  if (!fileName) return;

  this.api.downloadFile(fileName, type, applicationId, this.flag).subscribe({
    next: (res: HttpResponse<Blob>) => {
      const blob = res.body;

      if (!blob || blob.size === 0) {
        this.dialog.alert('File not found');
        return;
      }

      // 🔹 Try parsing blob as JSON (covers cases where server sends application/octet-stream with error object)
      const tryParseAsJson = (blob: Blob) => {
        return new Promise<any>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              resolve(JSON.parse(reader.result as string));
            } catch {
              reject();
            }
          };
          reader.onerror = () => reject();
          reader.readAsText(blob);
        });
      };

      tryParseAsJson(blob)
        .then((json) => {
          // ✅ It's JSON → handle success/failure
          if (json && json.success === false) {
            this.dialog.alert(json.message || 'File not found.');
            return;
          }

          // If JSON but valid success = true with file info → fallback to file download
          this.triggerDownload(blob, fileName);
        })
        .catch(() => {
          // ❌ Not JSON → treat as real file
          this.triggerDownload(blob, fileName);
        });
    },
    error: (err) => {
      console.error('Download failed:', err);
      this.dialog.alert('Failed to download the file. Please try again.');
    }
  });
}

private triggerDownload(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => window.URL.revokeObjectURL(url), 100);
}

printStudentDetails(): void {
  const modalContent = document.querySelector('#studentDetailsModal .modal-body') as HTMLElement;
  const printArea = document.getElementById('printArea');

  if (!modalContent || !printArea) return;

  // Copy modal body into .content
  const contentDiv = printArea.querySelector('.content') as HTMLElement;
  if (contentDiv) {
    contentDiv.innerHTML = modalContent.innerHTML;
  }

  printArea.style.display = 'block';

  // ✅ Show loader
  this.loader.show();

  html2canvas(printArea, { scale: 2, useCORS: true }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    if (!imgData.startsWith('data:image/png')) {
      console.error('❌ Invalid PNG data');
      printArea.style.display = 'none';
      this.loader.hide();
      this.dialog.alert('Unexpected error while processing the data, Please try again!', 'ALERT');
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // ✅ Load logo and center it
    const logo = 'logo/new_logo.jpeg';
    const logoImg = new Image();
    logoImg.src = logo;

    logoImg.onload = () => {
      const logoWidth = 45;
      const logoHeight = 23;
      const xPos = (pageWidth - logoWidth) / 2;
      const yPos = 10;

      pdf.addImage(logoImg, 'JPEG', xPos, yPos, logoWidth, logoHeight);

      // Content starts below logo
      const contentY = yPos + logoHeight + 10;
      pdf.addImage(imgData, 'PNG', 0, contentY, pageWidth, pageHeight - contentY);

      // ✅ Save file
      pdf.save(`Application_${this.selectedStudentDetails.childName}_${this.selectedStudentDetails.applicationId}.pdf`);

      // ✅ Hide loader and show confirmation
      this.loader.hide();
      this.dialog.alert(
        'File has been downloaded successfully.',
        'CONFIRMATION'
      );

      printArea.style.display = 'none';
    };
  }).catch(err => {
    console.error('❌ html2canvas failed:', err);
    this.loader.hide();
    this.dialog.alert('Failed to generate Pdf file. Please try again.', 'ALERT');
    printArea.style.display = 'none';
  });
}
}
