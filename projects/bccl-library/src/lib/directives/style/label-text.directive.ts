import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  OnInit,
  AfterViewInit
} from '@angular/core';

@Directive({
  selector: '[libLabelText]',
  standalone: true
})
export class LibLabelTextDirective implements OnInit, AfterViewInit {
  @Input('libLabelText') labelText = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const input = this.el.nativeElement;
    const parent = input.parentElement;

    if (!parent) return;

    // Create wrapper div
    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'display', 'flex');
    this.renderer.setStyle(wrapper, 'flexDirection', 'column');
    this.renderer.setStyle(wrapper, 'width', '100%');
    this.renderer.setStyle(wrapper, 'margin', '6px 0');

    // Create label
    const label = this.renderer.createElement('label');
    this.renderer.setStyle(label, 'fontSize', '14px');
    this.renderer.setStyle(label, 'fontWeight', '500');
    this.renderer.setStyle(label, 'fontFamily', 'Open Sans');
    this.renderer.setStyle(label, 'color', '#a1a1a1');
    this.renderer.setStyle(label, 'marginBottom', '4px');
    this.renderer.setProperty(label, 'innerText', this.labelText);

    // Move input and append everything
    this.renderer.insertBefore(parent, wrapper, input);
    this.renderer.removeChild(parent, input);
    this.renderer.appendChild(wrapper, label);
    this.renderer.appendChild(wrapper, input);
  }
}
