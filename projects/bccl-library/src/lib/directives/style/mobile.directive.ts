import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[libMobile]',
  standalone: true
})
export class MobileDirective implements OnInit {
  @Input('maxlength') maxLength: number = 10;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.setAttribute(this.el.nativeElement, 'maxlength', this.maxLength.toString());
    this.renderer.setAttribute(this.el.nativeElement, 'inputmode', 'numeric');
    this.renderer.setAttribute(this.el.nativeElement, 'pattern', '[0-9]*');
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, this.maxLength);
  }
}
 