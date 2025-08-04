import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[libSelect]',
  standalone: true
})
export class SelectDirective implements OnInit, OnChanges {
  @Input('libSelect') options: Array<{ id: string | number; label: string }> = [];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.applyStyles();
    this.renderOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.renderOptions();
    }
  }

  private renderOptions(): void {
    const select = this.el.nativeElement;

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
  }

  private applyStyles(): void {
    const select = this.el.nativeElement;
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
    this.renderer.setStyle(select, 'appearance', 'none');
    this.renderer.setStyle(select, '-webkit-appearance', 'none');
    this.renderer.setStyle(select, '-moz-appearance', 'none');

    const arrowSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='gray' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpolyline points='6 9 12 15 18 9' /%3E%3C/svg%3E")`;
    this.renderer.setStyle(select, 'backgroundImage', arrowSvg);
    this.renderer.setStyle(select, 'backgroundRepeat', 'no-repeat');
    this.renderer.setStyle(select, 'backgroundPosition', 'right 8px center');
    this.renderer.setStyle(select, 'backgroundSize', '16px 16px');
    this.renderer.setStyle(select, 'paddingRight', '30px');

    this.renderer.listen(select, 'focus', () => {
      this.renderer.setStyle(select, 'borderBottom', '2px solid #1976d2');
    });

    this.renderer.listen(select, 'blur', () => {
      this.renderer.setStyle(select, 'borderBottom', '2px solid #ccc');
    });
  }
}

 