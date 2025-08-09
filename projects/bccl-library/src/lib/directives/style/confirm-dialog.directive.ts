import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';

interface DialogData {
  title?: string;
  message?: string;
  buttons?: string[];
}

@Directive({
  selector: '[libConfirmDialog]',
  standalone: true
})
export class ConfirmDialogueDirective implements OnInit {
  @Input('libConfirmDialog') dialogData!: DialogData;
  @Output() closed = new EventEmitter<string>(); // emit which button clicked

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.dialogData) {
      this.createDialog(this.dialogData);
    }
  }

  createDialog({ title ='', message = '', buttons }: DialogData) {
    // Overlay
    const overlay = this.renderer.createElement('div');
    this.renderer.setStyle(overlay, 'position', 'fixed');
    this.renderer.setStyle(overlay, 'top', '0');
    this.renderer.setStyle(overlay, 'left', '0');
    this.renderer.setStyle(overlay, 'width', '100%');
    this.renderer.setStyle(overlay, 'height', '100%');
    this.renderer.setStyle(overlay, 'background', 'rgba(0,0,0,0.4)');
    this.renderer.setStyle(overlay, 'display', 'flex');
    this.renderer.setStyle(overlay, 'alignItems', 'center');
    this.renderer.setStyle(overlay, 'justifyContent', 'center');
    this.renderer.setStyle(overlay, 'zIndex', '9999');

    // Dialog
    const dialog = this.renderer.createElement('div');
    this.renderer.setStyle(dialog, 'background', '#fff');
    this.renderer.setStyle(dialog, 'borderRadius', '8px');
    this.renderer.setStyle(dialog, 'width', '350px');
    this.renderer.setStyle(dialog, 'padding', '16px');
    this.renderer.setStyle(dialog, 'display', 'flex');
    this.renderer.setStyle(dialog, 'flexDirection', 'column');
    this.renderer.setStyle(dialog, 'alignItems', 'center');
    this.renderer.setStyle(dialog, 'textAlign', 'center');

    // Title Row
    const titleRow = this.renderer.createElement('div');
    this.renderer.setStyle(titleRow, 'display', 'flex');
    this.renderer.setStyle(titleRow, 'justifyContent', 'space-between');
    this.renderer.setStyle(titleRow, 'alignItems', 'center');
    this.renderer.setStyle(titleRow, 'width', '100%');

    const titleEl = this.renderer.createElement('h3');
    const titleText = this.renderer.createText(title);
    this.renderer.setStyle(titleEl, 'margin', '0 auto');
    this.renderer.setStyle(titleEl, 'fontWeight', '600');
    this.renderer.setStyle(titleEl, 'fontSize', '18px');
    this.renderer.appendChild(titleEl, titleText);

    const closeBtn = this.renderer.createElement('span');
    const closeText = this.renderer.createText('×');
    this.renderer.setStyle(closeBtn, 'cursor', 'pointer');
    this.renderer.setStyle(closeBtn, 'fontSize', '20px');
    this.renderer.appendChild(closeBtn, closeText);

    this.renderer.listen(closeBtn, 'click', () => {
      this.renderer.removeChild(document.body, overlay);
      this.closed.emit('close');
    });

    this.renderer.appendChild(titleRow, titleEl);
    this.renderer.appendChild(titleRow, closeBtn);

    // Message
    const messageEl = this.renderer.createElement('p');
    const messageText = this.renderer.createText(message);
    this.renderer.setStyle(messageEl, 'margin', '12px 0');
    this.renderer.appendChild(messageEl, messageText);

    // Buttons
    const btnContainer = this.renderer.createElement('div');
    this.renderer.setStyle(btnContainer, 'display', 'flex');
    this.renderer.setStyle(btnContainer, 'justifyContent', 'center');
    this.renderer.setStyle(btnContainer, 'gap', '8px');
    this.renderer.setStyle(btnContainer, 'marginTop', '10px');

    buttons?.forEach(btn => {
      const buttonEl = this.renderer.createElement('button');
      const btnText = this.renderer.createText(btn);
      this.renderer.setStyle(buttonEl, 'padding', '6px 12px');
      this.renderer.setStyle(buttonEl, 'border', 'none');
      this.renderer.setStyle(buttonEl, 'borderRadius', '4px');
      this.renderer.setStyle(buttonEl, 'cursor', 'pointer');
      this.renderer.setStyle(buttonEl, 'background', '#00BFFF');
      this.renderer.setStyle(buttonEl, 'color', '#fff');
      this.renderer.listen(buttonEl, 'click', () => {
        this.closed.emit(btn);
        this.renderer.removeChild(document.body, overlay);
      });
      this.renderer.appendChild(buttonEl, btnText);
      this.renderer.appendChild(btnContainer, buttonEl);
    });

    // Assemble
    this.renderer.appendChild(dialog, titleRow);
    this.renderer.appendChild(dialog, messageEl);
    this.renderer.appendChild(dialog, btnContainer);
    this.renderer.appendChild(overlay, dialog);

    // Append to DOM
    this.renderer.appendChild(document.body, overlay);
  }
}
