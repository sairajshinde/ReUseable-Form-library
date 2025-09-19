import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .custom-modal .modal-header,
    .custom-modal .modal-body,
    .custom-modal .modal-footer {
      border: none !important;
    }

    .custom-modal .modal-title {
      width: 100%;
      text-align: center;
      font-weight: bold;
    }

    .custom-modal .modal-body {
      text-align: center;
      font-size: 1.1rem;
    }

    .custom-modal .modal-footer {
      display: flex;
      justify-content: center;
      gap: 10px;
    }

    .custom-modal .btn-custom {
      background-color: rgb(0, 191, 255);
      border: none;
      color: white;
      width: 80px;
    }

    .custom-modal .btn-custom:hover {
      background-color: rgb(0, 160, 210);
    }
  `],
  template: `
    <div class="modal fade show custom-modal" tabindex="-1" style="display:block;" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" (click)="close('cancel')"></button>
          </div>
          <div class="modal-body">
            <p class="mb-1">{{ message }}</p>
          </div>
          <div class="modal-footer mb-3">
            
            <button type="button" class="btn btn-custom" (click)="close('ok')">
              OK
            </button>
            <button *ngIf="type === 'confirm'" type="button" class="btn btn-custom" (click)="close('cancel')">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  `
})
export class ConfirmDialogComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'alert' | 'confirm' = 'alert';
  @Output() closed = new EventEmitter<string>();

  close(result: string) {
    this.closed.emit(result);
  }
}
