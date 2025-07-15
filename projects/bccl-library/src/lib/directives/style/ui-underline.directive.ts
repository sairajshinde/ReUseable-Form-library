import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[libUiUnderline]',
  standalone: true
})
export class UiUnderlineDirective implements OnInit, OnDestroy {
  private mediaQueryList!: MediaQueryList;
  private listener!: () => void;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;
    const tag = element.tagName.toLowerCase();

    // Common styles for all field types
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

    if (tag === 'select') {
      this.renderer.setStyle(element, 'appearance', 'none');
      this.renderer.setStyle(element, '-webkit-appearance', 'none');
      this.renderer.setStyle(element, '-moz-appearance', 'none');
      this.renderer.setStyle(element, 'paddingRight', '24px');
      this.renderer.setStyle(element, 'backgroundColor', 'white');
    }

    if (tag === 'textarea') {
      this.renderer.setStyle(element, 'resize', 'vertical');
      this.renderer.setStyle(element, 'height', 'auto');
      this.renderer.setStyle(element, 'minHeight', '60px');
    }

    if (tag === 'input' && element.type === 'file') {
      this.renderer.setStyle(element, 'paddingTop', '6px');
      this.renderer.setStyle(element, 'paddingBottom', '6px');
      this.renderer.setStyle(element, 'border', 'none');
      this.renderer.setStyle(element, 'borderBottom', '2px solid #ccc');
    }

    this.mediaQueryList = window.matchMedia('(max-width: 768px)');
    const mqListener = (e: MediaQueryListEvent) => {
      this.applyResponsiveWidth(e.matches);
    };
    this.mediaQueryList.addEventListener('change', mqListener);
    this.listener = () => this.mediaQueryList.removeEventListener('change', mqListener);

    this.applyResponsiveWidth(this.mediaQueryList.matches);

    this.renderer.listen(element, 'focus', () => {
      this.renderer.setStyle(element, 'borderBottom', '2px solid #1976d2');
    });

    this.renderer.listen(element, 'blur', () => {
      this.renderer.setStyle(element, 'borderBottom', '2px solid #ccc');
    });
  }

  private applyResponsiveWidth(isMobile: boolean): void {
    const element = this.el.nativeElement;
    this.renderer.setStyle(element, 'width', '100%');
    this.renderer.setStyle(element, 'maxWidth', '250px');
  }

  ngOnDestroy(): void {
    if (this.listener) this.listener();
  }
}
