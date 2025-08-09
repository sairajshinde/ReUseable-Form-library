import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[libText]',
  standalone: true
})
export class TextDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(): void {
    const input = this.el.nativeElement;

    // 1. Remove invalid characters (allow only letters and spaces)
    let cleaned = input.value.replace(/[^a-zA-Z ]/g, '');

    // 2. Remove leading spaces
    cleaned = cleaned.replace(/^\s+/, '');

    // 3. Replace multiple spaces between words with a single space
    cleaned = cleaned.replace(/\s{2,}/g, ' ');

    // If value changed, update input and trigger native input event
    if (input.value !== cleaned) {
      input.value = cleaned;
      const nativeInputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(nativeInputEvent);
    }
  }
}
