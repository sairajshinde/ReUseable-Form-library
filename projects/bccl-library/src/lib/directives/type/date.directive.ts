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

    // Set input type and attributes
    this.renderer.setAttribute(input, 'type', 'date');
    this.renderer.setAttribute(input, 'placeholder', 'Select date');
    this.renderer.setAttribute(input, 'autocomplete', 'off');

    // Prevent typing but allow native calendar
    this.renderer.listen(input, 'keydown', (event: KeyboardEvent) => {
      event.preventDefault();
    });
    this.renderer.setStyle(input, 'cursor', 'pointer');

    // Input styling
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

    // Optional: Add custom clickable calendar icon
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

    // Optional: add a calendar SVG icon (commented out)
    // this.renderer.setProperty(icon, 'innerHTML', `<svg>...</svg>`);

    this.renderer.appendChild(wrapper, icon);

    // Trigger native date picker on icon click
    this.renderer.listen(icon, 'click', () => {
      if (typeof input.showPicker === 'function') {
        input.showPicker();
      } else {
        input.click();
      }
    });

    // Focus and blur border animation
    this.renderer.listen(input, 'focus', () => {
      this.renderer.setStyle(input, 'borderBottom', '2px solid #1976d2');
    });
    this.renderer.listen(input, 'blur', () => {
      this.renderer.setStyle(input, 'borderBottom', '2px solid #ccc');
    });
  }
}
 