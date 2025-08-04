import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { UiDirectivesModule } from '../../../../projects/bccl-library/src/public-api';
import { getSharedMenu , setPopupService , MenuItem } from '../../services/shared/menu.config';
import { PopupService } from '../../services/shared/popup.service';

@Component({
  selector: 'app-toi-education',
  standalone: true,
  imports: [UiDirectivesModule, RouterOutlet, RouterModule],
  templateUrl: './toi-education.component.html',
  styleUrl: './toi-education.component.scss'
})
export class ToiEducationComponent implements OnInit{
  menu: MenuItem[] = []; // ✅ Declare proper type here

  constructor(private popupService: PopupService) {}

  ngOnInit(): void {
    setPopupService(this.popupService);
    this.menu = getSharedMenu(); // ✅ Now TypeScript understands the types
  }
}

