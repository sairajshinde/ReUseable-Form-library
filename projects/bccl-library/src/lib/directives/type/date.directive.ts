import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[libDate]',
  standalone: true
})
export class DateDirective implements OnInit {
  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const input = this.el.nativeElement;

    if (input.tagName.toLowerCase() !== 'input') {
      console.warn('[libDate] directive should be used on an <input> element.');
      return;
    }

    // Set type and attributes
    this.renderer.setAttribute(input, 'type', 'date');
    this.renderer.setAttribute(input, 'placeholder', 'Select date');
    this.renderer.setAttribute(input, 'autocomplete', 'off');

    // Input styles
    this.renderer.setStyle(input, '-webkit-appearance', 'none');
    this.renderer.setStyle(input, 'appearance', 'none');
    this.renderer.setStyle(input, 'paddingRight', '36px');
    this.renderer.setStyle(input, 'border', 'none');
    this.renderer.setStyle(input, 'borderBottom', '2px solid #ccc');
    this.renderer.setStyle(input, 'fontSize', '14px');
    this.renderer.setStyle(input, 'height', '36px');
    this.renderer.setStyle(input, 'width', '100%');
    this.renderer.setStyle(input, 'maxWidth', '250px');
    this.renderer.setStyle(input, 'backgroundColor', 'transparent');
    this.renderer.setStyle(input, 'boxSizing', 'border-box');
    this.renderer.setStyle(input, 'zIndex', '2');
    this.renderer.setStyle(input, 'position', 'relative');

    // Create wrapper
    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'position', 'relative');
    this.renderer.setStyle(wrapper, 'display', 'inline-block');
    this.renderer.setStyle(wrapper, 'width', '100%');
    this.renderer.setStyle(wrapper, 'maxWidth', '250px');

    const parent = input.parentElement;
    if (parent) {
      this.renderer.insertBefore(parent, wrapper, input);
      this.renderer.removeChild(parent, input);
      this.renderer.appendChild(wrapper, input);
    }

    // Custom icon
    const icon = this.renderer.createElement('span');
    this.renderer.setStyle(icon, 'position', 'absolute');
    this.renderer.setStyle(icon, 'top', 'calc(50% + 1px)');
    this.renderer.setStyle(icon, 'right', '8px');
    this.renderer.setStyle(icon, 'transform', 'translateY(-50%)');
    this.renderer.setStyle(icon, 'width', '18px');
    this.renderer.setStyle(icon, 'height', '18px');
    this.renderer.setStyle(icon, 'cursor', 'pointer');
    this.renderer.setStyle(icon, 'zIndex', '3');
    this.renderer.setStyle(icon, 'pointerEvents', 'auto');

    // this.renderer.setProperty(icon, 'innerHTML', `
    //   <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    //     xmlns="http://www.w3.org/2000/svg">
    //     <rect x="3" y="4" width="18" height="18" rx="2" ry="2"
    //       stroke="#999999" stroke-width="2" fill="none"/>
    //     <line x1="8" y1="2" x2="8" y2="6" stroke="#999999" stroke-width="2"/>
    //     <line x1="16" y1="2" x2="16" y2="6" stroke="#999999" stroke-width="2"/>
    //     <line x1="3" y1="10" x2="21" y2="10" stroke="#999999" stroke-width="2"/>
    //     <polyline points="9 16 11.5 18.5 15 14" stroke="#999999"
    //       stroke-width="2" fill="none"/>
    //   </svg>
    // `);

    this.renderer.appendChild(wrapper, icon);

    // Trigger date picker
    this.renderer.listen(icon, 'click', () => {
      if (typeof input.showPicker === 'function') {
        input.showPicker();
      } else {
        input.click();
      }
    });

    // Focus styles
    this.renderer.listen(input, 'focus', () => {
      this.renderer.setStyle(input, 'borderBottom', '2px solid #1976d2');
    });
    this.renderer.listen(input, 'blur', () => {
      this.renderer.setStyle(input, 'borderBottom', '2px solid #ccc');
    });
  }
}
