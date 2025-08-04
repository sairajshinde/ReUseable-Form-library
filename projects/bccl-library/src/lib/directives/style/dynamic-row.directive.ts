import { Directive, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[libDynamicRow]',
  standalone: true
})
export class DynamicRowDirective implements AfterViewInit, OnDestroy {
  private host: HTMLElement;

  private mql800: MediaQueryList;
  private mql600: MediaQueryList;
  private mql400: MediaQueryList;

  private listener800: () => void = () => { };
  private listener600: () => void = () => { };
  private listener400: () => void = () => { };


  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.host = this.el.nativeElement;

    this.mql800 = window.matchMedia('(max-width: 800px)');
    this.mql600 = window.matchMedia('(max-width: 600px)');
    this.mql400 = window.matchMedia('(max-width: 400px)');
  }

  ngAfterViewInit(): void {
    this.setContainerStyles();
    this.applyGridColumns();

    this.listener800 = () => this.applyGridColumns();
    this.listener600 = () => this.applyGridColumns();
    this.listener400 = () => this.applyGridColumns();

    this.mql800.addEventListener('change', this.listener800);
    this.mql600.addEventListener('change', this.listener600);
    this.mql400.addEventListener('change', this.listener400);
  }

  ngOnDestroy(): void {
    this.mql800.removeEventListener('change', this.listener800);
    this.mql600.removeEventListener('change', this.listener600);
    this.mql400.removeEventListener('change', this.listener400);
  }

  private setContainerStyles() {
    this.renderer.setStyle(this.host, 'display', 'grid');
    this.renderer.setStyle(this.host, 'gap', '16px');
    this.renderer.setStyle(this.host, 'margin-bottom', '24px');
  }

  private applyGridColumns() {
    if (this.mql400.matches) {
      // Mobile: 1 column + horizontal padding
      this.renderer.setStyle(this.host, 'grid-template-columns', '1fr');
      this.renderer.setStyle(this.host, 'padding-left', '16px');
      this.renderer.setStyle(this.host, 'padding-right', '16px');
    } else {
      // Remove horizontal padding for wider screens
      this.renderer.removeStyle(this.host, 'padding-left');
      this.renderer.removeStyle(this.host, 'padding-right');

      if (this.mql600.matches) {
        // Tablet portrait: 2 columns
        this.renderer.setStyle(this.host, 'grid-template-columns', 'repeat(2, 1fr)');
      } else if (this.mql800.matches) {
        // Tablet landscape: 3 columns
        this.renderer.setStyle(this.host, 'grid-template-columns', 'repeat(3, 1fr)');
      } else {
        // Desktop: 4 columns
        this.renderer.setStyle(this.host, 'grid-template-columns', 'repeat(4, 1fr)');
      }
    }

    // Style children inputs/selects/textareas
    Array.from(this.host.children).forEach((child: Element) => {
      const tag = child.tagName.toLowerCase();
      if (tag === 'input' || tag === 'select' || tag === 'textarea') {
        this.renderer.setStyle(child, 'width', '100%');
        this.renderer.setStyle(child, 'box-sizing', 'border-box');
        this.renderer.setStyle(child, 'min-height', '36px');
        this.renderer.setStyle(child, 'margin-top', '4px');
        this.renderer.setStyle(child, 'margin-bottom', '4px');
        this.renderer.setStyle(child, 'display', 'block');
      }
    });
  }
}
 