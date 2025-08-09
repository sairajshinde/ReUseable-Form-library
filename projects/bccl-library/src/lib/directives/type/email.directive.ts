import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[libEmail]',
  standalone: true
})
export class EmailDirective implements OnInit {
  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const input = this.el.nativeElement;

    if (input.tagName.toLowerCase() !== 'input') {
      console.warn('[libEmail] directive should be applied to an <input> element.');
      return;
    }

    this.renderer.setAttribute(input, 'type', 'email');
    this.renderer.setAttribute(input, 'autocomplete', 'email');
    this.renderer.setAttribute(input, 'inputmode', 'email');
    this.renderer.setAttribute(
      input,
      'pattern',
      "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    this.renderer.setAttribute(input, 'title', 'Enter a valid email (e.g. name@example.com)');
  }

  // ❌ BLOCK space character via keydown
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault(); // Block space key
    }
  }

  // 🧹 Clean up spaces on paste or any input change
  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const cleaned = input.value.replace(/\s+/g, '');

    if (input.value !== cleaned) {
      input.value = cleaned;
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  }
}
