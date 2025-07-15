import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[libUiBox]',
  standalone: true
})
export class UiBoxDirective implements OnInit, OnDestroy {
  @Input('libUiBox') iconClass: string = ''; // e.g., 'pi pi-user' or 'fa fa-user'

  private wrapper!: HTMLElement;
  private iconEl!: HTMLElement;
  private mediaQueryList!: MediaQueryList;
  private mediaListener!: () => void;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const input = this.el.nativeElement;
    const parent = input.parentNode;

    // Wrapper div
    this.wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(this.wrapper, 'display', 'flex');
    this.renderer.setStyle(this.wrapper, 'alignItems', 'center');
    this.renderer.setStyle(this.wrapper, 'border', '1px solid #ccc');
    this.renderer.setStyle(this.wrapper, 'borderRadius', '4px');
    this.renderer.setStyle(this.wrapper, 'padding', '4px 8px');
    this.renderer.setStyle(this.wrapper, 'boxSizing', 'border-box');
    this.renderer.setStyle(this.wrapper, 'background', '#fff');
    this.renderer.setStyle(this.wrapper, 'gap', '8px');

    // Insert wrapper before input
    this.renderer.insertBefore(parent, this.wrapper, input);
    // Move input inside wrapper
    this.renderer.appendChild(this.wrapper, input);

    // Icon setup if provided
    if (this.iconClass) {
      this.iconEl = this.renderer.createElement('i');
      this.iconClass.split(' ').forEach(cls => this.renderer.addClass(this.iconEl, cls));
      this.renderer.setStyle(this.iconEl, 'fontSize', '16px');
      this.renderer.setStyle(this.iconEl, 'color', '#888');
      this.renderer.setStyle(this.iconEl, 'display', 'flex');
      this.renderer.setStyle(this.iconEl, 'alignItems', 'center');
      this.renderer.setStyle(this.iconEl, 'justifyContent', 'center');
      this.renderer.appendChild(this.wrapper, this.iconEl);
      this.renderer.insertBefore(this.wrapper, this.iconEl, input);
    }

    // Style the input
    this.renderer.setStyle(input, 'border', 'none');
    this.renderer.setStyle(input, 'outline', 'none');
    this.renderer.setStyle(input, 'flex', '1');
    this.renderer.setStyle(input, 'fontSize', '14px');
    this.renderer.setStyle(input, 'background', 'transparent');
    this.renderer.setStyle(input, 'padding', '6px 4px');

    this.applyResponsiveWidth();

    this.mediaQueryList = window.matchMedia('(max-width: 768px)');
    const mediaChange = (e: MediaQueryListEvent) => this.applyResponsiveWidth(e.matches);
    this.mediaQueryList.addEventListener('change', mediaChange);
    this.mediaListener = () => this.mediaQueryList.removeEventListener('change', mediaChange);
  }

  private applyResponsiveWidth(isMobile: boolean = this.mediaQueryList?.matches): void {
    if (!this.wrapper) return;

    if (isMobile) {
      this.renderer.setStyle(this.wrapper, 'width', '100%');
    } else {
      this.renderer.setStyle(this.wrapper, 'width', '250px');
    }
  }

  ngOnDestroy(): void {
    if (this.mediaListener) this.mediaListener();
  }
}
