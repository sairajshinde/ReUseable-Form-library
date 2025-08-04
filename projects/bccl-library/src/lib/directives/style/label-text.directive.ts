import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[libLabelText]',
  standalone: true,
})
export class LibLabelTextDirective implements AfterViewInit {
  @Input('libLabelText') labelConfig: [string, string] = ['#a1a1a1', ''];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const input = this.el.nativeElement as HTMLElement;
    const parent = input.parentElement;
    if (!parent) return;

    const [color = '#a1a1a1', labelText = ''] = this.labelConfig;

    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'display', 'flex');
    this.renderer.setStyle(wrapper, 'flexDirection', 'column');
    this.renderer.setStyle(wrapper, 'width', '100%');
    this.renderer.setStyle(wrapper, 'margin', '6px 0');

    const label = this.renderer.createElement('label');
    this.renderer.setStyle(label, 'fontSize', '14px');
    this.renderer.setStyle(label, 'fontWeight', '500');
    this.renderer.setStyle(label, 'fontFamily', 'Open Sans');
    this.renderer.setStyle(label, 'color', color || '#a1a1a1');
    this.renderer.setStyle(label, 'marginBottom', '4px');
    this.renderer.setStyle(label, 'whiteSpace', 'normal');
    this.renderer.setStyle(label, 'wordBreak', 'break-word');
    this.renderer.setStyle(label, 'overflow', 'hidden');

    const lineHeightPx = 18;
    this.renderer.setStyle(label, 'lineHeight', `${lineHeightPx}px`);
    this.renderer.setStyle(label, 'height', `${lineHeightPx * 2}px`);

    const inputWidth = input.getBoundingClientRect().width;
    if (inputWidth) {
      this.renderer.setStyle(label, 'maxWidth', `${inputWidth}px`);
    } else {
      this.renderer.setStyle(label, 'maxWidth', '100%');
    }

    this.renderer.setProperty(label, 'innerText', labelText);

    this.renderer.insertBefore(parent, wrapper, input);
    this.renderer.removeChild(parent, input);
    this.renderer.appendChild(wrapper, label);
    this.renderer.appendChild(wrapper, input);
  }
}

 