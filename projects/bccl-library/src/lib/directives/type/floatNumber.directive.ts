import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[libFloatNumber]',
  standalone: true
})
export class FloatNumberDirective {

  @Input('libFloatNumber') digitLimits: [number, number] = [2, 2]; // 🟩 Default: 2 before, 2 after

  constructor() {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const key = event.key;

    const [beforeLimit, afterLimit] = this.digitLimits;
    const isNumber = /^[0-9]$/.test(key);
    const isDot = key === '.';
    const hasDot = currentValue.includes('.');
    const [beforeDecimal = '', afterDecimal = ''] = currentValue.split('.');

    // 🟢 Allow navigation and shortcuts
    if (allowedKeys.includes(key) || event.ctrlKey || event.metaKey) return;

    // 🔴 Only one dot allowed, not at the start
    if (isDot) {
      if (hasDot || currentValue.length === 0) {
        event.preventDefault();
      }
      return;
    }

    // 🔴 Block anything that’s not number or dot
    if (!isNumber) {
      event.preventDefault();
      return;
    }

    // 🟡 Enforce digit limits
    if (!hasDot) {
      if (beforeDecimal.length >= beforeLimit) {
        event.preventDefault();
      }
    } else {
      if (input.selectionStart! > currentValue.indexOf('.')) {
        if (afterDecimal.length >= afterLimit) {
          event.preventDefault();
        }
      } else {
        if (beforeDecimal.length >= beforeLimit) {
          event.preventDefault();
        }
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';
    const [beforeLimit, afterLimit] = this.digitLimits;

    if (!/^\d*\.?\d*$/.test(pasted)) {
      event.preventDefault();
      return;
    }

    const [before = '', after = ''] = pasted.split('.');
    if (before.length > beforeLimit || after.length > afterLimit) {
      event.preventDefault();
    }
  }
}
 