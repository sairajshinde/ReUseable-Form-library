import {
  AfterViewInit,
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  Optional,
  Self
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  NgControl
} from '@angular/forms';

@Directive({
  selector: '[libSingleSlashInput]',
  standalone: true
})
export class SingleSlashInputDirective implements AfterViewInit, OnInit {
  private controlName: string = '';
  private formGroup!: FormGroup;
  private leftName: string = '';
  private rightName: string = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private controlContainer: ControlContainer,
    @Optional() @Self() private ngControl: NgControl
  ) {}

  ngOnInit(): void {
    this.controlName = this.el.nativeElement.getAttribute('formControlName');
    if (!this.controlName || !this.controlContainer?.control) return;

    this.formGroup = this.controlContainer.control as FormGroup;
    this.leftName = `${this.controlName}_left`;
    this.rightName = `${this.controlName}_right`;

    // Add left & right controls if not already present
    if (!this.formGroup.contains(this.leftName)) {
      this.formGroup.addControl(this.leftName, new FormControl(''));
    }
    if (!this.formGroup.contains(this.rightName)) {
      this.formGroup.addControl(this.rightName, new FormControl(''));
    }

    // Add original if not exists
    if (!this.formGroup.contains(this.controlName)) {
      this.formGroup.addControl(this.controlName, new FormControl(''));
    }

    // Combine logic
    this.formGroup.get(this.leftName)?.valueChanges.subscribe(() => this.updateMainValue());
    this.formGroup.get(this.rightName)?.valueChanges.subscribe(() => this.updateMainValue());

    // If form prefilled
    const originalVal = this.formGroup.get(this.controlName)?.value;
    if (originalVal?.includes?.('/')) {
      const [left, right] = originalVal.split('/');
      this.formGroup.get(this.leftName)?.setValue(left);
      this.formGroup.get(this.rightName)?.setValue(right);
    }
  }

  ngAfterViewInit(): void {
    const originalInput = this.el.nativeElement;
    const parent = originalInput.parentNode;

    // Wrapper
    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'display', 'flex');
    this.renderer.setStyle(wrapper, 'alignItems', 'center');
    this.renderer.setStyle(wrapper, 'gap', '6px');
    this.renderer.setStyle(wrapper, 'width', '100%');
    this.renderer.setStyle(wrapper, 'lineHeight', '1.5');

    // Left Input
    const input1 = this.renderer.createElement('input');
    this.copyAttributes(originalInput, input1);
    this.renderer.setAttribute(input1, 'formControlName', this.leftName);
    this.applyInputStyles(input1);
    this.applyNumberOnlyLogic(input1);

    // Slash separator
    const slash = this.renderer.createElement('span');
    this.renderer.setProperty(slash, 'innerText', '/');
    this.renderer.setStyle(slash, 'fontSize', '1.2rem');
    this.renderer.setStyle(slash, 'margin', '0 2px');

    // Right Input
    const input2 = this.renderer.createElement('input');
    this.copyAttributes(originalInput, input2);
    this.renderer.setAttribute(input2, 'formControlName', this.rightName);
    this.applyInputStyles(input2);
    this.applyNumberOnlyLogic(input2);

    // Compose UI
    this.renderer.appendChild(wrapper, input1);
    this.renderer.appendChild(wrapper, slash);
    this.renderer.appendChild(wrapper, input2);

    // Replace original input with wrapper
    this.renderer.insertBefore(parent, wrapper, originalInput);
    this.renderer.removeChild(parent, originalInput);
  }

  private copyAttributes(source: HTMLInputElement, target: HTMLInputElement): void {
    const attrs = source.attributes;
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs.item(i);
      if (
        attr?.name !== 'formControlName' &&
        attr?.name !== 'libSingleSlashInput'
      ) {
        this.renderer.setAttribute(target, attr!.name, attr!.value);
      }
    }
  }

  private applyInputStyles(input: HTMLInputElement): void {
    this.renderer.setStyle(input, 'border', 'none');
    this.renderer.setStyle(input, 'borderBottom', '2px solid #ccc');
    this.renderer.setStyle(input, 'padding', '4px 6px');
    this.renderer.setStyle(input, 'width', '100%');
    this.renderer.setStyle(input, 'maxWidth', '100px');
    this.renderer.setStyle(input, 'textAlign', 'center');
    this.renderer.setStyle(input, 'outline', 'none');
    this.renderer.setStyle(input, 'verticalAlign', 'middle');
    this.renderer.setStyle(input, 'lineHeight', '1.5');
    this.renderer.setStyle(input, 'height', '22px');

    this.renderer.listen(input, 'focus', () => {
      this.renderer.setStyle(input, 'borderBottom', '2px solid #1976d2');
    });
    this.renderer.listen(input, 'blur', () => {
      this.renderer.setStyle(input, 'borderBottom', '2px solid #ccc');
    });
  }

  private applyNumberOnlyLogic(input: HTMLInputElement): void {
    this.renderer.listen(input, 'keydown', (event: KeyboardEvent) => {
      const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
      if (
        allowed.includes(event.key) ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
      }
    });

    this.renderer.listen(input, 'paste', (event: ClipboardEvent) => {
      const data = event.clipboardData?.getData('text') || '';
      if (!/^\d+$/.test(data)) {
        event.preventDefault();
      }
    });
  }

  private updateMainValue(): void {
    const left = this.formGroup.get(this.leftName)?.value;
    const right = this.formGroup.get(this.rightName)?.value;
    const combined = left && right ? `${left}/${right}` : '';
    this.formGroup.get(this.controlName)?.setValue(combined, { emitEvent: true });
  }
}
