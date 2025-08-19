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

//   private ngControl = inject(NgControl, { optional: true });

//   constructor(private el: ElementRef, private renderer: Renderer2) { }

//   ngAfterViewInit(): void {
//     const host = this.el.nativeElement as HTMLElement;
//     const parent = host.parentElement;

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
//     this.renderer.setStyle(iconSpan, 'width', '20px');
//     this.renderer.setStyle(iconSpan, 'height', '20px');
//     this.renderer.setProperty(iconSpan, 'innerHTML', `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
//         <path d="M19.35 10.04A7.49 7.49 0 0 0 5.01 9.17 6 6 0 0 0 6 21h13a5 5 0 0 0 .35-10.96z" fill="white" stroke="grey" stroke-width="1.5"/>
//         <path d="M13 9v15h-2v-6H8l4-4 4 4h-3z" fill="grey"/>
//       </svg>
//     `);

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
//     this.renderer.setStyle(this.displayText, 'overflow', 'hidden');
//     this.renderer.setStyle(this.displayText, 'textOverflow', 'ellipsis');
//     this.renderer.setStyle(this.displayText, 'whiteSpace', 'nowrap');
//     this.renderer.setStyle(this.displayText, 'display', 'inline-block');
//     this.renderer.setAttribute(this.displayText, 'title', 'No file chosen');
//     this.renderer.setProperty(this.displayText, 'innerText', 'No file chosen');

//     this.clearBtn = this.renderer.createElement('span');
//     this.renderer.setStyle(this.clearBtn, 'color', 'black');
//     this.renderer.setStyle(this.clearBtn, 'fontSize', '18px');
//     this.renderer.setStyle(this.clearBtn, 'cursor', 'pointer');
//     this.renderer.setStyle(this.clearBtn, 'marginLeft', '4px');
//     this.renderer.setStyle(this.clearBtn, 'userSelect', 'none');
//     this.renderer.setStyle(this.clearBtn, 'display', 'none');
//     this.renderer.setProperty(this.clearBtn, 'innerText', '×');

//     this.renderer.appendChild(fileContainer, this.displayText);
//     this.renderer.appendChild(fileContainer, this.clearBtn);
//     this.renderer.appendChild(displayRow, iconSpan);
//     this.renderer.appendChild(displayRow, fileContainer);

//     if (!parent) return;
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
//       this.ngControl.control.setValidators([...validators, control => control.value ? null : { required: true }]);
//       this.ngControl.control.updateValueAndValidity();
//     }

//     this.renderer.listen(displayRow, 'click', () => {
//       this.dialogOpen = true;
//       this.fileInput.click();
//     });

//     this.renderer.listen(this.fileInput, 'blur', () => {
//       if (this.dialogOpen && !this.fileInput.files?.length) {
//         this.dialogOpen = false;
//         this.ngControl?.control?.markAsTouched();
//         this.updateErrorMessage();
//       }
//     });

//     this.renderer.listen(this.fileInput, 'change', (event: Event) => {
//       const target = event.target as HTMLInputElement;
//       const file = target.files?.[0];
//       this.dialogOpen = false;

//       if (file) {
//         const ext = '.' + file.name.split('.').pop()?.toLowerCase();
//         if (!this.allowedExtensions.includes(ext)) {
//           alert(`Invalid file type. Allowed: ${this.allowedExtensions.join(', ')}`);
//           this.resetFileInput();
//           this.fileSelected.emit({ file: null, controlName: this.controlName });
//           this.updateErrorMessage();
//           return;
//         }

//         if (file.size > 10 * 1024 * 1024) {
//           alert('File size exceeds 10MB.');
//           this.resetFileInput();
//           this.fileSelected.emit({ file: null, controlName: this.controlName });
//           this.updateErrorMessage();
//           return;
//         }

//         this.updateDisplayText(file.name);
//         this.renderer.setStyle(this.clearBtn, 'display', 'inline');
//         this.currentFileURL = URL.createObjectURL(file);

//         if (this.removeDisplayTextClickListener) this.removeDisplayTextClickListener();
//         this.removeDisplayTextClickListener = this.renderer.listen(this.displayText, 'click', () => {
//           if (this.currentFileURL) window.open(this.currentFileURL!, '_blank');
//         });

//         this.fileSelected.emit({ file, controlName: this.controlName });
//         this.ngControl?.control?.setValue(file.name);
//       } else {
//         this.resetFileInput();
//         this.fileSelected.emit({ file: null, controlName: this.controlName });
//       }

//       this.ngControl?.control?.markAsTouched();
//       this.updateErrorMessage();
//     });

//     this.renderer.listen(this.clearBtn, 'click', (e) => {
//       e.stopPropagation();
//       this.resetFileInput();
//       this.fileSelected.emit({ file: null, controlName: this.controlName });
//       this.fileCleared.emit(this.controlName);
//       this.ngControl?.control?.setValue(null);
//       this.ngControl?.control?.markAsTouched();
//       this.updateErrorMessage();
//     });

//       this.ngControl?.control?.valueChanges.subscribe((value) => {
//       if (value === null) {
//         this.resetFileInput();
//       } else if (typeof value === 'string' && value.trim() !== '') {
//         this.updateDisplayText(value);
//         this.renderer.setStyle(this.clearBtn, 'display', 'inline');
//         this.renderer.setAttribute(this.displayText, 'title', value);
//       }
      
//       if (!this.initialLoad) {
//         this.updateErrorMessage();
//       } else {
//         this.initialLoad = false;
//       }
//     });


//   }

//   private updateDisplayText(text: string) {
//     this.renderer.setProperty(this.displayText, 'innerText', text);
//     this.renderer.setAttribute(this.displayText, 'title', text);
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

//   private updateErrorMessage() {
//     if (!this.isRequired) return;
//     const control = this.ngControl?.control;
//     const show = control && control.touched && control.invalid && control.errors?.['required'];
//     this.renderer.setProperty(this.errorMsg, 'innerText', show ? '' : '');
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

//   private fileInput!: HTMLInputElement;
//   private displayText!: HTMLElement;
//   private clearBtn!: HTMLElement;
//   private errorMsg!: HTMLElement;
//   private currentFileURL: string | null = null;
//   private removeDisplayTextClickListener: (() => void) | null = null;
//   private isRequired = false;
//   private dialogOpen = false;
//   private initialLoad = true;

//   private ngControl = inject(NgControl, { optional: true });

//   constructor(private el: ElementRef, private renderer: Renderer2) { }

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
//     this.renderer.setStyle(iconSpan, 'width', '20px');
//     this.renderer.setStyle(iconSpan, 'height', '20px');
//     this.renderer.setProperty(iconSpan, 'innerHTML', `
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
//         <path d="M19.35 10.04A7.49 7.49 0 0 0 5.01 9.17 6 6 0 0 0 6 21h13a5 5 0 0 0 .35-10.96z" fill="white" stroke="grey" stroke-width="1.5"/>
//         <path d="M13 9v15h-2v-6H8l4-4 4 4h-3z" fill="grey"/>
//       </svg>
//     `);

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
//     this.renderer.setStyle(this.displayText, 'overflow', 'hidden');
//     this.renderer.setStyle(this.displayText, 'textOverflow', 'ellipsis');
//     this.renderer.setStyle(this.displayText, 'whiteSpace', 'nowrap');
//     this.renderer.setStyle(this.displayText, 'display', 'inline-block');
//     this.renderer.setAttribute(this.displayText, 'title', 'No file chosen');
//     this.renderer.setProperty(this.displayText, 'innerText', 'No file chosen');

//     this.clearBtn = this.renderer.createElement('span');
//     this.renderer.setStyle(this.clearBtn, 'color', 'black');
//     this.renderer.setStyle(this.clearBtn, 'fontSize', '18px');
//     this.renderer.setStyle(this.clearBtn, 'cursor', 'pointer');
//     this.renderer.setStyle(this.clearBtn, 'marginLeft', '4px');
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
//       this.ngControl.control.setValidators([...validators, control => control.value ? null : { required: true }]);
//       this.ngControl.control.updateValueAndValidity();
//     }

//     // Click row to open file dialog
//     this.renderer.listen(displayRow, 'click', () => {
//       this.dialogOpen = true;
//       this.fileInput.click();
//     });

//     this.renderer.listen(this.fileInput, 'blur', () => {
//       if (this.dialogOpen && !this.fileInput.files?.length) {
//         this.dialogOpen = false;
//         this.ngControl?.control?.markAsTouched();
//         this.updateErrorMessage();
//       }
//     });

//     this.renderer.listen(this.fileInput, 'change', (event: Event) => {
//       const target = event.target as HTMLInputElement;
//       const file = target.files?.[0];
//       this.dialogOpen = false;

//       if (file) {
//         const ext = '.' + file.name.split('.').pop()?.toLowerCase();
//         if (!this.allowedExtensions.includes(ext)) {
//           alert(`Invalid file type. Allowed: ${this.allowedExtensions.join(', ')}`);
//           this.resetFileInput();
//           this.fileSelected.emit({ file: null, controlName: this.controlName });
//           this.updateErrorMessage();
//           return;
//         }

//         if (file.size > 10 * 1024 * 1024) {
//           alert('File size exceeds 10MB.');
//           this.resetFileInput();
//           this.fileSelected.emit({ file: null, controlName: this.controlName });
//           this.updateErrorMessage();
//           return;
//         }

//         this.updateDisplayText(file.name);
//         this.renderer.setStyle(this.clearBtn, 'display', 'inline');
//         this.currentFileURL = URL.createObjectURL(file);

//         if (this.removeDisplayTextClickListener) this.removeDisplayTextClickListener();
//         this.removeDisplayTextClickListener = this.renderer.listen(this.displayText, 'click', () => {
//           if (this.currentFileURL) window.open(this.currentFileURL!, '_blank');
//         });

//         this.fileSelected.emit({ file, controlName: this.controlName });
//         this.ngControl?.control?.setValue(file.name);
//       } else {
//         this.resetFileInput();
//         this.fileSelected.emit({ file: null, controlName: this.controlName });
//       }

//       this.ngControl?.control?.markAsTouched();
//       this.updateErrorMessage();
//     });

//     this.renderer.listen(this.clearBtn, 'click', (e) => {
//       e.stopPropagation();
//       this.resetFileInput();
//       this.fileSelected.emit({ file: null, controlName: this.controlName });
//       this.fileCleared.emit(this.controlName);
//       this.ngControl?.control?.setValue(null);
//       this.ngControl?.control?.markAsTouched();
//       this.updateErrorMessage();
//     });

//     // ✅ Populate on init if value exists
//     if (this.ngControl?.control?.value) {
//       this.updateDisplayText(this.ngControl.control.value);
//       this.renderer.setStyle(this.clearBtn, 'display', 'inline');
//     }

//     // Watch for external value changes
//     this.ngControl?.control?.valueChanges.subscribe((value) => {
//       if (value === null) {
//         this.resetFileInput();
//       } else if (typeof value === 'string' && value.trim() !== '') {
//         this.updateDisplayText(value);
//         this.renderer.setStyle(this.clearBtn, 'display', 'inline');
//       }
//       if (!this.initialLoad) {
//         this.updateErrorMessage();
//       } else {
//         this.initialLoad = false;
//       }
//     });
//   }

//   private updateDisplayText(text: string) {
//     this.renderer.setProperty(this.displayText, 'innerText', text);
//     this.renderer.setAttribute(this.displayText, 'title', text);
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

//   private updateErrorMessage() {
//     if (!this.isRequired) return;
//     const control = this.ngControl?.control;
//     const show = control && control.touched && control.invalid && control.errors?.['required'];
//     this.renderer.setProperty(this.errorMsg, 'innerText', show ? 'Please select a file' : '');
//   }

//   ngOnDestroy(): void {
//     this.removeDisplayTextClickListener?.();
//     if (this.currentFileURL) URL.revokeObjectURL(this.currentFileURL);
//   }
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

  private fileInput!: HTMLInputElement;
  private displayText!: HTMLElement;
  private clearBtn!: HTMLElement;
  private errorMsg!: HTMLElement;
  private currentFileURL: string | null = null;
  private removeDisplayTextClickListener: (() => void) | null = null;
  private isRequired = false;
  private dialogOpen = false;
  private initialLoad = true;

  private ngControl = inject(NgControl, { optional: true });

  constructor(private el: ElementRef, private renderer: Renderer2) { }

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

    const iconSpan = this.renderer.createElement('span');
    this.renderer.setStyle(iconSpan, 'width', '23px');
    this.renderer.setStyle(iconSpan, 'height', '20px');
    this.renderer.setProperty(iconSpan, 'innerHTML', `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
        <path d="M19.35 10.04A7.49 7.49 0 0 0 5.01 9.17 6 6 0 0 0 6 21h13a5 5 0 0 0 .35-10.96z" fill="white" stroke="grey" stroke-width="1.5"/>
        <path d="M13 9v15h-2v-6H8l4-4 4 4h-3z" fill="grey"/>
      </svg>
    `);

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
    this.renderer.setStyle(this.clearBtn, 'fontSize', '18px');
    this.renderer.setStyle(this.clearBtn, 'cursor', 'pointer');
    this.renderer.setStyle(this.clearBtn, 'marginLeft', '4px');
    this.renderer.setStyle(this.clearBtn, 'userSelect', 'none');
    this.renderer.setStyle(this.clearBtn, 'display', 'none');
    this.renderer.setProperty(this.clearBtn, 'innerText', '×');

    this.renderer.appendChild(fileContainer, this.displayText);
    this.renderer.appendChild(fileContainer, this.clearBtn);
    this.renderer.appendChild(displayRow, iconSpan);
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

    if (this.ngControl?.control && this.isRequired) {
      const validators = this.ngControl.control.validator ? [this.ngControl.control.validator] : [];
      this.ngControl.control.setValidators([...validators, control => control.value ? null : { required: true }]);
      this.ngControl.control.updateValueAndValidity();
    }

    // Click row to open file dialog
    this.renderer.listen(displayRow, 'click', () => {
      this.dialogOpen = true;
      this.fileInput.click();
    });

    this.renderer.listen(this.fileInput, 'blur', () => {
      if (this.dialogOpen && !this.fileInput.files?.length) {
        this.dialogOpen = false;
        this.ngControl?.control?.markAsTouched();
        // this.updateErrorMessage();
      }
    });

    this.renderer.listen(this.fileInput, 'change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      this.dialogOpen = false;

      if (file) {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!this.allowedExtensions.includes(ext)) {
          alert(`Invalid file type. Allowed: ${this.allowedExtensions.join(', ')}`);
          this.resetFileInput();
          this.fileSelected.emit({ file: null, controlName: this.controlName });
          // this.updateErrorMessage();
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          alert('File size exceeds 10MB.');
          this.resetFileInput();
          this.fileSelected.emit({ file: null, controlName: this.controlName });
          // this.updateErrorMessage();
          return;
        }

        this.updateDisplayWithFile(file);
        this.fileSelected.emit({ file, controlName: this.controlName });
        this.ngControl?.control?.setValue(file);
      } else {
        this.resetFileInput();
        this.fileSelected.emit({ file: null, controlName: this.controlName });
      }

      this.ngControl?.control?.markAsTouched();
      // this.updateErrorMessage();
    });

    this.renderer.listen(this.clearBtn, 'click', (e) => {
      e.stopPropagation();
      this.resetFileInput();
      this.fileSelected.emit({ file: null, controlName: this.controlName });
      this.fileCleared.emit(this.controlName);
      this.ngControl?.control?.setValue(null);
      this.ngControl?.control?.markAsTouched();
      // this.updateErrorMessage();
    });

    // Initial value handling
    if (this.ngControl?.control?.value) {
      this.handleValueChange(this.ngControl.control.value);
    }

    // Listen for programmatic changes
    this.ngControl?.control?.valueChanges.subscribe((value) => {
      this.handleValueChange(value);
      if (!this.initialLoad) {
        // this.updateErrorMessage();
      } else {
        this.initialLoad = false;
      }
    });
  }

  private handleValueChange(value: any) {
  // Remove old listeners & revoke old blob URL
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

  // ✅ Case 1: Local file
  if (value instanceof File) {
    this.updateDisplayWithFile(value);
    return;
  }

  // ✅ Case 2: Prefilled file from server (string name)
  if (typeof value === 'string') {
    this.updateDisplayText(value);
    this.renderer.setStyle(this.clearBtn, 'display', 'inline');

    // Bind click to API download
    this.removeDisplayTextClickListener = this.renderer.listen(this.displayText, 'click', () => {
      const encoded = btoa(value);
      // Open directly (browser decides preview or download)
      window.open(`https://uatjiffy.timesgroup.com/timescape/api/scholarship/downloadFile?fileName=${encoded}&type=`, '_blank');
    });
  }
}

private updateDisplayWithFile(file: File) {
  this.updateDisplayText(file.name);
  this.renderer.setStyle(this.clearBtn, 'display', 'inline');

  // Create blob preview URL for local files
  this.currentFileURL = URL.createObjectURL(file);
  this.removeDisplayTextClickListener = this.renderer.listen(this.displayText, 'click', () => {
    window.open(this.currentFileURL!, '_blank');
  });
}

private resetFileInput() {
  if (this.currentFileURL) {
    URL.revokeObjectURL(this.currentFileURL);
    this.currentFileURL = null;
  }
  this.fileInput.value = '';
  this.updateDisplayText('No file chosen');
  this.renderer.setStyle(this.clearBtn, 'display', 'none');

  if (this.removeDisplayTextClickListener) {
    this.removeDisplayTextClickListener();
    this.removeDisplayTextClickListener = null;
  }
}

  private updateDisplayText(text: string) {
    this.renderer.setProperty(this.displayText, 'innerText', text);
    this.renderer.setAttribute(this.displayText, 'title', text);
  }



  ngOnDestroy(): void {
    this.removeDisplayTextClickListener?.();
    if (this.currentFileURL) URL.revokeObjectURL(this.currentFileURL);
  }
}
  // private resetFileInput() {
  //   if (this.currentFileURL) {
  //     URL.revokeObjectURL(this.currentFileURL);
  //     this.currentFileURL = null;
  //   }
  //   this.fileInput.value = '';
  //   this.updateDisplayText('No file chosen');
  //   this.renderer.setStyle(this.clearBtn, 'display', 'none');
  //   if (this.removeDisplayTextClickListener) {
  //     this.removeDisplayTextClickListener();
  //     this.removeDisplayTextClickListener = null;
  //   }
  // }

  // private updateErrorMessage() {
  //   if (!this.isRequired) return;
  //   const control = this.ngControl?.control;
  //   const show = control && control.touched && control.invalid && control.errors?.['required'];
  //   this.renderer.setProperty(this.errorMsg, 'innerText', show ? 'Please fill this required field' : '');
  // }
  
  // private handleValueChange(value: any) {
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

  //   if (value instanceof File) {
  //     this.updateDisplayWithFile(value);
  //     return;
  //   }

  //   if (typeof value === 'string') {
  //     this.updateDisplayText(value);
  //     this.renderer.setStyle(this.clearBtn, 'display', 'inline');
  //     this.removeDisplayTextClickListener = this.renderer.listen(this.displayText, 'click', () => {
  //       window.open(`/scholarship/downloadFile?fileName=${btoa(value)}`, '_blank');
  //     });
  //   }
  // }

  // private updateDisplayWithFile(file: File) {
  //   this.updateDisplayText(file.name);
  //   this.renderer.setStyle(this.clearBtn, 'display', 'inline');
  //   this.currentFileURL = URL.createObjectURL(file);
  //   this.removeDisplayTextClickListener = this.renderer.listen(this.displayText, 'click', () => {
  //     window.open(this.currentFileURL!, '_blank');
  //   });
  // }
