import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  OnInit,
  AfterViewInit,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[libPlaceholderTitle]',
  standalone: true
})
export class LibPlaceholderTitleDirective implements OnInit, AfterViewInit {
  @Input('placeholder') placeholderText: string = '';

  private labelEl!: HTMLLabelElement;
  private originalPlaceholder: string = '';
  private initialValue: string = '';
  public static readonly WRAPPER_CLASS = 'lib-field-wrapper';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const input = this.el.nativeElement;
    this.initialValue = input.value || '';
    this.originalPlaceholder = this.placeholderText || input.getAttribute('placeholder') || '';
  }

  ngAfterViewInit(): void {
    const input = this.el.nativeElement;

    // 👇 Create wrapper container
    const wrapper = this.renderer.createElement('div');
    this.renderer.addClass(wrapper, LibPlaceholderTitleDirective.WRAPPER_CLASS);
    this.renderer.setStyle(wrapper, 'position', 'relative');
    this.renderer.setStyle(wrapper, 'paddingBottom', '4px');
    this.renderer.setStyle(wrapper, 'width', '100%');
    this.renderer.setStyle(wrapper, 'display', 'flex');
    this.renderer.setStyle(wrapper, 'flexDirection', 'column');

    const parent = this.renderer.parentNode(input);
    this.renderer.insertBefore(parent, wrapper, input);
    this.renderer.removeChild(parent, input);
    this.renderer.appendChild(wrapper, input);

    // Create floating label
    this.labelEl = this.renderer.createElement('label');
    this.renderer.setStyle(this.labelEl, 'position', 'absolute');
    this.renderer.setStyle(this.labelEl, 'left', '12px');
    this.renderer.setStyle(this.labelEl, 'top', '-8px');
    this.renderer.setStyle(this.labelEl, 'fontSize', '0.8rem');
    this.renderer.setStyle(this.labelEl, 'color', '#A9A9A9');
    this.renderer.setStyle(this.labelEl, 'opacity', '0');
    this.renderer.setStyle(this.labelEl, 'transition', 'all 0.2s ease');
    this.renderer.setStyle(this.labelEl, 'pointerEvents', 'none');
    this.renderer.setProperty(this.labelEl, 'innerText', '');

    this.renderer.appendChild(wrapper, this.labelEl);

    if (this.initialValue) {
      this.setLabel(this.originalPlaceholder, true);
      this.setPlaceholder('');
    } else {
      this.setPlaceholder(this.originalPlaceholder);
    }
  }

  @HostListener('focus')
  onFocus(): void {
    this.setLabel(this.originalPlaceholder, true);
    this.setPlaceholder('');
  }

  @HostListener('blur')
  onBlur(): void {
    const input = this.el.nativeElement;
    if (!input.value) {
      this.setLabel('', false);
      this.setPlaceholder(this.originalPlaceholder);
    }
  }

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    if (input.value) {
      this.setLabel(this.originalPlaceholder, true);
      this.setPlaceholder('');
    } else {
      this.setLabel('', false);
      this.setPlaceholder(this.originalPlaceholder);
    }
  }

  private setPlaceholder(text: string): void {
    this.renderer.setAttribute(this.el.nativeElement, 'placeholder', text);
  }

  private setLabel(text: string, bold: boolean): void {
    this.renderer.setProperty(this.labelEl, 'innerText', text);
    this.renderer.setStyle(this.labelEl, 'opacity', text ? '1' : '0');
    // this.renderer.setStyle(this.labelEl, 'fontWeight', bold ? 'bold' : 'normal');
  }
}
