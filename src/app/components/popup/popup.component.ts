import { Component, OnInit } from '@angular/core';
import { PopupService } from '../../services/shared/popup.service';
declare const bootstrap: any;
@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})

export class PopupComponent implements OnInit {
  constructor(private popupService: PopupService) {}

  ngOnInit(): void {
    this.popupService.openPopup$.subscribe(() => {
      const modalEl = document.getElementById('infoModal');
      console.log(modalEl)
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
        console.log('pop up is shown')
      }
    });
  }
}
