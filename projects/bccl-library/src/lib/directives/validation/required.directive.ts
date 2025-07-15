import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[libRequired]',
  standalone: true
})
export class RequiredDirective implements AfterViewInit {
  private errorMsg!: HTMLElement;

  constructor(
    private control: NgControl,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    const input = this.el.nativeElement;

    // 🟩 Step 1: Wrap input and error in their own container
    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'display', 'flex');
    this.renderer.setStyle(wrapper, 'flexDirection', 'column');
    this.renderer.setStyle(wrapper, 'width', '100%');

    const parent = this.renderer.parentNode(input);
    this.renderer.insertBefore(parent, wrapper, input);
    this.renderer.removeChild(parent, input);
    this.renderer.appendChild(wrapper, input);

    // 🟩 Step 2: Create error span
    this.errorMsg = this.renderer.createElement('span');
    this.renderer.setStyle(this.errorMsg, 'color', 'red');
    this.renderer.setStyle(this.errorMsg, 'fontSize', '12px');
    this.renderer.setStyle(this.errorMsg, 'lineHeight', '1.2');
    this.renderer.setStyle(this.errorMsg, 'marginTop', '2px');
    this.renderer.setStyle(this.errorMsg, 'marginBottom', '30px');
    this.renderer.setStyle(this.errorMsg, 'display', 'block');
    this.renderer.setProperty(this.errorMsg, 'innerText', '');
    this.renderer.appendChild(wrapper, this.errorMsg);

    // 🟩 Step 3: Setup validation
    if (this.control?.control) {
      const baseValidator = this.control.control.validator;
      this.control.control.setValidators([
        ...(baseValidator ? [baseValidator] : []),
        (control) => control.value ? null : { required: true }
      ]);
      this.control.control.updateValueAndValidity();
    }

    // 🟩 Step 4: Event listeners
    this.renderer.listen(input, 'blur', () => {
      this.control.control?.markAsTouched();
      this.updateErrorMessage();
    });

    this.control.valueChanges?.subscribe(() => {
      this.updateErrorMessage();
    });
  }

  private updateErrorMessage() {
    const control = this.control.control;
    const show = control && control.touched && control.invalid && control.errors?.['required'];
    this.renderer.setProperty(this.errorMsg, 'innerText', show ? 'Required' : '');
  }
}
