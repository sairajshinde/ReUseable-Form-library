import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[libMultiSelect]',
  standalone: true
})
export class MultiSelectDirective implements OnInit {
  @Input('libMultiSelect') options: Array<string | { label: string, value: any }> = [];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const select = this.el.nativeElement;

    if (select.tagName.toLowerCase() !== 'select') {
      console.warn('[libMultiSelect] directive must be used on a <select> element.');
      return;
    }

    // Enable multiple selection
    this.renderer.setAttribute(select, 'multiple', '');

    // Clear existing options
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }

    // Add options
    this.options.forEach(opt => {
      const optionEl = this.renderer.createElement('option');
      if (typeof opt === 'string') {
        this.renderer.setProperty(optionEl, 'value', opt);
        this.renderer.setProperty(optionEl, 'innerText', opt);
      } else {
        this.renderer.setProperty(optionEl, 'value', opt.value);
        this.renderer.setProperty(optionEl, 'innerText', opt.label);
      }
      this.renderer.appendChild(select, optionEl);
    });
  }
}
