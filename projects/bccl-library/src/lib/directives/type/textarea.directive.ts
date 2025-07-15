import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[libTextarea]',
  standalone: true
})
export class TextareaDirective implements OnInit {
  @Input('libTextarea') maxLength: number = 200;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;

    // Convert to textarea if input type
    if (element.tagName.toLowerCase() === 'input') {
      this.renderer.setAttribute(element, 'type', 'text');
      this.renderer.setStyle(element, 'resize', 'vertical');
      this.renderer.setStyle(element, 'overflow', 'auto');
      this.renderer.setStyle(element, 'height', '80px');
      this.renderer.setStyle(element, 'whiteSpace', 'pre-wrap');
    }

    // Enforce maxLength
    this.renderer.setAttribute(element, 'maxlength', this.maxLength.toString());

    // Optional: Multiline look
    this.renderer.setStyle(element, 'lineHeight', '1.5');
  }
}
