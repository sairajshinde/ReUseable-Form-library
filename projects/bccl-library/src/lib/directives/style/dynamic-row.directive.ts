import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[libDynamicRow]',
  standalone: true
})
export class DynamicRowDirective implements OnInit, AfterViewInit, OnDestroy {
  private static maxInputCount: number = 0;
  private mediaQueryList!: MediaQueryList;
  private cleanupFn!: () => void;
  private inputCount = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const container = this.el.nativeElement;

    this.renderer.setStyle(container, 'display', 'grid');
    this.renderer.setStyle(container, 'width', '100%');
    this.renderer.setStyle(container, 'padding', '0 16px');
    this.renderer.setStyle(container, 'boxSizing', 'border-box');

    this.mediaQueryList = window.matchMedia('(max-width: 768px)');
    const updateLayout = () => this.applyResponsiveStyles();
    this.mediaQueryList.addEventListener('change', updateLayout);
    this.cleanupFn = () =>
      this.mediaQueryList.removeEventListener('change', updateLayout);
  }

  ngAfterViewInit(): void {
    const container = this.el.nativeElement;

    const fields = Array.from(
      container.querySelectorAll('input, select, textarea')
    ) as HTMLElement[];

    this.inputCount = fields.length;

    // Update global max count
    if (this.inputCount > DynamicRowDirective.maxInputCount) {
      DynamicRowDirective.maxInputCount = this.inputCount;
      setTimeout(() => {
        const allContainers = document.querySelectorAll('[libDynamicRow]');
        allContainers.forEach(el => {
          (el as HTMLElement).style.gridTemplateColumns =
            window.innerWidth < 768
              ? '1fr'
              : `repeat(${DynamicRowDirective.maxInputCount}, 1fr)`;
        });
      }, 0);
    }

    // Wrap each field
    fields.forEach((field: HTMLElement) => {
      const wrapper = this.renderer.createElement('div');
      this.renderer.addClass(wrapper, 'input-wrapper');

      this.renderer.setStyle(wrapper, 'display', 'flex');
      this.renderer.setStyle(wrapper, 'flexDirection', 'column');
      this.renderer.setStyle(wrapper, 'margin', '5px 5px 2px 0');

      const parent = field.parentElement;
      if (parent) {
        this.renderer.insertBefore(parent, wrapper, field);
        this.renderer.removeChild(parent, field);
        this.renderer.appendChild(wrapper, field);
      }

      const errorSpan = this.renderer.createElement('span');
      this.renderer.addClass(errorSpan, 'error-span');
      this.renderer.setStyle(errorSpan, 'fontSize', '12px');
      this.renderer.setStyle(errorSpan, 'color', 'red');
      this.renderer.setStyle(errorSpan, 'marginTop', '2px');
      this.renderer.setProperty(errorSpan, 'innerText', '');

      this.renderer.appendChild(wrapper, errorSpan);
    });

    this.applyResponsiveStyles();
  }

  private applyResponsiveStyles(): void {
    const container = this.el.nativeElement;
    const isMobile = this.mediaQueryList.matches;

    const gap = isMobile ? '6px' : '40px';
    const columns = isMobile ? 1 : DynamicRowDirective.maxInputCount || 1;

    this.renderer.setStyle(container, 'gap', gap);
    this.renderer.setStyle(container, 'gridTemplateColumns', `repeat(${columns}, 1fr)`);
  }

  ngOnDestroy(): void {
    this.cleanupFn?.();
  }
}
