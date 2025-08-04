import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  inject,
  Optional
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[libFileupload]',
  standalone: true,
})
export class FileuploadDirective implements AfterViewInit, OnDestroy {
  @Input('libLabelText') labelConfig: [string, string] = ['#a1a1a1', ''];
  @Input() controlName: string = '';
  @Output() fileSelected = new EventEmitter<{ file: File | null; controlName: string }>();
  @Output() fileCleared = new EventEmitter<string>();

  private fileInput!: HTMLInputElement;
  private displayText!: HTMLElement;
  private clearBtn!: HTMLElement;
  private currentFileURL: string | null = null;
  private removeDisplayTextClickListener: (() => void) | null = null;

  private ngControl = inject(NgControl, { optional: true });

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    const host = this.el.nativeElement as HTMLElement;
    const parent = host.parentElement;
    if (!parent) return;

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
    this.renderer.setStyle(label, 'lineHeight', '18px');
    this.renderer.setStyle(label, 'maxWidth', '250px');
    this.renderer.setProperty(label, 'innerText', labelText);

    this.fileInput = this.renderer.createElement('input');
    this.renderer.setAttribute(this.fileInput, 'type', 'file');
    this.renderer.setAttribute(this.fileInput, 'accept', '.svg,.pdf,.jpg,.jpeg,.png');
    this.renderer.setStyle(this.fileInput, 'display', 'none');

    const displayRow = this.renderer.createElement('div');
    this.renderer.setStyle(displayRow, 'display', 'flex');
    this.renderer.setStyle(displayRow, 'alignItems', 'center');
    this.renderer.setStyle(displayRow, 'gap', '8px');
    this.renderer.setStyle(displayRow, 'padding', '6px 0');
    this.renderer.setStyle(displayRow, 'cursor', 'pointer');

    const iconSpan = this.renderer.createElement('span');
    this.renderer.setStyle(iconSpan, 'width', '20px');
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
    this.renderer.setStyle(fileContainer, 'position', 'relative');

    this.displayText = this.renderer.createElement('span');
    this.renderer.setStyle(this.displayText, 'fontSize', '14px');
    this.renderer.setStyle(this.displayText, 'color', '#666');
    this.renderer.setStyle(this.displayText, 'fontFamily', 'Open Sans');
    this.renderer.setStyle(this.displayText, 'maxWidth', '200px');
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

    this.renderer.listen(displayRow, 'click', () => {
      this.fileInput.click();
    });

    this.renderer.listen(this.fileInput, 'change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        const sizeInMB = file.size / (1024 * 1024);
        if (sizeInMB > 2) {
          alert('File size exceeds 2MB.');
          this.resetFileInput();
          this.fileSelected.emit({ file: null, controlName: this.controlName });
          return;
        }

        this.updateDisplayText(file.name);
        this.renderer.setStyle(this.clearBtn, 'display', 'inline');

        if (this.removeDisplayTextClickListener) {
          this.removeDisplayTextClickListener();
        }

        this.currentFileURL = URL.createObjectURL(file);
        this.removeDisplayTextClickListener = this.renderer.listen(
          this.displayText,
          'click',
          () => {
            if (this.currentFileURL) {
              window.open(this.currentFileURL, '_blank');
            }
          }
        );

        this.fileSelected.emit({ file, controlName: this.controlName });

        if (this.ngControl?.control) {
          this.ngControl.control.setValue(file.name);
        }
      } else {
        this.resetFileInput();
        this.fileSelected.emit({ file: null, controlName: this.controlName });
      }
    });

    this.renderer.listen(this.clearBtn, 'click', (e) => {
      e.stopPropagation();
      this.resetFileInput();
      this.fileSelected.emit({ file: null, controlName: this.controlName });
      this.fileCleared.emit(this.controlName); // ✅ This line sends event to parent
      if (this.ngControl?.control) {
        this.ngControl.control.setValue(null);
      }
    });


    this.renderer.insertBefore(parent, wrapper, host);
    this.renderer.removeChild(parent, host);
    this.renderer.appendChild(wrapper, label);
    this.renderer.appendChild(wrapper, displayRow);
    this.renderer.appendChild(wrapper, this.fileInput);

    if (this.ngControl?.control?.value) {
      this.updateDisplayText(this.ngControl.control.value);
      this.renderer.setStyle(this.clearBtn, 'display', 'inline');
    }

    this.ngControl?.control?.valueChanges.subscribe(value => {
      if (!value) {
        this.resetFileInput();
      }
    });
  }

  private updateDisplayText(text: string) {
    this.renderer.setProperty(this.displayText, 'innerText', text);
    this.renderer.setAttribute(this.displayText, 'title', text);
  }

  private resetFileInput() {
    if (this.currentFileURL) {
      URL.revokeObjectURL(this.currentFileURL);
      this.currentFileURL = null;
    }

    if (this.removeDisplayTextClickListener) {
      this.removeDisplayTextClickListener();
      this.removeDisplayTextClickListener = null;
    }

    this.fileInput.value = '';
    this.updateDisplayText('No file chosen');
    this.renderer.setStyle(this.clearBtn, 'display', 'none');
  }

  ngOnDestroy(): void {
    if (this.removeDisplayTextClickListener) {
      this.removeDisplayTextClickListener();
    }
  }
}
 