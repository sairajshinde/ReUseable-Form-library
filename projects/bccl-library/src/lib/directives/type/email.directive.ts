import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[libEmail]',
  standalone: true
})
export class EmailDirective implements OnInit {

  // ❌ Anything NOT allowed
  // ✅ Allowed → a-z, A-Z, 0-9, @ . _ -
  private readonly forbiddenChars = /[^a-zA-Z0-9@._-]/g;

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
      "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    this.renderer.setAttribute(input, 'title', 'Enter a valid email (e.g. name@example.com)');
  }

  // ❌ Block forbidden characters on keydown
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.forbiddenChars.test(event.key)) {
      event.preventDefault();
    }
  }

  // ❌ Block paste with forbidden characters
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const pastedData = event.clipboardData?.getData('text') || '';
    if (this.forbiddenChars.test(pastedData)) {
      event.preventDefault();
      const cleaned = pastedData.replace(this.forbiddenChars, '');
      document.execCommand('insertText', false, cleaned);
    }
  }

  // 🧹 Clean up forbidden chars on input (autocomplete etc.)
  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const cleaned = input.value.replace(this.forbiddenChars, '');
    if (input.value !== cleaned) {
      input.value = cleaned;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
