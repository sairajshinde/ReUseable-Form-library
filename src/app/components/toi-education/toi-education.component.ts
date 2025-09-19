import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { UiDirectivesModule } from '../../../../projects/bccl-library/src/public-api';
import { getSharedMenu , setPopupService , MenuItem , initMenu, setProcessorRole} from '../../services/shared/menu.config';
import { PopupService } from '../../services/shared/popup.service';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/shared/common.service';


@Component({
  selector: 'app-toi-education',
  standalone: true,
  imports: [UiDirectivesModule, RouterOutlet, RouterModule],
  templateUrl: './toi-education.component.html',
  styleUrl: './toi-education.component.scss'
})
export class ToiEducationComponent implements OnInit{
  menu: MenuItem[] = []; // ✅ Declare proper type here

  constructor(private popupService: PopupService, private api: ApiService, private common: CommonService) { initMenu(common);}

  ngOnInit(): void {
  this.checkRole()
  initMenu(this.common);
  setPopupService(this.popupService);
  this.menu = getSharedMenu();
  }


isProcessor = false;

checkRole(): void {
  this.api.checklist().subscribe({
    next: (res) => {
      console.log('res', res);
      const values: string[] = res[0]?.data?.flat() || [];
      this.isProcessor = values.includes("2");

      console.log('values:', values);
      this.common.setProcessorRole(this.isProcessor);

      setProcessorRole(this.isProcessor)

      this.menu = getSharedMenu();

      
    },
    error: (err) => {
      console.error('checkRole error:', err);
      this.isProcessor = false;

      this.common.setProcessorRole(false);
      setProcessorRole(false);

      // fallback menu
      this.menu = getSharedMenu();
    }
  });
}


}

