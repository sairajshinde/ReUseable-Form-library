import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'select[libSelect]',
  standalone: true
})
export class SelectDirective implements OnInit, OnChanges {
  @Input('libSelect') options: { label: string; id: any }[] = [];

  constructor(
    private el: ElementRef<HTMLSelectElement>,
    private renderer: Renderer2,
    private ngControl: NgControl
  ) { }

  ngOnInit(): void {
    this.applyUiUnderlineStyle();
    this.renderOptions();

    // Reset to placeholder if form resets
    this.ngControl.control?.valueChanges.subscribe(value => {
      if (!value) {
        this.el.nativeElement.selectedIndex = 0;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.renderOptions();
    }
  }

  private renderOptions(): void {
    const nativeSelect = this.el.nativeElement;

    // Clear existing options
    while (nativeSelect.firstChild) {
      nativeSelect.removeChild(nativeSelect.firstChild);
    }

    // Add placeholder option
    const placeholderOption = this.renderer.createElement('option');
    this.renderer.setProperty(placeholderOption, 'value', '');
    this.renderer.setProperty(placeholderOption, 'textContent', 'Select an option');
    this.renderer.setAttribute(placeholderOption, 'disabled', '');
    this.renderer.setAttribute(placeholderOption, 'selected', '');
    nativeSelect.appendChild(placeholderOption);

    // Add options dynamically
    this.options.forEach(option => {
      const opt = this.renderer.createElement('option');
      this.renderer.setProperty(opt, 'value', option.id);
      this.renderer.setProperty(opt, 'textContent', option.label);
      nativeSelect.appendChild(opt);
    });

    // Reset if no value is selected
    if (!this.ngControl?.control?.value) {
      nativeSelect.selectedIndex = 0;
    }
  }

  private applyUiUnderlineStyle(): void {
    const element = this.el.nativeElement;

    const arrowSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='gray' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpolyline points='6 9 12 15 18 9' /%3E%3C/svg%3E")`;

    this.renderer.setStyle(element, 'border', 'none');
    this.renderer.setStyle(element, 'borderBottom', '2px solid #ccc');
    this.renderer.setStyle(element, 'outline', 'none');
    this.renderer.setStyle(element, 'fontSize', '14px');
    this.renderer.setStyle(element, 'padding', '6px 4px');
    this.renderer.setStyle(element, 'backgroundColor', 'transparent');
    this.renderer.setStyle(element, 'boxSizing', 'border-box');
    this.renderer.setStyle(element, 'lineHeight', '1.5');
    this.renderer.setStyle(element, 'height', '32px');
    this.renderer.setStyle(element, 'width', '100%');
    this.renderer.setStyle(element, 'maxWidth', '250px');
    this.renderer.setStyle(element, 'appearance', 'none');
    this.renderer.setStyle(element, '-webkit-appearance', 'none');
    this.renderer.setStyle(element, '-moz-appearance', 'none');
    this.renderer.setStyle(element, 'paddingRight', '24px');
    this.renderer.setStyle(element, 'backgroundColor', 'white');
    this.renderer.setStyle(element, 'backgroundImage', arrowSvg);
    this.renderer.setStyle(element, 'backgroundRepeat', 'no-repeat');
    this.renderer.setStyle(element, 'backgroundPosition', 'right 8px center');
    this.renderer.setStyle(element, 'backgroundSize', '20px 20px');

    // Focus and blur underline color
    this.renderer.listen(element, 'focus', () => {
      this.renderer.setStyle(element, 'borderBottom', '2px solid #1976d2');
    });
    this.renderer.listen(element, 'blur', () => {
      this.renderer.setStyle(element, 'borderBottom', '2px solid #ccc');
    });
  }
}
 