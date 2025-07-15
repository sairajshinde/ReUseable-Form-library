import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[libMultiFileUpload]',
  standalone: true
})
export class MultiFileUploadDirective implements OnInit {
  /**
   * Custom file types to accept. Default: '.pdf'
   * Example: '.pdf,.docx,.jpg'
   */
  @Input('libMultiFileUpload') accept: string = '.pdf';

  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const input = this.el.nativeElement;

    if (input.tagName.toLowerCase() !== 'input') {
      console.warn('[libMultiFileUpload] should be used on an <input> element.');
      return;
    }

    this.renderer.setAttribute(input, 'type', 'file');
    this.renderer.setAttribute(input, 'accept', this.accept);
    this.renderer.setAttribute(input, 'multiple', ''); // enable multi-file selection
  }
}
