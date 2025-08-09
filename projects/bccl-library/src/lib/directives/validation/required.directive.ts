import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  inject
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { FontLoaderService } from '../../services/font-loader.service';

@Directive({
  selector: '[libRequired]',
  standalone: true
})
export class RequiredDirective implements AfterViewInit, OnDestroy {
  private control = inject(NgControl);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private fontLoader = inject(FontLoaderService);

  private errorMsg!: HTMLElement;
  private wrapper!: HTMLElement;

  ngAfterViewInit(): void {
    const input = this.el.nativeElement;

    // Create wrapper
    this.wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(this.wrapper, 'display', 'flex');
    this.renderer.setStyle(this.wrapper, 'flexDirection', 'column');
    this.renderer.setStyle(this.wrapper, 'width', '100%');

    const parent = this.renderer.parentNode(input);
    this.renderer.insertBefore(parent, this.wrapper, input);
    this.renderer.removeChild(parent, input);
    this.renderer.appendChild(this.wrapper, input);

    // Create error message span
    this.errorMsg = this.renderer.createElement('span');
    this.renderer.setStyle(this.errorMsg, 'color', 'red');
    this.renderer.setStyle(this.errorMsg, 'fontFamily', '"Open Sans", sans-serif');
    this.renderer.setStyle(this.errorMsg, 'fontSize', '12px');
    this.renderer.setStyle(this.errorMsg, 'lineHeight', '1.2');
    this.renderer.setStyle(this.errorMsg, 'marginTop', '2px');
    this.renderer.setStyle(this.errorMsg, 'marginBottom', '5px');
    this.renderer.setStyle(this.errorMsg, 'display', 'block');
    this.renderer.setProperty(this.errorMsg, 'innerText', '');
    this.renderer.appendChild(this.wrapper, this.errorMsg);

    // Add required validator
    if (this.control?.control) {
      const baseValidator = this.control.control.validator;
      this.control.control.setValidators([
        ...(baseValidator ? [baseValidator] : []),
      (control) => {
        let value = control.value;

        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return { required: true };
        }

        // Remove leading/trailing whitespace
        value = value.trim();

        // Replace multiple spaces with a single space
        const cleanedValue = value.replace(/\s+/g, ' ');

        if (cleanedValue === '') return { required: true };

        // Optional: update the form control value to the cleaned one
        // (but only if it changed and control is valid)
        if (value !== cleanedValue && control.valid) {
          control.setValue(cleanedValue, { emitEvent: false }); // prevent infinite loop
        }

        return null;
      }

      ]);
      this.control.control.updateValueAndValidity();
    }

    // Handle blur
    this.renderer.listen(input, 'blur', () => {
      this.control.control?.markAsTouched();
      this.updateErrorMessage();
    });

    // Update on value changes
    this.control.valueChanges?.subscribe(() => {
      this.updateErrorMessage();
    });

    this.updateErrorMessage();
  }

  ngOnDestroy(): void {
    const input = this.el.nativeElement;
    const parent = this.renderer.parentNode(this.wrapper);
    if (parent && this.wrapper) {
      this.renderer.removeChild(parent, this.wrapper);
    }
  }

  private updateErrorMessage() {
    const control = this.control.control;
    const show = control && control.touched && control.invalid && control.errors?.['required'];
    this.renderer.setProperty(this.errorMsg, 'innerText', show ? 'Please fill this required field' : '');
  }
}

 