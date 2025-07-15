import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

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

    // Set type to 'email' to trigger native email behavior
    this.renderer.setAttribute(input, 'type', 'email');

    // Optional HTML5 email pattern (can also use Angular Validators.email)
    this.renderer.setAttribute(
      input,
      'pattern',
      '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    );
    this.renderer.setAttribute(input, 'autocomplete', 'email');
    this.renderer.setAttribute(input, 'inputmode', 'email');
  }
}
