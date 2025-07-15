import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  AfterViewInit
} from '@angular/core';

@Directive({
  selector: '[libFileupload]',
  standalone: true
})
export class FileuploadDirective implements OnInit, AfterViewInit {
  @Input('libFileupload') accept: string = '.pdf';

  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const input = this.el.nativeElement;

    if (input.tagName.toLowerCase() !== 'input') {
      console.warn('[libFileupload] should be used on an <input type="file"> element');
      return;
    }

    this.renderer.setAttribute(input, 'type', 'file');
    this.renderer.setAttribute(input, 'accept', this.accept);
    this.renderer.setStyle(input, 'display', 'none'); // hide native input
  }

  ngAfterViewInit(): void {
    const input = this.el.nativeElement;
    const parent = input.parentElement;

    if (!parent) return;

    // Create a file upload container (displayed below the label and hidden input)
    const displayWrapper = this.renderer.createElement('div');
    this.renderer.setStyle(displayWrapper, 'display', 'flex');
    this.renderer.setStyle(displayWrapper, 'alignItems', 'center');
    this.renderer.setStyle(displayWrapper, 'gap', '8px');
    this.renderer.setStyle(displayWrapper, 'cursor', 'pointer');
    this.renderer.setStyle(displayWrapper, 'marginTop', '4px');

    // Icon
    const iconSpan = this.renderer.createElement('span');
    this.renderer.setStyle(iconSpan, 'width', '20px');
    this.renderer.setStyle(iconSpan, 'height', '20px');
    this.renderer.setProperty(iconSpan, 'innerHTML', `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
        <path d="M19.35 10.04A7.49 7.49 0 0 0 5.01 9.17 6 6 0 0 0 6 21h13a5 5 0 0 0 .35-10.96z"
              fill="white" stroke="grey" stroke-width="1.5"/>
        <path d="M13 9v15h-2v-6H8l4-4 4 4h-3z" fill="grey"/>
      </svg>
    `);

    // Text
    const labelText = this.renderer.createElement('span');
    const defaultText = this.renderer.createText('No file chosen');
    this.renderer.appendChild(labelText, defaultText);

    // Add icon + text to display
    this.renderer.appendChild(displayWrapper, iconSpan);
    this.renderer.appendChild(displayWrapper, labelText);

    // Insert displayWrapper below the hidden input
    this.renderer.insertBefore(parent, displayWrapper, input.nextSibling);

    // Update text on file select
    this.renderer.listen(input, 'change', () => {
      const fileName = input.files?.[0]?.name || 'No file chosen';
      labelText.textContent = fileName;
    });

    // Clicking on wrapper opens file selector
    this.renderer.listen(displayWrapper, 'click', () => {
      input.click();
    });
  }
}
