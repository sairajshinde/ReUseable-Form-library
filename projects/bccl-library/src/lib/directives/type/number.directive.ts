import { Directive, HostListener, Input } from '@angular/core';
 
@Directive({
  selector: '[libNumber]',
  standalone: true
})
export class NumberDirective {
 
  @Input('libNumber') digitLimits: [number, number] = [4, 0]; // Default: 4 digits, no decimal
 
  constructor() {}
 
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'
    ];
 
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const key = event.key;
 
    const [beforeLimit, afterLimit] = this.digitLimits;
 
    if (
      allowedKeys.includes(key) ||
      event.ctrlKey || event.metaKey
    ) {
      return;
    }
 
    const isNumber = /^[0-9]$/.test(key);
    const isDot = key === '.';
    const hasDot = currentValue.includes('.');
    const [beforeDecimal, afterDecimal] = currentValue.split('.');
 
    if (isDot) {
      // Only one dot allowed and not at first position
      if (hasDot || currentValue.length === 0) {
        event.preventDefault();
      }
      return;
    }
 
    if (!isNumber) {
      event.preventDefault();
      return;
    }
 
    if (!hasDot) {
      if ((beforeDecimal || '').length >= beforeLimit) {
        event.preventDefault();
      }
    } else {
      if (currentValue.indexOf('.') < input.selectionStart!) {
        if ((afterDecimal || '').length >= afterLimit) {
          event.preventDefault();
        }
      } else {
        if ((beforeDecimal || '').length >= beforeLimit) {
          event.preventDefault();
        }
      }
    }
  }
 
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text') || '';
    const [beforeLimit, afterLimit] = this.digitLimits;
 
    // Validate numeric and decimal format
    if (!/^\d*\.?\d*$/.test(pastedText)) {
      event.preventDefault();
      return;
    }
 
    const [before, after] = pastedText.split('.');
    if ((before?.length || 0) > beforeLimit || (after?.length || 0) > afterLimit) {
      event.preventDefault();
    }
  }
}