import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[libText]',
  standalone: true
})
export class TextDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement;
    const cleaned = input.value.replace(/[^a-zA-Z ]/g, ''); // allows letters and spaces
    if (input.value !== cleaned) {
      input.value = cleaned;
      const nativeInputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(nativeInputEvent); // update formControl
    }
  }
}
