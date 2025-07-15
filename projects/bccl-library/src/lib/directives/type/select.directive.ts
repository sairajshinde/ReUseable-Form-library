import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[libSelect]',
  standalone: true
})
export class SelectDirective implements OnInit {
  /**
   * Accepts: [{ id: number | string, label: string }]
   */
  @Input('libSelect') options: Array<{ id: string | number; label: string }> = [];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const select = this.el.nativeElement;

    if (select.tagName.toLowerCase() !== 'select') {
      console.warn('[libSelect] directive should be applied to a <select> element.');
      return;
    }

    // Clear existing options
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }

    // Default placeholder option
    const defaultOption = this.renderer.createElement('option');
    this.renderer.setProperty(defaultOption, 'value', '');
    this.renderer.setProperty(defaultOption, 'innerText', 'Select an option');
    this.renderer.appendChild(select, defaultOption);

    // Add user-defined options
    this.options.forEach(opt => {
      const optionEl = this.renderer.createElement('option');
      this.renderer.setProperty(optionEl, 'value', opt.id);
      this.renderer.setProperty(optionEl, 'innerText', opt.label);
      this.renderer.appendChild(select, optionEl);
    });

    // ✅ Underline input styles
    this.renderer.setStyle(select, 'border', 'none');
    this.renderer.setStyle(select, 'borderBottom', '2px solid #ccc');
    this.renderer.setStyle(select, 'outline', 'none');
    this.renderer.setStyle(select, 'fontSize', '14px');
    this.renderer.setStyle(select, 'padding', '6px 4px');
    this.renderer.setStyle(select, 'backgroundColor', 'white');
    this.renderer.setStyle(select, 'boxSizing', 'border-box');
    this.renderer.setStyle(select, 'lineHeight', '1.5');
    this.renderer.setStyle(select, 'height', '32px');
    this.renderer.setStyle(select, 'width', '100%');
    this.renderer.setStyle(select, 'maxWidth', '250px');
    this.renderer.setStyle(select, 'cursor', 'pointer');

    // ✅ Remove native dropdown styling
    this.renderer.setStyle(select, 'appearance', 'none');
    this.renderer.setStyle(select, '-webkit-appearance', 'none');
    this.renderer.setStyle(select, '-moz-appearance', 'none');

    // ✅ Add outlined down arrow icon as background
    const arrowSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='gray' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpolyline points='6 9 12 15 18 9' /%3E%3C/svg%3E")`;
    this.renderer.setStyle(select, 'backgroundImage', arrowSvg);
    this.renderer.setStyle(select, 'backgroundRepeat', 'no-repeat');
    this.renderer.setStyle(select, 'backgroundPosition', 'right 8px center'); // Align arrow
    this.renderer.setStyle(select, 'backgroundSize', '16px 16px'); // Smaller arrow
    this.renderer.setStyle(select, 'paddingRight', '30px'); // Space for arrow

    // ✅ Focus underline
    this.renderer.listen(select, 'focus', () => {
      this.renderer.setStyle(select, 'borderBottom', '2px solid #1976d2');
    });

    this.renderer.listen(select, 'blur', () => {
      this.renderer.setStyle(select, 'borderBottom', '2px solid #ccc');
    });
  }
}
