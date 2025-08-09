import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';
import { FontLoaderService } from '../../services/font-loader.service';

@Directive({
  selector: '[libPrimaryButton]',
  standalone: true
})
export class PrimaryButtonDirective implements OnInit {
  private fontLoader = inject(FontLoaderService);
  @Input('libPrimaryButton') inputData: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    const button = this.el.nativeElement;

    // Parse input (e.g., "center,Submit")
    const [positionRaw = 'left', title = 'Button'] = this.inputData.split(',').map(s => s.trim());
    const position = positionRaw.toLowerCase() as 'left' | 'center' | 'right';

    // Set button styles
    // Set button styles
    this.renderer.setStyle(button, 'padding', '12px 24px');         // More padding
    this.renderer.setStyle(button, 'font-size', '14px');            // Bigger font
    this.renderer.setStyle(button, 'background-color', 'rgb(0, 191, 255)');  // Blue
    this.renderer.setStyle(button, 'color', 'white');               // White text
    this.renderer.setStyle(button, 'border', 'none');
    this.renderer.setStyle(button, 'border-radius', '6px');
    this.renderer.setStyle(button, 'cursor', 'pointer');
    this.renderer.setStyle(button, 'font-weight', '600');           // Semi-bold
    this.renderer.setStyle(button, 'margin', '25px 10px');
    this.renderer.setStyle(button, 'flex-shrink', '0');
    this.renderer.setStyle(button, 'letter-spacing', '0.5px');      // Optional: spacing between letters
    this.renderer.setStyle(button, 'min-width', '120px');           // Optional: consistent button width


    // Set button text
    this.renderer.setProperty(button, 'innerText', title);

    // Wrap buttons together in a flex container based on position
    const host = button.parentNode;
    const wrapperClass = `lib-btn-wrapper-${position}`;

    if (!host.querySelector(`.${wrapperClass}`)) {
      const wrapper = this.renderer.createElement('div');
      this.renderer.addClass(wrapper, wrapperClass);
      this.renderer.setStyle(wrapper, 'display', 'flex');
      this.renderer.setStyle(wrapper, 'flex-wrap', 'wrap');
      this.renderer.setStyle(wrapper, 'gap', '5px');
      this.renderer.setStyle(wrapper, 'width', '100%');

      if (position === 'center') {
        this.renderer.setStyle(wrapper, 'justify-content', 'center');
      } else if (position === 'right') {
        this.renderer.setStyle(wrapper, 'justify-content', 'flex-end');
      } else {
        this.renderer.setStyle(wrapper, 'justify-content', 'flex-start');
      }

      this.renderer.appendChild(host, wrapper);
    }

    const targetWrapper = host.querySelector(`.${wrapperClass}`);
    this.renderer.appendChild(targetWrapper, button);
  }
}
 