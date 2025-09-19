
// import {
//   Directive,
//   ElementRef,
//   Renderer2,
//   AfterViewInit,
//   Input,
//   Output,
//   EventEmitter,
//   OnDestroy,
//   inject
// } from '@angular/core';
// import { NgControl } from '@angular/forms';

// @Directive({
//   selector: '[libFileupload]',
//   standalone: true
// })
// export class FileuploadDirective implements AfterViewInit, OnDestroy {
//   @Input('libLabelText') labelConfig: [string, string] = ['#a1a1a1', ''];
//   @Input() controlName: string = '';
//   @Input() allowedExtensions: string[] = ['.svg', '.pdf', '.jpg', '.jpeg', '.png'];
//   @Output() fileSelected = new EventEmitter<{ file: File | null; controlName: string }>();
//   @Output() fileCleared = new EventEmitter<string>();

//   private fileInput!: HTMLInputElement;
//   private displayText!: HTMLElement;
//   private clearBtn!: HTMLElement;
//   private errorMsg!: HTMLElement;
//   private currentFileURL: string | null = null;
//   private removeDisplayTextClickListener: (() => void) | null = null;
//   private isRequired = false;
//   private dialogOpen = false;
//   private initialLoad = true;
//   private clickLocked = false; // ✅ added for debounce

//   private ngControl = inject(NgControl, { optional: true });

//   constructor(private el: ElementRef, private renderer: Renderer2) {}

//   ngAfterViewInit(): void {
//     const host = this.el.nativeElement as HTMLElement;
//     const parent = host.parentElement;
//     if (!parent) return;

//     this.isRequired = host.hasAttribute('librequired');
//     const [labelColor, labelText] = this.labelConfig ?? ['#a1a1a1', ''];

//     const wrapper = this.renderer.createElement('div');
//     this.renderer.setStyle(wrapper, 'display', 'flex');
//     this.renderer.setStyle(wrapper, 'flexDirection', 'column');
//     this.renderer.setStyle(wrapper, 'width', '100%');
//     this.renderer.setStyle(wrapper, 'margin', '6px 0');

//     const label = this.renderer.createElement('label');
//     this.renderer.setStyle(label, 'fontSize', '14px');
//     this.renderer.setStyle(label, 'fontWeight', '500');
//     this.renderer.setStyle(label, 'fontFamily', 'Open Sans');
//     this.renderer.setStyle(label, 'color', labelColor);
//     this.renderer.setStyle(label, 'marginBottom', '4px');
//     this.renderer.setStyle(label, 'minHeight', '40px');
//     this.renderer.setStyle(label, 'lineHeight', '20px');
//     this.renderer.setStyle(label, 'whiteSpace', 'pre-wrap');
//     this.renderer.setProperty(label, 'innerText', labelText);

//     this.fileInput = this.renderer.createElement('input');
//     this.renderer.setAttribute(this.fileInput, 'type', 'file');
//     this.renderer.setAttribute(this.fileInput, 'accept', this.allowedExtensions.join(','));
//     this.renderer.setStyle(this.fileInput, 'display', 'none');

//     const displayRow = this.renderer.createElement('div');
//     this.renderer.setStyle(displayRow, 'display', 'flex');
//     this.renderer.setStyle(displayRow, 'alignItems', 'center');
//     this.renderer.setStyle(displayRow, 'gap', '8px');
//     this.renderer.setStyle(displayRow, 'padding', '6px 0');
//     this.renderer.setStyle(displayRow, 'cursor', 'pointer');
//     this.renderer.setAttribute(displayRow, 'tabindex', '0');

//     const iconSpan = this.renderer.createElement('span');
//     this.renderer.setStyle(iconSpan, 'width', '23px');
//     this.renderer.setStyle(iconSpan, 'height', '20px');
//     this.renderer.setProperty(
//       iconSpan,
//       'innerHTML',
//       `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
//         <path d="M19.35 10.04A7.49 7.49 0 0 0 5.01 9.17 6 6 0 0 0 6 21h13a5 5 0 0 0 .35-10.96z" fill="white" stroke="grey" stroke-width="1.5"/>
//         <path d="M13 9v15h-2v-6H8l4-4 4 4h-3z" fill="grey"/>
//       </svg>
//     `
//     );

//     const fileContainer = this.renderer.createElement('div');
//     this.renderer.setStyle(fileContainer, 'display', 'flex');
//     this.renderer.setStyle(fileContainer, 'alignItems', 'center');
//     this.renderer.setStyle(fileContainer, 'maxWidth', '250px');
//     this.renderer.setStyle(fileContainer, 'whiteSpace', 'nowrap');
//     this.renderer.setStyle(fileContainer, 'overflow', 'hidden');
//     this.renderer.setStyle(fileContainer, 'textOverflow', 'ellipsis');

//     this.displayText = this.renderer.createElement('span');
//     this.renderer.setStyle(this.displayText, 'fontSize', '14px');
//     this.renderer.setStyle(this.displayText, 'color', '#666');
//     this.renderer.setStyle(this.displayText, 'fontFamily', 'Open Sans');
//     this.renderer.setStyle(this.displayText, 'maxWidth', '200px');
//     this.renderer.setStyle(this.displayText, 'padding-top', '8px');
//     this.renderer.setStyle(this.displayText, 'overflow', 'hidden');
//     this.renderer.setStyle(this.displayText, 'textOverflow', 'ellipsis');
//     this.renderer.setStyle(this.displayText, 'whiteSpace', 'nowrap');
//     this.renderer.setStyle(this.displayText, 'display', 'inline-block');
//     this.renderer.setAttribute(this.displayText, 'title', 'No file chosen');
//     this.renderer.setProperty(this.displayText, 'innerText', 'No file chosen');

//     this.clearBtn = this.renderer.createElement('span');
//     this.renderer.setStyle(this.clearBtn, 'color', 'black');
//     this.renderer.setStyle(this.clearBtn, 'fontSize', '20px');
//     this.renderer.setStyle(this.clearBtn, 'cursor', 'pointer');
//     this.renderer.setStyle(this.clearBtn, 'marginLeft', '4px');
//     this.renderer.setStyle(this.clearBtn, 'marginTop', '6px');
//     this.renderer.setStyle(this.clearBtn, 'userSelect', 'none');
//     this.renderer.setStyle(this.clearBtn, 'display', 'none');
//     this.renderer.setProperty(this.clearBtn, 'innerText', '×');

//     this.renderer.appendChild(fileContainer, this.displayText);
//     this.renderer.appendChild(fileContainer, this.clearBtn);
//     this.renderer.appendChild(displayRow, iconSpan);
//     this.renderer.appendChild(displayRow, fileContainer);

//     this.renderer.insertBefore(parent, wrapper, host);
//     this.renderer.removeChild(parent, host);
//     this.renderer.appendChild(wrapper, label);
//     this.renderer.appendChild(wrapper, displayRow);
//     this.renderer.appendChild(wrapper, this.fileInput);

//     this.errorMsg = this.renderer.createElement('span');
//     this.renderer.setStyle(this.errorMsg, 'color', 'red');
//     this.renderer.setStyle(this.errorMsg, 'fontFamily', '"Open Sans", sans-serif');
//     this.renderer.setStyle(this.errorMsg, 'fontSize', '12px');
//     this.renderer.setStyle(this.errorMsg, 'marginTop', '2px');
//     this.renderer.setStyle(this.errorMsg, 'display', 'block');
//     this.renderer.setProperty(this.errorMsg, 'innerText', '');
//     this.renderer.appendChild(wrapper, this.errorMsg);

//     if (this.ngControl?.control && this.isRequired) {
//       const validators = this.ngControl.control.validator ? [this.ngControl.control.validator] : [];
//       this.ngControl.control.setValidators([
//         ...validators,
//         control => (control.value ? null : { required: true })
//       ]);
//       this.ngControl.control.updateValueAndValidity();
//     }

//     // ✅ displayRow click → open dialog only if no file chosen
//     this.renderer.listen(displayRow, 'click', () => {
//       if (this.ngControl?.control?.value) return; // do nothing if file exists
//       this.dialogOpen = true;
//       this.fileInput.click();
//     });

//     // ✅ iconSpan click → always open dialog (with debounce)
//     this.renderer.listen(iconSpan, 'click', (e: Event) => {
//       e.stopPropagation();
//       if (this.clickLocked) return;
//       this.clickLocked = true;
//       setTimeout(() => (this.clickLocked = false), 500);

//       this.dialogOpen = true;
//       this.fileInput.click();
//     });

//     this.renderer.listen(this.fileInput, 'blur', () => {
//       if (this.dialogOpen && !this.fileInput.files?.length) {
//         this.dialogOpen = false;
//         this.ngControl?.control?.markAsTouched();
//       }
//     });

//     this.renderer.listen(this.fileInput, 'change', (event: Event) => {
//       const target = event.target as HTMLInputElement;
//       const file = target.files?.[0];
//       this.dialogOpen = false;

//       if (!file) {
//         this.fileInput.value = '';
//         return;
//       }

//       const ext = '.' + file.name.split('.').pop()?.toLowerCase();
//       if (!this.allowedExtensions.includes(ext)) {
//         this.setError(`Invalid file type. Allowed: ${this.allowedExtensions.join(', ')}`);
//         this.fileInput.value = '';
//         return;
//       }

//       if (file.size > 10 * 1024 * 1024) {
//         this.setError('File size exceeds 10MB.');
//         this.fileInput.value = '';
//         return;
//       }

//       this.clearError();
//       this.updateDisplayWithFile(file);
//       this.fileSelected.emit({ file, controlName: this.controlName });
//       this.ngControl?.control?.setValue(file);
//       this.ngControl?.control?.markAsTouched();
//     });

//     this.renderer.listen(this.clearBtn, 'click', (e: Event) => {
//       e.stopPropagation();
//       this.clearError();
//       this.resetFileInput();
//       this.fileSelected.emit({ file: null, controlName: this.controlName });
//       this.fileCleared.emit(this.controlName);
//       this.ngControl?.control?.setValue(null);
//       this.ngControl?.control?.markAsTouched();
//     });

//     if (this.ngControl?.control?.value) {
//       this.handleValueChange(this.ngControl.control.value);
//     }

//     this.ngControl?.control?.valueChanges.subscribe(value => {
//       this.handleValueChange(value);
//       if (!this.initialLoad) {
//         // no-op
//       } else {
//         this.initialLoad = false;
//       }
//     });
//   }

//   private handleValueChange(value: any) {
//     if (this.removeDisplayTextClickListener) {
//       this.removeDisplayTextClickListener();
//       this.removeDisplayTextClickListener = null;
//     }
//     if (this.currentFileURL) {
//       URL.revokeObjectURL(this.currentFileURL);
//       this.currentFileURL = null;
//     }

//     if (!value) {
//       this.resetFileInput();
//       return;
//     }

//     if (value instanceof File) {
//       this.updateDisplayWithFile(value);
//       return;
//     }


//     if (typeof value === 'string') {
//   this.updateDisplayText(value);
//   this.renderer.setStyle(this.clearBtn, 'display', 'inline');


//   // ✅ assign new one safely
// this.removeDisplayTextClickListener = this.renderer.listen(
//   this.displayText,
//   'click',
//   (e: Event) => {
//     e.stopPropagation();

//     // Disable further clicks until finished
//     (e.currentTarget as HTMLElement).style.pointerEvents = 'none';

//     const encoded = btoa(value);
//     const url = `https://uatjiffy.timesgroup.com/timescape/api/scholarship/downloadFile?fileName=${encoded}&type=&applicationId=`;

//     const link = document.createElement('a');
//     link.href = url;
//     link.download = value;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     // Re-enable after short delay (or after response if async)
//     setTimeout(() => {
//       (e.currentTarget as HTMLElement).style.pointerEvents = 'auto';
//     }, 1000);
//   }
// );

// }

//   }

//   private updateDisplayWithFile(file: File) {
//     this.updateDisplayText(file.name);
//     this.renderer.setStyle(this.clearBtn, 'display', 'inline');

//     this.currentFileURL = URL.createObjectURL(file);
//     this.removeDisplayTextClickListener = this.renderer.listen(
//       this.displayText,
//       'click',
//       (e: Event) => {
//         e.stopPropagation();
//         window.open(this.currentFileURL!, '_blank', 'noopener,noreferrer');
//       }
//     );
//   }

//   private resetFileInput() {
//     if (this.currentFileURL) {
//       URL.revokeObjectURL(this.currentFileURL);
//       this.currentFileURL = null;
//     }
//     this.fileInput.value = '';
//     this.updateDisplayText('No file chosen');
//     this.renderer.setStyle(this.clearBtn, 'display', 'none');

//     if (this.removeDisplayTextClickListener) {
//       this.removeDisplayTextClickListener();
//       this.removeDisplayTextClickListener = null;
//     }
//   }

//   private updateDisplayText(text: string) {
//     this.renderer.setProperty(this.displayText, 'innerText', text);
//     this.renderer.setAttribute(this.displayText, 'title', text);
//   }

//   private setError(msg: string) {
//     this.renderer.setProperty(this.errorMsg, 'innerText', msg || '');
//   }

//   private clearError() {
//     this.renderer.setProperty(this.errorMsg, 'innerText', '');
//   }

//   ngOnDestroy(): void {
//     this.removeDisplayTextClickListener?.();
//     if (this.currentFileURL) URL.revokeObjectURL(this.currentFileURL);
//   }
// }

// import {
//   Directive,
//   ElementRef,
//   Renderer2,
//   AfterViewInit,
//   Input,
//   Output,
//   EventEmitter,
//   OnDestroy,
//   inject
// } from '@angular/core';
// import { NgControl } from '@angular/forms';

// @Directive({
//   selector: '[libFileupload]',
//   standalone: true
// })
// export class FileuploadDirective implements AfterViewInit, OnDestroy {
//   @Input('libLabelText') labelConfig: [string, string] = ['#a1a1a1', ''];
//   @Input() controlName: string = '';
//   @Input() allowedExtensions: string[] = ['.svg', '.pdf', '.jpg', '.jpeg', '.png'];

//   @Output() fileSelected = new EventEmitter<{ file: File | null; controlName: string }>();
//   @Output() fileCleared = new EventEmitter<string>();
//   @Output() fileDownload = new EventEmitter<{ fileName: string; controlName: string }>();

//   private fileInput!: HTMLInputElement;
//   private displayText!: HTMLElement;
//   private clearBtn!: HTMLElement;
//   private errorMsg!: HTMLElement;
//   private uploadIcon!: HTMLElement;
//   private downloadIcon!: HTMLElement;
//   private isRequired = false;
//   private dialogOpen = false;
//   private initialLoad = true;
//   private clickLocked = false;

//   private currentFileURL: string | null = null;
//   private removeDisplayTextClickListener: (() => void) | null = null;

//   private ngControl = inject(NgControl, { optional: true });

//   constructor(private el: ElementRef, private renderer: Renderer2) {}

//   ngAfterViewInit(): void {
//     const host = this.el.nativeElement as HTMLElement;
//     const parent = host.parentElement;
//     if (!parent) return;

//     this.isRequired = host.hasAttribute('librequired');
//     const [labelColor, labelText] = this.labelConfig ?? ['#a1a1a1', ''];

//     const wrapper = this.renderer.createElement('div');
//     this.renderer.setStyle(wrapper, 'display', 'flex');
//     this.renderer.setStyle(wrapper, 'flexDirection', 'column');
//     this.renderer.setStyle(wrapper, 'width', '100%');
//     this.renderer.setStyle(wrapper, 'margin', '6px 0');

//     const label = this.renderer.createElement('label');
//     this.renderer.setStyle(label, 'fontSize', '14px');
//     this.renderer.setStyle(label, 'fontWeight', '500');
//     this.renderer.setStyle(label, 'fontFamily', 'Open Sans');
//     this.renderer.setStyle(label, 'color', labelColor);
//     this.renderer.setStyle(label, 'marginBottom', '4px');
//     this.renderer.setStyle(label, 'minHeight', '40px');
//     this.renderer.setStyle(label, 'lineHeight', '20px');
//     this.renderer.setStyle(label, 'whiteSpace', 'pre-wrap');
//     this.renderer.setProperty(label, 'innerText', labelText);

//     this.fileInput = this.renderer.createElement('input');
//     this.renderer.setAttribute(this.fileInput, 'type', 'file');
//     this.renderer.setAttribute(this.fileInput, 'accept', this.allowedExtensions.join(','));
//     this.renderer.setStyle(this.fileInput, 'display', 'none');

//     const displayRow = this.renderer.createElement('div');
//     this.renderer.setStyle(displayRow, 'display', 'flex');
//     this.renderer.setStyle(displayRow, 'alignItems', 'center');
//     this.renderer.setStyle(displayRow, 'gap', '8px');
//     this.renderer.setStyle(displayRow, 'padding', '6px 0');
//     this.renderer.setStyle(displayRow, 'cursor', 'pointer');
//     this.renderer.setAttribute(displayRow, 'tabindex', '0');

//     // Upload icon
//     this.uploadIcon = this.renderer.createElement('span');
//     this.renderer.setStyle(this.uploadIcon, 'width', '23px');
//     this.renderer.setStyle(this.uploadIcon, 'height', '20px');
//     this.renderer.setProperty(
//       this.uploadIcon,
//       'innerHTML',
//       `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
//         <path d="M19.35 10.04A7.49 7.49 0 0 0 5.01 9.17 6 6 0 0 0 6 21h13a5 5 0 0 0 .35-10.96z" fill="white" stroke="grey" stroke-width="1.5"/>
//         <path d="M13 9v15h-2v-6H8l4-4 4 4h-3z" fill="grey"/>
//       </svg>
//     `
//     );

//     // Download icon
//     this.downloadIcon = this.renderer.createElement('span');
//     this.renderer.setStyle(this.downloadIcon, 'width', '23px');
//     this.renderer.setStyle(this.downloadIcon, 'height', '20px');
//     this.renderer.setStyle(this.downloadIcon, 'display', 'none');
//     this.renderer.setStyle(this.downloadIcon, 'cursor', 'pointer');
//     this.renderer.setProperty(
//       this.downloadIcon,
//       'innerHTML',
//       `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
//         <path d="M5 20h14v-2H5v2z" fill="grey"/>
//         <path d="M7 10l5 5 5-5H13V4h-2v6H7z" fill="grey"/>
//       </svg>
//       `
//     );

//     const fileContainer = this.renderer.createElement('div');
//     this.renderer.setStyle(fileContainer, 'display', 'flex');
//     this.renderer.setStyle(fileContainer, 'alignItems', 'center');
//     this.renderer.setStyle(fileContainer, 'maxWidth', '250px');
//     this.renderer.setStyle(fileContainer, 'whiteSpace', 'nowrap');
//     this.renderer.setStyle(fileContainer, 'overflow', 'hidden');
//     this.renderer.setStyle(fileContainer, 'textOverflow', 'ellipsis');

//     this.displayText = this.renderer.createElement('span');
//     this.renderer.setStyle(this.displayText, 'fontSize', '14px');
//     this.renderer.setStyle(this.displayText, 'color', '#666');
//     this.renderer.setStyle(this.displayText, 'fontFamily', 'Open Sans');
//     this.renderer.setStyle(this.displayText, 'maxWidth', '200px');
//     this.renderer.setStyle(this.displayText, 'padding-top', '8px');
//     this.renderer.setStyle(this.displayText, 'overflow', 'hidden');
//     this.renderer.setStyle(this.displayText, 'textOverflow', 'ellipsis');
//     this.renderer.setStyle(this.displayText, 'whiteSpace', 'nowrap');
//     this.renderer.setStyle(this.displayText, 'display', 'inline-block');
//     this.renderer.setAttribute(this.displayText, 'title', 'No file chosen');
//     this.renderer.setProperty(this.displayText, 'innerText', 'No file chosen');

//     this.clearBtn = this.renderer.createElement('span');
//     this.renderer.setStyle(this.clearBtn, 'color', 'black');
//     this.renderer.setStyle(this.clearBtn, 'fontSize', '20px');
//     this.renderer.setStyle(this.clearBtn, 'cursor', 'pointer');
//     this.renderer.setStyle(this.clearBtn, 'marginLeft', '4px');
//     this.renderer.setStyle(this.clearBtn, 'marginTop', '6px');
//     this.renderer.setStyle(this.clearBtn, 'userSelect', 'none');
//     this.renderer.setStyle(this.clearBtn, 'display', 'none');
//     this.renderer.setProperty(this.clearBtn, 'innerText', '×');

//     this.renderer.appendChild(fileContainer, this.displayText);
//     this.renderer.appendChild(fileContainer, this.clearBtn);
//     this.renderer.appendChild(displayRow, this.uploadIcon);
//     this.renderer.appendChild(displayRow, this.downloadIcon);
//     this.renderer.appendChild(displayRow, fileContainer);

//     this.renderer.insertBefore(parent, wrapper, host);
//     this.renderer.removeChild(parent, host);
//     this.renderer.appendChild(wrapper, label);
//     this.renderer.appendChild(wrapper, displayRow);
//     this.renderer.appendChild(wrapper, this.fileInput);

//     this.errorMsg = this.renderer.createElement('span');
//     this.renderer.setStyle(this.errorMsg, 'color', 'red');
//     this.renderer.setStyle(this.errorMsg, 'fontFamily', '"Open Sans", sans-serif');
//     this.renderer.setStyle(this.errorMsg, 'fontSize', '12px');
//     this.renderer.setStyle(this.errorMsg, 'marginTop', '2px');
//     this.renderer.setStyle(this.errorMsg, 'display', 'block');
//     this.renderer.setProperty(this.errorMsg, 'innerText', '');
//     this.renderer.appendChild(wrapper, this.errorMsg);

//     if (this.ngControl?.control && this.isRequired) {
//       const validators = this.ngControl.control.validator ? [this.ngControl.control.validator] : [];
//       this.ngControl.control.setValidators([
//         ...validators,
//         control => (control.value ? null : { required: true })
//       ]);
//       this.ngControl.control.updateValueAndValidity();
//     }

//     // ✅ displayRow click → open dialog only if no file chosen
//     this.renderer.listen(displayRow, 'click', () => {
//       if (this.ngControl?.control?.value) return; // do nothing if file exists
//       this.dialogOpen = true;
//       this.fileInput.click();
//     });

//     // Upload icon click
//     this.renderer.listen(this.uploadIcon, 'click', (e: Event) => {
//       e.stopPropagation();
//       if (this.clickLocked) return;
//       this.clickLocked = true;
//       setTimeout(() => (this.clickLocked = false), 500);

//       this.dialogOpen = true;
//       this.fileInput.click();
//     });

//     // Download icon click
//     this.renderer.listen(this.downloadIcon, 'click', (e: Event) => {
//       e.stopPropagation();
//       const value = this.ngControl?.control?.value;
//       if (value) {
//         const fileName = value instanceof File ? value.name : value;
//         this.fileDownload.emit({ fileName, controlName: this.controlName });
//       }
//     });

//     // Blur
//     this.renderer.listen(this.fileInput, 'blur', () => {
//       if (this.dialogOpen && !this.fileInput.files?.length) {
//         this.dialogOpen = false;
//         this.ngControl?.control?.markAsTouched();
//       }
//     });

//     // Change
//     this.renderer.listen(this.fileInput, 'change', (event: Event) => {
//       const target = event.target as HTMLInputElement;
//       const file = target.files?.[0];
//       this.dialogOpen = false;

//       if (!file) {
//         this.fileInput.value = '';
//         return;
//       }

//       const ext = '.' + file.name.split('.').pop()?.toLowerCase();
//       if (!this.allowedExtensions.includes(ext)) {
//         this.setError(`Invalid file type. Allowed: ${this.allowedExtensions.join(', ')}`);
//         this.fileInput.value = '';
//         return;
//       }

//       if (file.size > 10 * 1024 * 1024) {
//         this.setError('File size exceeds 10MB.');
//         this.fileInput.value = '';
//         return;
//       }

//       this.clearError();
//       this.updateDisplayWithFile(file);
//       this.fileSelected.emit({ file, controlName: this.controlName });
//       this.ngControl?.control?.setValue(file);
//       this.ngControl?.control?.markAsTouched();
//     });

//     // Clear
// this.renderer.listen(this.clearBtn, 'click', (e: Event) => {
//   e.stopPropagation();
//   this.clearError();
//   this.resetFileInput();
//   this.fileSelected.emit({ file: null, controlName: this.controlName });
//   this.fileCleared.emit(this.controlName);

//   if (this.ngControl?.control) {
//     this.ngControl.control.setValue(null);
//     this.ngControl.control.markAsTouched();

//     // 🔹 Force required error if it's required
//     if (this.isRequired) {
//       this.ngControl.control.setErrors({ required: true });
//     }
//   }
// });


//     if (this.ngControl?.control?.value) {
//       this.handleValueChange(this.ngControl.control.value);
//     }

//     this.ngControl?.control?.valueChanges.subscribe(value => {
//       this.handleValueChange(value);
//       if (!this.initialLoad) {
//         // no-op
//       } else {
//         this.initialLoad = false;
//       }
//     });
//   }

//   private handleValueChange(value: any) {
//     if (!value) {
//       this.resetFileInput();
//       return;
//     }

//     if (value instanceof File) {
//       this.updateDisplayWithFile(value);
//       this.toggleIcons(true);
//       return;
//     }

//     if (typeof value === 'string') {
//       this.updateDisplayWithFileName(value);
//       this.toggleIcons(true);
//     }
//   }

//   private resetFileInput() {
//     this.fileInput.value = '';
//     this.updateDisplayText('No file chosen');
//     this.renderer.setStyle(this.clearBtn, 'display', 'none');
//     this.toggleIcons(false);

//     if (this.removeDisplayTextClickListener) {
//       this.removeDisplayTextClickListener();
//       this.removeDisplayTextClickListener = null;
//     }
//     if (this.currentFileURL) {
//       URL.revokeObjectURL(this.currentFileURL);
//       this.currentFileURL = null;
//     }
//   }
  

//   private updateDisplayText(text: string) {
//     this.renderer.setProperty(this.displayText, 'innerText', text);
//     this.renderer.setAttribute(this.displayText, 'title', text);
//   }

// private updateDisplayWithFile(file: File) {
//   this.updateDisplayText(file.name);
//   this.renderer.setStyle(this.clearBtn, 'display', 'inline');

//   // Revoke old URL if exists
//   if (this.currentFileURL) {
//     URL.revokeObjectURL(this.currentFileURL);
//   }

//   if (this.removeDisplayTextClickListener) {
//     this.removeDisplayTextClickListener();
//     this.removeDisplayTextClickListener = null;
//   }

//   this.currentFileURL = URL.createObjectURL(file);

//   this.removeDisplayTextClickListener = this.renderer.listen(
//     this.displayText,
//     'click',
//     (e: Event) => {
//       e.stopPropagation();
//       // ✅ Open file in a new tab
//       window.open(this.currentFileURL!, '_blank', 'noopener,noreferrer');
//     }
//   );
// }


//   private updateDisplayWithFileName(fileName: string) {
//     this.updateDisplayText(fileName);
//     this.renderer.setStyle(this.clearBtn, 'display', 'inline');

//     if (this.removeDisplayTextClickListener) {
//       this.removeDisplayTextClickListener();
//       this.removeDisplayTextClickListener = null;
//     }

//     this.removeDisplayTextClickListener = this.renderer.listen(
//       this.displayText,
//       'click',
//       (e: Event) => {
//         e.stopPropagation();
//         this.fileDownload.emit({ fileName, controlName: this.controlName });
//       }
//     );
//   }

//   private toggleIcons(hasFile: boolean) {
//     this.renderer.setStyle(this.uploadIcon, 'display', hasFile ? 'none' : 'inline');
//     this.renderer.setStyle(this.downloadIcon, 'display', hasFile ? 'inline' : 'none');
//   }

//   private setError(msg: string) {
//     this.renderer.setProperty(this.errorMsg, 'innerText', msg || '');
//   }

//   private clearError() {
//     this.renderer.setProperty(this.errorMsg, 'innerText', '');
//   }

//   ngOnDestroy(): void {
//     if (this.removeDisplayTextClickListener) {
//       this.removeDisplayTextClickListener();
//       this.removeDisplayTextClickListener = null;
//     }
//     if (this.currentFileURL) {
//       URL.revokeObjectURL(this.currentFileURL);
//       this.currentFileURL = null;
//     }
//   }
// }

// import {
//   Directive,
//   ElementRef,
//   Renderer2,
//   AfterViewInit,
//   Input,
//   Output,
//   EventEmitter,
//   OnDestroy,
//   inject
// } from '@angular/core';
// import { NgControl } from '@angular/forms';

// @Directive({
//   selector: '[libFileupload]',
//   standalone: true
// })
// export class FileuploadDirective implements AfterViewInit, OnDestroy {
//   @Input('libLabelText') labelConfig: [string, string] = ['#a1a1a1', ''];
//   @Input() controlName: string = '';
//   @Input() allowedExtensions: string[] = ['.svg', '.pdf', '.jpg', '.jpeg', '.png'];

//   @Output() fileSelected = new EventEmitter<{ file: File | null; controlName: string }>();
//   @Output() fileCleared = new EventEmitter<string>();
//   @Output() fileDownload = new EventEmitter<{ fileName: string; controlName: string }>();

//   private fileInput!: HTMLInputElement;
//   private displayText!: HTMLElement;
//   private clearBtn!: HTMLElement;
//   private errorMsg!: HTMLElement;

//   private uploadIcon!: HTMLElement;
//   private downloadIcon!: HTMLElement;

//   private isRequired = false;
//   private dialogOpen = false;
//   private initialLoad = true;
//   private clickLocked = false;

//   private currentFileURL: string | null = null;
//   private removeDisplayTextClickListener: (() => void) | null = null;

//   private ngControl = inject(NgControl, { optional: true });

//   constructor(private el: ElementRef, private renderer: Renderer2) {}

//   ngAfterViewInit(): void {
//     const host = this.el.nativeElement as HTMLElement;
//     const parent = host.parentElement;
//     if (!parent) return;

//     this.isRequired = host.hasAttribute('librequired');
//     const [labelColor, labelText] = this.labelConfig ?? ['#a1a1a1', ''];

//     const wrapper = this.renderer.createElement('div');
//     this.renderer.setStyle(wrapper, 'display', 'flex');
//     this.renderer.setStyle(wrapper, 'flexDirection', 'column');
//     this.renderer.setStyle(wrapper, 'width', '100%');
//     this.renderer.setStyle(wrapper, 'margin', '6px 0');

//     const label = this.renderer.createElement('label');
//     this.renderer.setStyle(label, 'fontSize', '14px');
//     this.renderer.setStyle(label, 'fontWeight', '500');
//     this.renderer.setStyle(label, 'fontFamily', 'Open Sans');
//     this.renderer.setStyle(label, 'color', labelColor);
//     this.renderer.setStyle(label, 'marginBottom', '4px');
//     this.renderer.setStyle(label, 'minHeight', '40px');
//     this.renderer.setStyle(label, 'lineHeight', '20px');
//     this.renderer.setStyle(label, 'whiteSpace', 'pre-wrap');
//     this.renderer.setProperty(label, 'innerText', labelText);

//     this.fileInput = this.renderer.createElement('input');
//     this.renderer.setAttribute(this.fileInput, 'type', 'file');
//     this.renderer.setAttribute(this.fileInput, 'accept', this.allowedExtensions.join(','));
//     this.renderer.setStyle(this.fileInput, 'display', 'none');

//     const displayRow = this.renderer.createElement('div');
//     this.renderer.setStyle(displayRow, 'display', 'flex');
//     this.renderer.setStyle(displayRow, 'alignItems', 'center');
//     this.renderer.setStyle(displayRow, 'gap', '8px');
//     this.renderer.setStyle(displayRow, 'padding', '6px 0');
//     this.renderer.setStyle(displayRow, 'cursor', 'pointer');
//     this.renderer.setAttribute(displayRow, 'tabindex', '0');

//     // Upload icon
//     this.uploadIcon = this.renderer.createElement('span');
//     this.renderer.setStyle(this.uploadIcon, 'width', '23px');
//     this.renderer.setStyle(this.uploadIcon, 'height', '20px');
//     this.renderer.setProperty(
//       this.uploadIcon,
//       'innerHTML',
//       `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
//         <path d="M19.35 10.04A7.49 7.49 0 0 0 5.01 9.17 6 6 0 0 0 6 21h13a5 5 0 0 0 .35-10.96z" fill="white" stroke="grey" stroke-width="1.5"/>
//         <path d="M13 9v15h-2v-6H8l4-4 4 4h-3z" fill="grey"/>
//       </svg>
//     `
//     );

//     // Download icon
//     this.downloadIcon = this.renderer.createElement('span');
//     this.renderer.setStyle(this.downloadIcon, 'width', '23px');
//     this.renderer.setStyle(this.downloadIcon, 'height', '20px');
//     this.renderer.setStyle(this.downloadIcon, 'display', 'none');
//     this.renderer.setStyle(this.downloadIcon, 'cursor', 'pointer');
//     this.renderer.setProperty(
//       this.downloadIcon,
//       'innerHTML',
//       `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
//         <path d="M5 20h14v-2H5v2z" fill="grey"/>
//         <path d="M7 10l5 5 5-5H13V4h-2v6H7z" fill="grey"/>
//       </svg>
//       `
//     );

//     const fileContainer = this.renderer.createElement('div');
//     this.renderer.setStyle(fileContainer, 'display', 'flex');
//     this.renderer.setStyle(fileContainer, 'alignItems', 'center');
//     this.renderer.setStyle(fileContainer, 'maxWidth', '250px');
//     this.renderer.setStyle(fileContainer, 'whiteSpace', 'nowrap');
//     this.renderer.setStyle(fileContainer, 'overflow', 'hidden');
//     this.renderer.setStyle(fileContainer, 'textOverflow', 'ellipsis');

//     this.displayText = this.renderer.createElement('span');
//     this.renderer.setStyle(this.displayText, 'fontSize', '14px');
//     this.renderer.setStyle(this.displayText, 'color', '#666');
//     this.renderer.setStyle(this.displayText, 'fontFamily', 'Open Sans');
//     this.renderer.setStyle(this.displayText, 'maxWidth', '200px');
//     this.renderer.setStyle(this.displayText, 'padding-top', '8px');
//     this.renderer.setStyle(this.displayText, 'overflow', 'hidden');
//     this.renderer.setStyle(this.displayText, 'textOverflow', 'ellipsis');
//     this.renderer.setStyle(this.displayText, 'whiteSpace', 'nowrap');
//     this.renderer.setStyle(this.displayText, 'display', 'inline-block');
//     this.renderer.setAttribute(this.displayText, 'title', 'No file chosen');
//     this.renderer.setProperty(this.displayText, 'innerText', 'No file chosen');

//     this.clearBtn = this.renderer.createElement('span');
//     this.renderer.setStyle(this.clearBtn, 'color', 'black');
//     this.renderer.setStyle(this.clearBtn, 'fontSize', '20px');
//     this.renderer.setStyle(this.clearBtn, 'cursor', 'pointer');
//     this.renderer.setStyle(this.clearBtn, 'marginLeft', '4px');
//     this.renderer.setStyle(this.clearBtn, 'marginTop', '6px');
//     this.renderer.setStyle(this.clearBtn, 'userSelect', 'none');
//     this.renderer.setStyle(this.clearBtn, 'display', 'none');
//     this.renderer.setProperty(this.clearBtn, 'innerText', '×');

//     this.renderer.appendChild(fileContainer, this.displayText);
//     this.renderer.appendChild(fileContainer, this.clearBtn);
//     this.renderer.appendChild(displayRow, this.uploadIcon);
//     this.renderer.appendChild(displayRow, this.downloadIcon);
//     this.renderer.appendChild(displayRow, fileContainer);

//     this.renderer.insertBefore(parent, wrapper, host);
//     this.renderer.removeChild(parent, host);
//     this.renderer.appendChild(wrapper, label);
//     this.renderer.appendChild(wrapper, displayRow);
//     this.renderer.appendChild(wrapper, this.fileInput);

//     this.errorMsg = this.renderer.createElement('span');
//     this.renderer.setStyle(this.errorMsg, 'color', 'red');
//     this.renderer.setStyle(this.errorMsg, 'fontFamily', '"Open Sans", sans-serif');
//     this.renderer.setStyle(this.errorMsg, 'fontSize', '12px');
//     this.renderer.setStyle(this.errorMsg, 'marginTop', '2px');
//     this.renderer.setStyle(this.errorMsg, 'display', 'block');
//     this.renderer.setProperty(this.errorMsg, 'innerText', '');
//     this.renderer.appendChild(wrapper, this.errorMsg);

//  if (this.ngControl?.control && this.isRequired) {
//   const validators = this.ngControl.control.validator ? [this.ngControl.control.validator] : [];
//   this.ngControl.control.setValidators([
//     ...validators,
//     control => {
//       const value = control.value;
//       if (!value || (typeof value === 'string' && value.trim() === '')) {
//         return { required: true };
//       }
//       return null; // ✅ valid if File or non-empty string
//     }
//   ]);
//   this.ngControl.control.updateValueAndValidity();
// }


//     // Upload icon click
//     this.renderer.listen(this.uploadIcon, 'click', (e: Event) => {
//       e.stopPropagation();
//       if (this.clickLocked) return;
//       this.clickLocked = true;
//       setTimeout(() => (this.clickLocked = false), 500);

//       this.dialogOpen = true;
//       this.fileInput.click();
//     });

//     // Download icon click
//     this.renderer.listen(this.downloadIcon, 'click', (e: Event) => {
//       e.stopPropagation();
//       const value = this.ngControl?.control?.value;
//       if (value) {
//         const fileName = value instanceof File ? value.name : value;
//         this.fileDownload.emit({ fileName, controlName: this.controlName });
//       }
//     });

//     // Blur
//     this.renderer.listen(this.fileInput, 'blur', () => {
//       if (this.dialogOpen && !this.fileInput.files?.length) {
//         this.dialogOpen = false;
//         this.ngControl?.control?.markAsTouched();
//       }
//     });

//     // Change
//     this.renderer.listen(this.fileInput, 'change', (event: Event) => {
//       const target = event.target as HTMLInputElement;
//       const file = target.files?.[0];
//       this.dialogOpen = false;

//       if (!file) {
//         this.fileInput.value = '';
//         return;
//       }

//       const ext = '.' + file.name.split('.').pop()?.toLowerCase();
//       if (!this.allowedExtensions.includes(ext)) {
//         this.setError(`Invalid file type. Allowed: ${this.allowedExtensions.join(', ')}`);
//         this.fileInput.value = '';
//         return;
//       }

//       if (file.size > 10 * 1024 * 1024) {
//         this.setError('File size exceeds 10MB.');
//         this.fileInput.value = '';
//         return;
//       }

//       this.clearError();
//       this.updateDisplayWithFile(file);
//       this.toggleIcons(true);

//       this.fileSelected.emit({ file, controlName: this.controlName });
//       this.ngControl?.control?.setValue(file);
//       this.ngControl?.control?.markAsTouched();
//     });


//     // Clear
// this.renderer.listen(this.clearBtn, 'click', (e: Event) => {
//   e.stopPropagation();
//   this.clearError();
//   this.resetFileInput();
//   this.fileSelected.emit({ file: null, controlName: this.controlName });
//   this.fileCleared.emit(this.controlName);

//   if (this.ngControl?.control) {
//     this.ngControl.control.setValue(null);
//     this.ngControl.control.markAsTouched();

//     // 🔹 Force required error if it's required
//     if (this.isRequired) {
//       this.ngControl.control.setErrors({ required: true });
//     }
//   }
// });


//     if (this.ngControl?.control?.value) {
//       this.handleValueChange(this.ngControl.control.value);
//     }

//     this.ngControl?.control?.valueChanges.subscribe(value => {
//       this.handleValueChange(value);
//       if (!this.initialLoad) {
//         // no-op
//       } else {
//         this.initialLoad = false;
//       }
//     });
//   }

//   private handleValueChange(value: any) {
//     if (!value) {
//       this.resetFileInput();
//       return;
//     }

//     if (value instanceof File) {
//       this.updateDisplayWithFile(value);
//       this.toggleIcons(true);
//       return;
//     }

//     if (typeof value === 'string') {
//       this.updateDisplayWithFileName(value);
//       this.toggleIcons(true);
//     }
//   }

//   private resetFileInput() {
//     this.fileInput.value = '';
//     this.updateDisplayText('No file chosen');
//     this.renderer.setStyle(this.clearBtn, 'display', 'none');
//     this.toggleIcons(false);

//     if (this.removeDisplayTextClickListener) {
//       this.removeDisplayTextClickListener();
//       this.removeDisplayTextClickListener = null;
//     }
//     if (this.currentFileURL) {
//       URL.revokeObjectURL(this.currentFileURL);
//       this.currentFileURL = null;
//     }
//   }

//   private updateDisplayText(text: string) {
//     this.renderer.setProperty(this.displayText, 'innerText', text);
//     this.renderer.setAttribute(this.displayText, 'title', text);
//   }

// private updateDisplayWithFile(file: File) {
//   this.updateDisplayText(file.name);
//   this.renderer.setStyle(this.clearBtn, 'display', 'inline');

//   // Revoke old URL if exists
//   if (this.currentFileURL) {
//     URL.revokeObjectURL(this.currentFileURL);
//   }

//   if (this.removeDisplayTextClickListener) {
//     this.removeDisplayTextClickListener();
//     this.removeDisplayTextClickListener = null;
//   }

//   this.currentFileURL = URL.createObjectURL(file);

//   this.removeDisplayTextClickListener = this.renderer.listen(
//     this.displayText,
//     'click',
//     (e: Event) => {
//       e.stopPropagation();
//       // ✅ Open file in a new tab
//       window.open(this.currentFileURL!, '_blank', 'noopener,noreferrer');
//     }
//   );
// }


//   private updateDisplayWithFileName(fileName: string) {
//     this.updateDisplayText(fileName);
//     this.renderer.setStyle(this.clearBtn, 'display', 'inline');

//     if (this.removeDisplayTextClickListener) {
//       this.removeDisplayTextClickListener();
//       this.removeDisplayTextClickListener = null;
//     }

//     this.removeDisplayTextClickListener = this.renderer.listen(
//       this.displayText,
//       'click',
//       (e: Event) => {
//         e.stopPropagation();
//         this.fileDownload.emit({ fileName, controlName: this.controlName });
//       }
//     );
//   }

//   private toggleIcons(hasFile: boolean) {
//     this.renderer.setStyle(this.uploadIcon, 'display', hasFile ? 'none' : 'inline');
//     this.renderer.setStyle(this.downloadIcon, 'display', hasFile ? 'inline' : 'none');
//   }

//   private setError(msg: string) {
//     this.renderer.setProperty(this.errorMsg, 'innerText', msg || '');
//   }

//   private clearError() {
//     this.renderer.setProperty(this.errorMsg, 'innerText', '');
//   }

//   ngOnDestroy(): void {
//     if (this.removeDisplayTextClickListener) {
//       this.removeDisplayTextClickListener();
//       this.removeDisplayTextClickListener = null;
//     }
//     if (this.currentFileURL) {
//       URL.revokeObjectURL(this.currentFileURL);
//       this.currentFileURL = null;
//     }
//   }
// }

// import {
//   Directive,
//   ElementRef,
//   Renderer2,
//   AfterViewInit,
//   Input,
//   Output,
//   EventEmitter,
//   OnDestroy,
//   inject
// } from '@angular/core';
// import { NgControl } from '@angular/forms';
// import { Subscription } from 'rxjs';
// @Directive({
//   selector: '[libFileupload]',
//   standalone: true
// })
// export class FileuploadDirective implements AfterViewInit, OnDestroy {
//   @Input('libLabelText') labelConfig: [string, string] = ['#a1a1a1', ''];
//   @Input() controlName: string = '';
//   @Input() allowedExtensions: string[] = ['.svg', '.pdf', '.jpg', '.jpeg', '.png'];

//   @Output() fileSelected = new EventEmitter<{ file: File | null; controlName: string }>();
//   @Output() fileCleared = new EventEmitter<string>();
//   @Output() fileDownload = new EventEmitter<{ fileName: string; controlName: string }>();

//   private fileInput!: HTMLInputElement;
//   private displayText!: HTMLElement;
//   private clearBtn!: HTMLElement;
//   private errorMsg!: HTMLElement;

//   private uploadIcon!: HTMLElement;
//   private downloadIcon!: HTMLElement;

//   private isRequired = false;
//   private dialogOpen = false;
//   private initialLoad = true;
//   private clickLocked = false;
//   private valueChangeSub: Subscription | null = null;
//   private currentFileURL: string | null = null;
//   private removeDisplayTextClickListener: (() => void) | null = null;

//   private ngControl = inject(NgControl, { optional: true });

//   constructor(private el: ElementRef, private renderer: Renderer2) {}

//   ngAfterViewInit(): void {
//     const host = this.el.nativeElement as HTMLElement;
//     const parent = host.parentElement;
//     if (!parent) return;

//     this.isRequired = host.hasAttribute('librequired');
//     const [labelColor, labelText] = this.labelConfig ?? ['#a1a1a1', ''];

//     const wrapper = this.renderer.createElement('div');
//     this.renderer.setStyle(wrapper, 'display', 'flex');
//     this.renderer.setStyle(wrapper, 'flexDirection', 'column');
//     this.renderer.setStyle(wrapper, 'width', '100%');
//     this.renderer.setStyle(wrapper, 'margin', '6px 0');

//     const label = this.renderer.createElement('label');
//     this.renderer.setStyle(label, 'fontSize', '14px');
//     this.renderer.setStyle(label, 'fontWeight', '500');
//     this.renderer.setStyle(label, 'fontFamily', 'Open Sans');
//     this.renderer.setStyle(label, 'color', labelColor);
//     this.renderer.setStyle(label, 'marginBottom', '4px');
//     this.renderer.setStyle(label, 'minHeight', '40px');
//     this.renderer.setStyle(label, 'lineHeight', '20px');
//     this.renderer.setStyle(label, 'whiteSpace', 'pre-wrap');
//     this.renderer.setProperty(label, 'innerText', labelText);

//     this.fileInput = this.renderer.createElement('input');
//     this.renderer.setAttribute(this.fileInput, 'type', 'file');
//     this.renderer.setAttribute(this.fileInput, 'accept', this.allowedExtensions.join(','));
//     this.renderer.setStyle(this.fileInput, 'display', 'none');

//     const displayRow = this.renderer.createElement('div');
//     this.renderer.setStyle(displayRow, 'display', 'flex');
//     this.renderer.setStyle(displayRow, 'alignItems', 'center');
//     this.renderer.setStyle(displayRow, 'gap', '8px');
//     this.renderer.setStyle(displayRow, 'padding', '6px 0');
//     this.renderer.setStyle(displayRow, 'cursor', 'pointer');
//     this.renderer.setAttribute(displayRow, 'tabindex', '0');

//     // Upload icon
//     this.uploadIcon = this.renderer.createElement('span');
//     this.renderer.setStyle(this.uploadIcon, 'width', '23px');
//     this.renderer.setStyle(this.uploadIcon, 'height', '20px');
//     this.renderer.setProperty(
//       this.uploadIcon,
//       'innerHTML',
//       `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
//         <path d="M19.35 10.04A7.49 7.49 0 0 0 5.01 9.17 6 6 0 0 0 6 21h13a5 5 0 0 0 .35-10.96z" fill="white" stroke="grey" stroke-width="1.5"/>
//         <path d="M13 9v15h-2v-6H8l4-4 4 4h-3z" fill="grey"/>
//       </svg>
//     `
//     );

//     // Download icon
//     this.downloadIcon = this.renderer.createElement('span');
//     this.renderer.setStyle(this.downloadIcon, 'width', '23px');
//     this.renderer.setStyle(this.downloadIcon, 'height', '23px');
//     this.renderer.setStyle(this.downloadIcon, 'display', 'none');
//     this.renderer.setStyle(this.downloadIcon, 'cursor', 'pointer');
//     this.renderer.setProperty(
//       this.downloadIcon,
//       'innerHTML',
//       `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
//         <path d="M5 20h14v-2H5v2z" fill="grey"/>
//         <path d="M7 10l5 5 5-5H13V4h-2v6H7z" fill="grey"/>
//       </svg>
//       `
//     );

//     const fileContainer = this.renderer.createElement('div');
//     this.renderer.setStyle(fileContainer, 'display', 'flex');
//     this.renderer.setStyle(fileContainer, 'alignItems', 'center');
//     this.renderer.setStyle(fileContainer, 'maxWidth', '250px');
//     this.renderer.setStyle(fileContainer, 'whiteSpace', 'nowrap');
//     this.renderer.setStyle(fileContainer, 'overflow', 'hidden');
//     this.renderer.setStyle(fileContainer, 'textOverflow', 'ellipsis');

//     this.displayText = this.renderer.createElement('span');
//     this.renderer.setStyle(this.displayText, 'fontSize', '14px');
//     this.renderer.setStyle(this.displayText, 'color', '#666');
//     this.renderer.setStyle(this.displayText, 'fontFamily', 'Open Sans');
//     this.renderer.setStyle(this.displayText, 'maxWidth', '200px');
//     this.renderer.setStyle(this.displayText, 'padding-top', '8px');
//     this.renderer.setStyle(this.displayText, 'overflow', 'hidden');
//     this.renderer.setStyle(this.displayText, 'textOverflow', 'ellipsis');
//     this.renderer.setStyle(this.displayText, 'whiteSpace', 'nowrap');
//     this.renderer.setStyle(this.displayText, 'display', 'inline-block');
//     this.renderer.setAttribute(this.displayText, 'title', 'No file chosen');
//     this.renderer.setProperty(this.displayText, 'innerText', 'No file chosen');

//     this.clearBtn = this.renderer.createElement('span');
//     this.renderer.setStyle(this.clearBtn, 'color', 'black');
//     this.renderer.setStyle(this.clearBtn, 'fontSize', '20px');
//     this.renderer.setStyle(this.clearBtn, 'cursor', 'pointer');
//     this.renderer.setStyle(this.clearBtn, 'marginLeft', '4px');
//     this.renderer.setStyle(this.clearBtn, 'marginTop', '6px');
//     this.renderer.setStyle(this.clearBtn, 'userSelect', 'none');
//     this.renderer.setStyle(this.clearBtn, 'display', 'none');
//     this.renderer.setProperty(this.clearBtn, 'innerText', '×');

//     this.renderer.appendChild(fileContainer, this.displayText);
//     this.renderer.appendChild(fileContainer, this.clearBtn);
//     this.renderer.appendChild(displayRow, this.uploadIcon);
//     this.renderer.appendChild(displayRow, this.downloadIcon);
//     this.renderer.appendChild(displayRow, fileContainer);

//     this.renderer.insertBefore(parent, wrapper, host);
//     this.renderer.removeChild(parent, host);
//     this.renderer.appendChild(wrapper, label);
//     this.renderer.appendChild(wrapper, displayRow);
//     this.renderer.appendChild(wrapper, this.fileInput);

//     this.errorMsg = this.renderer.createElement('span');
//     this.renderer.setStyle(this.errorMsg, 'color', 'red');
//     this.renderer.setStyle(this.errorMsg, 'fontFamily', '"Open Sans", sans-serif');
//     this.renderer.setStyle(this.errorMsg, 'fontSize', '12px');
//     this.renderer.setStyle(this.errorMsg, 'marginTop', '2px');
//     this.renderer.setStyle(this.errorMsg, 'display', 'block');
//     this.renderer.setProperty(this.errorMsg, 'innerText', '');
//     this.renderer.appendChild(wrapper, this.errorMsg);

//  if (this.ngControl?.control && this.isRequired) {
//   const validators = this.ngControl.control.validator ? [this.ngControl.control.validator] : [];
//   this.ngControl.control.setValidators([
//     ...validators,
//     control => {
//       const value = control.value;
//       if (!value || (typeof value === 'string' && value.trim() === '')) {
//         return { required: true };
//       }
//       return null; // ✅ valid if File or non-empty string
//     }
//   ]);
//   this.ngControl.control.updateValueAndValidity();
// }


//     // Upload icon click
//     this.renderer.listen(this.uploadIcon, 'click', (e: Event) => {
//       e.stopPropagation();
//       if (this.clickLocked) return;
//       this.clickLocked = true;
//       setTimeout(() => (this.clickLocked = false), 500);

//       this.dialogOpen = true;
//       this.fileInput.click();
//     });

//     // Download icon click
//     this.renderer.listen(this.downloadIcon, 'click', (e: Event) => {
//       e.stopPropagation();
//       const value = this.ngControl?.control?.value;
//       if (value) {
//         const fileName = value instanceof File ? value.name : value;
//         this.fileDownload.emit({ fileName, controlName: this.controlName });
//       }
//     });

//     // Blur
//     this.renderer.listen(this.fileInput, 'blur', () => {
//       if (this.dialogOpen && !this.fileInput.files?.length) {
//         this.dialogOpen = false;
//         this.ngControl?.control?.markAsTouched();
//       }
//     });

//     // Change
//     this.renderer.listen(this.fileInput, 'change', (event: Event) => {
//       const target = event.target as HTMLInputElement;
//       const file = target.files?.[0];
//       this.dialogOpen = false;

//       if (!file) {
//         this.fileInput.value = '';
//         return;
//       }

//       const ext = '.' + file.name.split('.').pop()?.toLowerCase();
//       if (!this.allowedExtensions.includes(ext)) {
//         this.setError(`Invalid file type. Allowed: ${this.allowedExtensions.join(', ')}`);
//         this.fileInput.value = '';
//         return;
//       }

//       if (file.size > 10 * 1024 * 1024) {
//         this.setError('File size exceeds 10MB.');
//         this.fileInput.value = '';
//         return;
//       }

//       this.clearError();
//       this.updateDisplayWithFile(file);
//       this.toggleIcons(true);

//       this.fileSelected.emit({ file, controlName: this.controlName });
//       this.ngControl?.control?.setValue(file);
//       this.ngControl?.control?.markAsTouched();
//     });


//     // Clear
// this.renderer.listen(this.clearBtn, 'click', (e: Event) => {
//   e.stopPropagation();
//   this.clearError();
//   this.resetFileInput();
//   this.fileSelected.emit({ file: null, controlName: this.controlName });
//   this.fileCleared.emit(this.controlName);

//   if (this.ngControl?.control) {
//     this.ngControl.control.setValue(null);
//     this.ngControl.control.markAsTouched();

//     // 🔹 Force required error if it's required
//     if (this.isRequired) {
//       this.ngControl.control.setErrors({ required: true });
//     }
//   }
// });

// if (this.ngControl?.control) {
//   // handle current value (in case component patched before directive init)
//   if (this.ngControl.control.value) {
//     // small timeout to ensure DOM ready (optional but safe)
//     setTimeout(() => this.handleValueChange(this.ngControl!.control!.value), 0);
//   }

//   this.valueChangeSub = this.ngControl.control.valueChanges.subscribe(value => {
//     this.handleValueChange(value);
//     if (this.initialLoad) this.initialLoad = false;
//   });
// }

//   }

// // private handleValueChange(value: any) {

// //    if (this.removeDisplayTextClickListener) {
// //       this.removeDisplayTextClickListener();
// //       this.removeDisplayTextClickListener = null;
// //     }
// //     if (this.currentFileURL) {
// //       URL.revokeObjectURL(this.currentFileURL);
// //       this.currentFileURL = null;
// //     }

// //     if (!value) {
// //       this.resetFileInput();
// //       return;
// //     }

// //   if (value instanceof File) {
// //     // 🔹 Simulate user-selected file
// //     this.updateDisplayWithFile(value);
// //     this.toggleIcons(true);

// //     // 🔹 Also sync hidden <input> with this File for consistency
// //     const dataTransfer = new DataTransfer();
// //     dataTransfer.items.add(value);
// //     this.fileInput.files = dataTransfer.files;
// //     return;
// //   }

// //   if (typeof value === 'string') {
// //     this.updateDisplayWithFileName(value);
// //     this.toggleIcons(true);
// //   }
// // }
// private handleValueChange(value: any) {
//   // cleanup previous click listener / url
//   if (this.removeDisplayTextClickListener) {
//     this.removeDisplayTextClickListener();
//     this.removeDisplayTextClickListener = null;
//   }
//   if (this.currentFileURL) {
//     URL.revokeObjectURL(this.currentFileURL);
//     this.currentFileURL = null;
//   }

//   if (!value) {
//     this.resetFileInput();
//     return;
//   }

//   // If it's a File instance — treat it like user selected it
//   if (value instanceof File) {
//     this.clearError();
//     this.updateDisplayWithFile(value);
//     this.toggleIcons(true);

//     // Try to set hidden <input> files (DataTransfer). If browser/TS blocks it, it's non-fatal.
//     try {
//       const dt = new DataTransfer();
//       dt.items.add(value);
//       // DOM assignment may be read-only in TS types — use `any` to avoid compile error
//       (this.fileInput as any).files = dt.files;

//       // dispatch change so any other listeners react (safe)
//       this.fileInput.dispatchEvent(new Event('change', { bubbles: true }));
//     } catch (err) {
//       // Not fatal — UI already updated
//       console.warn('Could not programmatically set fileInput.files:', err);
//     }
//     return;
//   }

//   // If it's a filename string — show the name and enable download action
//   if (typeof value === 'string') {
//     this.updateDisplayWithFileName(value);
//     this.toggleIcons(true);
//     return;
//   }

//   // Optional: if control stores { name, blob } or similar object, handle it
//   if (value && typeof value === 'object' && value.name && (value.blob || value.file)) {
//     const blobPart = value.blob ?? value.file;
//     const file = new File([blobPart], value.name, { type: blobPart.type || 'application/octet-stream' });
//     this.handleValueChange(file);
//     return;
//   }

//   // Fallback
//   this.resetFileInput();
// }


//   private resetFileInput() {
//     this.fileInput.value = '';
//     this.updateDisplayText('No file chosen');
//     this.renderer.setStyle(this.clearBtn, 'display', 'none');
//     this.toggleIcons(false);

//     if (this.removeDisplayTextClickListener) {
//       this.removeDisplayTextClickListener();
//       this.removeDisplayTextClickListener = null;
//     }
//     if (this.currentFileURL) {
//       URL.revokeObjectURL(this.currentFileURL);
//       this.currentFileURL = null;
//     }
//   }

//   private updateDisplayText(text: string) {
//     this.renderer.setProperty(this.displayText, 'innerText', text);
//     this.renderer.setAttribute(this.displayText, 'title', text);
//   }

// private updateDisplayWithFile(file: File) {
//   this.updateDisplayText(file.name);
//   this.renderer.setStyle(this.clearBtn, 'display', 'inline');

//   // Revoke old URL if exists
//   if (this.currentFileURL) {
//     URL.revokeObjectURL(this.currentFileURL);
//   }

//   if (this.removeDisplayTextClickListener) {
//     this.removeDisplayTextClickListener();
//     this.removeDisplayTextClickListener = null;
//   }

//   this.currentFileURL = URL.createObjectURL(file);

//   this.removeDisplayTextClickListener = this.renderer.listen(
//     this.displayText,
//     'click',
//     (e: Event) => {
//       e.stopPropagation();
//       // ✅ Open file in a new tab
//       window.open(this.currentFileURL!, '_blank', 'noopener,noreferrer');
//     }
//   );
// }


//   private updateDisplayWithFileName(fileName: string) {
//     this.updateDisplayText(fileName);
//     this.renderer.setStyle(this.clearBtn, 'display', 'inline');

//     if (this.removeDisplayTextClickListener) {
//       this.removeDisplayTextClickListener();
//       this.removeDisplayTextClickListener = null;
//     }

//     this.removeDisplayTextClickListener = this.renderer.listen(
//       this.displayText,
//       'click',
//       (e: Event) => {
//         e.stopPropagation();
//         this.fileDownload.emit({ fileName, controlName: this.controlName });
//       }
//     );
//   }

//   private toggleIcons(hasFile: boolean) {
//     this.renderer.setStyle(this.uploadIcon, 'display', hasFile ? 'none' : 'inline');
//     this.renderer.setStyle(this.downloadIcon, 'display', hasFile ? 'inline' : 'none');
//   }

//   private setError(msg: string) {
//     this.renderer.setProperty(this.errorMsg, 'innerText', msg || '');
//   }

//   private clearError() {
//     this.renderer.setProperty(this.errorMsg, 'innerText', '');
//   }

//   // ngOnDestroy(): void {
//   //   if (this.removeDisplayTextClickListener) {
//   //     this.removeDisplayTextClickListener();
//   //     this.removeDisplayTextClickListener = null;
//   //   }
//   //   if (this.currentFileURL) {
//   //     URL.revokeObjectURL(this.currentFileURL);
//   //     this.currentFileURL = null;
//   //   }
//   // }
//   ngOnDestroy(): void {
//   if (this.valueChangeSub) this.valueChangeSub.unsubscribe();
//   if (this.removeDisplayTextClickListener) {
//     this.removeDisplayTextClickListener();
//     this.removeDisplayTextClickListener = null;
//   }
//   if (this.currentFileURL) {
//     URL.revokeObjectURL(this.currentFileURL);
//     this.currentFileURL = null;
//   }
// }
// }
import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  inject
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[libFileupload]',
  standalone: true
})
export class FileuploadDirective implements AfterViewInit, OnDestroy {
  @Input('libLabelText') labelConfig: [string, string] = ['#a1a1a1', ''];
  @Input() controlName: string = '';
  @Input() allowedExtensions: string[] = ['.svg', '.pdf', '.jpg', '.jpeg', '.png'];

  @Output() fileSelected = new EventEmitter<{ file: File | null; controlName: string }>();
  @Output() fileCleared = new EventEmitter<string>();
  @Output() fileDownload = new EventEmitter<{ fileName: string; controlName: string }>();
@Output() openDialog = new EventEmitter<void>();
  private fileInput!: HTMLInputElement;
  private displayText!: HTMLElement;
  private clearBtn!: HTMLElement;
  private errorMsg!: HTMLElement;

  private uploadIcon!: HTMLElement;
  private downloadIcon!: HTMLElement;

  private isRequired = false;
  private dialogOpen = false;
  private clickLocked = false;
  private valueChangeSub: Subscription | null = null;
  private currentFileURL: string | null = null;
  private removeDisplayTextClickListener: (() => void) | null = null;

  private ngControl = inject(NgControl, { optional: true });

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const host = this.el.nativeElement as HTMLElement;
    const parent = host.parentElement;
    if (!parent) return;

    this.isRequired = host.hasAttribute('librequired');
    const [labelColor, labelText] = this.labelConfig ?? ['#a1a1a1', ''];

    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'display', 'flex');
    this.renderer.setStyle(wrapper, 'flexDirection', 'column');
    this.renderer.setStyle(wrapper, 'width', '100%');
    this.renderer.setStyle(wrapper, 'margin', '6px 0');

    const label = this.renderer.createElement('label');
    this.renderer.setStyle(label, 'fontSize', '14px');
    this.renderer.setStyle(label, 'fontWeight', '500');
    this.renderer.setStyle(label, 'fontFamily', 'Open Sans');
    this.renderer.setStyle(label, 'color', labelColor);
    this.renderer.setStyle(label, 'marginBottom', '4px');
    this.renderer.setStyle(label, 'minHeight', '40px');
    this.renderer.setStyle(label, 'lineHeight', '20px');
    this.renderer.setStyle(label, 'whiteSpace', 'pre-wrap');
    this.renderer.setProperty(label, 'innerText', labelText);

    this.fileInput = this.renderer.createElement('input');
    this.renderer.setAttribute(this.fileInput, 'type', 'file');
    this.renderer.setAttribute(this.fileInput, 'accept', this.allowedExtensions.join(','));
    this.renderer.setStyle(this.fileInput, 'display', 'none');

    const displayRow = this.renderer.createElement('div');
    this.renderer.setStyle(displayRow, 'display', 'flex');
    this.renderer.setStyle(displayRow, 'alignItems', 'center');
    this.renderer.setStyle(displayRow, 'gap', '8px');
    this.renderer.setStyle(displayRow, 'padding', '6px 0');
    this.renderer.setStyle(displayRow, 'cursor', 'pointer');
    this.renderer.setAttribute(displayRow, 'tabindex', '0');

    // Upload icon
    this.uploadIcon = this.renderer.createElement('span');
    this.renderer.setStyle(this.uploadIcon, 'width', '23px');
    this.renderer.setStyle(this.uploadIcon, 'height', '20px');
    this.renderer.setProperty(
      this.uploadIcon,
      'innerHTML',
      `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
        <path d="M19.35 10.04A7.49 7.49 0 0 0 5.01 9.17 6 6 0 0 0 6 21h13a5 5 0 0 0 .35-10.96z" fill="white" stroke="grey" stroke-width="1.5"/>
        <path d="M13 9v15h-2v-6H8l4-4 4 4h-3z" fill="grey"/>
      </svg>
    `
    );

    // Download icon
    this.downloadIcon = this.renderer.createElement('span');
    this.renderer.setStyle(this.downloadIcon, 'width', '23px');
    this.renderer.setStyle(this.downloadIcon, 'height', '23px');
    this.renderer.setStyle(this.downloadIcon, 'display', 'none');
    this.renderer.setStyle(this.downloadIcon, 'cursor', 'pointer');
    this.renderer.setProperty(
      this.downloadIcon,
      'innerHTML',
      `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
        <path d="M5 20h14v-2H5v2z" fill="grey"/>
        <path d="M7 10l5 5 5-5H13V4h-2v6H7z" fill="grey"/>
      </svg>
      `
    );

    const fileContainer = this.renderer.createElement('div');
    this.renderer.setStyle(fileContainer, 'display', 'flex');
    this.renderer.setStyle(fileContainer, 'alignItems', 'center');
    this.renderer.setStyle(fileContainer, 'maxWidth', '250px');
    this.renderer.setStyle(fileContainer, 'whiteSpace', 'nowrap');
    this.renderer.setStyle(fileContainer, 'overflow', 'hidden');
    this.renderer.setStyle(fileContainer, 'textOverflow', 'ellipsis');

    this.displayText = this.renderer.createElement('span');
    this.renderer.setStyle(this.displayText, 'fontSize', '14px');
    this.renderer.setStyle(this.displayText, 'color', '#666');
    this.renderer.setStyle(this.displayText, 'fontFamily', 'Open Sans');
    this.renderer.setStyle(this.displayText, 'maxWidth', '200px');
    this.renderer.setStyle(this.displayText, 'padding-top', '8px');
    this.renderer.setStyle(this.displayText, 'overflow', 'hidden');
    this.renderer.setStyle(this.displayText, 'textOverflow', 'ellipsis');
    this.renderer.setStyle(this.displayText, 'whiteSpace', 'nowrap');
    this.renderer.setStyle(this.displayText, 'display', 'inline-block');
    this.renderer.setAttribute(this.displayText, 'title', 'No file chosen');
    this.renderer.setProperty(this.displayText, 'innerText', 'No file chosen');

    this.clearBtn = this.renderer.createElement('span');
    this.renderer.setStyle(this.clearBtn, 'color', 'black');
    this.renderer.setStyle(this.clearBtn, 'fontSize', '20px');
    this.renderer.setStyle(this.clearBtn, 'cursor', 'pointer');
    this.renderer.setStyle(this.clearBtn, 'marginLeft', '4px');
    this.renderer.setStyle(this.clearBtn, 'marginTop', '6px');
    this.renderer.setStyle(this.clearBtn, 'userSelect', 'none');
    this.renderer.setStyle(this.clearBtn, 'display', 'none');
    this.renderer.setProperty(this.clearBtn, 'innerText', '×');

    this.renderer.appendChild(fileContainer, this.displayText);
    this.renderer.appendChild(fileContainer, this.clearBtn);
    this.renderer.appendChild(displayRow, this.uploadIcon);
    this.renderer.appendChild(displayRow, this.downloadIcon);
    this.renderer.appendChild(displayRow, fileContainer);

    this.renderer.insertBefore(parent, wrapper, host);
    this.renderer.removeChild(parent, host);
    this.renderer.appendChild(wrapper, label);
    this.renderer.appendChild(wrapper, displayRow);
    this.renderer.appendChild(wrapper, this.fileInput);

    this.errorMsg = this.renderer.createElement('span');
    this.renderer.setStyle(this.errorMsg, 'color', 'red');
    this.renderer.setStyle(this.errorMsg, 'fontFamily', '"Open Sans", sans-serif');
    this.renderer.setStyle(this.errorMsg, 'fontSize', '12px');
    this.renderer.setStyle(this.errorMsg, 'marginTop', '2px');
    this.renderer.setStyle(this.errorMsg, 'display', 'block');
    this.renderer.setProperty(this.errorMsg, 'innerText', '');
    this.renderer.appendChild(wrapper, this.errorMsg);

    // Upload icon click → only open file dialog
    this.renderer.listen(this.uploadIcon, 'click', (e: Event) => {
      e.stopPropagation();
      if (this.clickLocked) return;
      this.clickLocked = true;
      setTimeout(() => (this.clickLocked = false), 500);

      this.dialogOpen = true;
      this.fileInput.click();
    });

    // Download icon click
    this.renderer.listen(this.downloadIcon, 'click', (e: Event) => {
      e.stopPropagation();
      const value = this.ngControl?.control?.value;
      if (value) {
        const fileName = value instanceof File ? value.name : value;
        this.fileDownload.emit({ fileName, controlName: this.controlName });
      }
    });

    // Blur → mark touched if no file selected
    this.renderer.listen(this.fileInput, 'blur', () => {
      if (this.dialogOpen && !this.fileInput.files?.length) {
        this.dialogOpen = false;
        this.ngControl?.control?.markAsTouched();
      }
    });

    // File input change → real user upload
    this.renderer.listen(this.fileInput, 'change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      this.dialogOpen = false;

      if (!file) {
        this.fileInput.value = '';
        return;
      }

      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!this.allowedExtensions.includes(ext)) {
        this.setError(`Invalid file type. Allowed: ${this.allowedExtensions.join(', ')}`);
        this.fileInput.value = '';
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        this.setError('File size exceeds 10MB.');
        this.fileInput.value = '';
        return;
      }

      this.clearError();
      this.updateDisplayWithFile(file);
      this.toggleIcons(true);

      // ✅ Emit only on real user upload
      this.fileSelected.emit({ file, controlName: this.controlName });

      this.ngControl?.control?.setValue(file);
      this.ngControl?.control?.markAsTouched();
    });

    // Clear button click
    this.renderer.listen(this.clearBtn, 'click', (e: Event) => {
      e.stopPropagation();
      this.clearError();
      this.resetFileInput();
      this.fileCleared.emit(this.controlName);

      if (this.ngControl?.control) {
        this.ngControl.control.setValue(null);
        this.ngControl.control.markAsTouched();
        if (this.isRequired) {
          this.ngControl.control.setErrors({ required: true });
        }
      }
    });

    // Handle backend patches
    if (this.ngControl?.control) {
      if (this.ngControl.control.value) {
        setTimeout(() => this.handleValueChange(this.ngControl!.control!.value), 0);
      }

      this.valueChangeSub = this.ngControl.control.valueChanges.subscribe(value => {
        this.handleValueChange(value);
      });
    }
  }
openFileChooser() {
  this.fileInput.click(); // <-- the hidden file input
}
  private handleValueChange(value: any) {
    // Cleanup
    if (this.removeDisplayTextClickListener) {
      this.removeDisplayTextClickListener();
      this.removeDisplayTextClickListener = null;
    }
    if (this.currentFileURL) {
      URL.revokeObjectURL(this.currentFileURL);
      this.currentFileURL = null;
    }

    if (!value) {
      this.resetFileInput();
      return;
    }

    // ✅ Backend patches File → update UI, no emit
    if (value instanceof File) {
      this.clearError();
      this.updateDisplayWithFile(value);
      this.toggleIcons(true);
      return;
    }

    // ✅ Backend patches filename string
    if (typeof value === 'string') {
      this.updateDisplayWithFileName(value);
      this.toggleIcons(true);
      return;
    }

    // ✅ Backend patches { name, blob } object
    if (value && typeof value === 'object' && value.name && (value.blob || value.file)) {
      const blobPart = value.blob ?? value.file;
      const file = new File([blobPart], value.name, { type: blobPart.type || 'application/octet-stream' });
      this.handleValueChange(file);
      return;
    }

    this.resetFileInput();
  }

  private resetFileInput() {
    this.fileInput.value = '';
    this.updateDisplayText('No file chosen');
    this.renderer.setStyle(this.clearBtn, 'display', 'none');
    this.toggleIcons(false);

    if (this.removeDisplayTextClickListener) {
      this.removeDisplayTextClickListener();
      this.removeDisplayTextClickListener = null;
    }
    if (this.currentFileURL) {
      URL.revokeObjectURL(this.currentFileURL);
      this.currentFileURL = null;
    }
  }

  private updateDisplayText(text: string) {
    this.renderer.setProperty(this.displayText, 'innerText', text);
    this.renderer.setAttribute(this.displayText, 'title', text);
  }

  private updateDisplayWithFile(file: File) {
    this.updateDisplayText(file.name);
    this.renderer.setStyle(this.clearBtn, 'display', 'inline');

    if (this.currentFileURL) {
      URL.revokeObjectURL(this.currentFileURL);
    }

    this.currentFileURL = URL.createObjectURL(file);

    this.removeDisplayTextClickListener = this.renderer.listen(
      this.displayText,
      'click',
      (e: Event) => {
        e.stopPropagation();
        window.open(this.currentFileURL!, '_blank', 'noopener,noreferrer');
      }
    );
  }

  private updateDisplayWithFileName(fileName: string) {
    this.updateDisplayText(fileName);
    this.renderer.setStyle(this.clearBtn, 'display', 'inline');

    this.removeDisplayTextClickListener = this.renderer.listen(
      this.displayText,
      'click',
      (e: Event) => {
        e.stopPropagation();
        this.fileDownload.emit({ fileName, controlName: this.controlName });
      }
    );
  }

  private toggleIcons(hasFile: boolean) {
    this.renderer.setStyle(this.uploadIcon, 'display', hasFile ? 'none' : 'inline');
    this.renderer.setStyle(this.downloadIcon, 'display', hasFile ? 'inline' : 'none');
  }

  private setError(msg: string) {
    this.renderer.setProperty(this.errorMsg, 'innerText', msg || '');
  }

  private clearError() {
    this.renderer.setProperty(this.errorMsg, 'innerText', '');
  }

  ngOnDestroy(): void {
    if (this.valueChangeSub) this.valueChangeSub.unsubscribe();
    if (this.removeDisplayTextClickListener) {
      this.removeDisplayTextClickListener();
      this.removeDisplayTextClickListener = null;
    }
    if (this.currentFileURL) {
      URL.revokeObjectURL(this.currentFileURL);
      this.currentFileURL = null;
    }
  }
}

