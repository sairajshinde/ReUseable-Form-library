import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[libDualInputField]',
  standalone: true
})
export class DualInputFieldDirective implements AfterViewInit {
  @Input('libDualInputField') prefixes: string[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const host = this.el.nativeElement as HTMLElement;
    const inputs = host.querySelectorAll('input');

    if (inputs.length < 2) {
      console.warn('libDualInputField expects two <input> elements inside its container.');
      return;
    }

    if (!this.prefixes || this.prefixes.length < 2) {
      console.warn('libDualInputField expects an array of two strings.');
      return;
    }

    // Main container
    this.renderer.setStyle(host, 'display', 'flex');
    this.renderer.setStyle(host, 'flexDirection', 'column');
    this.renderer.setStyle(host, 'width', '250px');
    this.renderer.setStyle(host, 'paddingTop', '2px');

    const inputRow = this.renderer.createElement('div');
    this.renderer.setStyle(inputRow, 'display', 'flex');
    this.renderer.setStyle(inputRow, 'gap', '25px');

    inputs.forEach((input, index) => {
      const wrapper = this.renderer.createElement('div');
      this.renderer.setStyle(wrapper, 'display', 'flex');
      this.renderer.setStyle(wrapper, 'alignItems', 'center');
      this.renderer.setStyle(wrapper, 'gap', '4px');

      // Prefix
      const prefix = this.renderer.createElement('span');
      this.renderer.setStyle(prefix, 'fontSize', '14px');
      this.renderer.setStyle(prefix, 'whiteSpace', 'nowrap');
      this.renderer.appendChild(prefix, this.renderer.createText(this.prefixes[index]));

      // Reattach input
      const parent = input.parentElement!;
      this.renderer.removeChild(parent, input);
      this.renderer.setStyle(input, 'width', '85px'); // ✅ Approx 4 char width
      this.renderer.setStyle(input, 'textAlign', 'center');

      // Assemble
      this.renderer.appendChild(wrapper, prefix);
      this.renderer.appendChild(wrapper, input);
      this.renderer.appendChild(inputRow, wrapper);
    });

    // Move required span below if exists
    const requiredSpan = Array.from(host.childNodes).find(
      (node: any) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).tagName === 'SPAN' &&
        (node as HTMLElement).innerText.includes('*')
    ) as HTMLElement | undefined;

    if (requiredSpan) {
      this.renderer.removeChild(host, requiredSpan);
    }

    this.renderer.appendChild(host, inputRow);

    if (requiredSpan) {
      this.renderer.setStyle(requiredSpan, 'marginTop', '4px');
      this.renderer.setStyle(requiredSpan, 'fontSize', '12px');
      this.renderer.setStyle(requiredSpan, 'color', 'red');
      this.renderer.setStyle(requiredSpan, 'textAlign', 'left');
      this.renderer.appendChild(host, requiredSpan);
    }
  }
}

 