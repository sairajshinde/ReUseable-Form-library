import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[libSpinner]',
  standalone: true
})
export class SpinnerDirective implements OnInit, OnDestroy {
  @Input('libSpinnerColor') color: string = 'rgb(0, 191, 255)'; // Default color changed

  private spinnerElement!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Create spinner wrapper
    const spinnerWrapper = this.renderer.createElement('div');
    this.renderer.setStyle(spinnerWrapper, 'position', 'fixed');
    this.renderer.setStyle(spinnerWrapper, 'top', '0');
    this.renderer.setStyle(spinnerWrapper, 'left', '0');
    this.renderer.setStyle(spinnerWrapper, 'width', '100%');
    this.renderer.setStyle(spinnerWrapper, 'height', '100%');
    this.renderer.setStyle(spinnerWrapper, 'display', 'flex');
    this.renderer.setStyle(spinnerWrapper, 'alignItems', 'center');
    this.renderer.setStyle(spinnerWrapper, 'justifyContent', 'center');
    this.renderer.setStyle(spinnerWrapper, 'background', 'rgba(255,255,255,0.8)');
    this.renderer.setStyle(spinnerWrapper, 'zIndex', '9999');

    // Create spinner circle
    const spinner = this.renderer.createElement('div');
    this.renderer.setStyle(spinner, 'border', `8px solid #f3f3f3`);
    this.renderer.setStyle(spinner, 'borderTop', `8px solid ${this.color}`);
    this.renderer.setStyle(spinner, 'borderRadius', '50%');
    this.renderer.setStyle(spinner, 'width', '60px');
    this.renderer.setStyle(spinner, 'height', '60px');
    this.renderer.setStyle(spinner, 'animation', 'spin 1s linear infinite');

    // Append spinner to wrapper
    this.renderer.appendChild(spinnerWrapper, spinner);

    // Add keyframes for spin animation
    const styleTag = this.renderer.createElement('style');
    styleTag.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    this.renderer.appendChild(document.head, styleTag);

    // Append wrapper to body
    this.renderer.appendChild(document.body, spinnerWrapper);
    this.spinnerElement = spinnerWrapper;
  }

  ngOnDestroy(): void {
    if (this.spinnerElement) {
      this.renderer.removeChild(document.body, this.spinnerElement);
    }
  }
}
 