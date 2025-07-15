import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[libCheckbox]',
  standalone: true
})
export class CheckboxDirective implements OnInit {

  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const input = this.el.nativeElement;

    if (input.tagName.toLowerCase() !== 'input') {
      console.warn('[libCheckbox] directive should be applied to an <input> element.');
      return;
    }

    this.renderer.setAttribute(input, 'type', 'checkbox');
  }
}

