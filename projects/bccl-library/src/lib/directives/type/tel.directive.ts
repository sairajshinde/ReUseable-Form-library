import { Directive, ElementRef, OnInit, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[libTel]',
  standalone: true
})
export class TelDirective implements OnInit {

  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Set input type to 'tel'
    this.renderer.setAttribute(this.el.nativeElement, 'type', 'tel');
  }

  // Optional: Restrict to digits and valid tel symbols
  @HostListener('input', ['$event'])
  onInput(): void {
    const input = this.el.nativeElement;
    const cleaned = input.value.replace(/[^0-9+()\- ]/g, ''); // Allow digits, +, -, (), space
    if (input.value !== cleaned) {
      input.value = cleaned;
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event); // update Angular form control
    }
  }
}
