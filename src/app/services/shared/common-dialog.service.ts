import { Injectable, ViewContainerRef, ComponentRef } from '@angular/core';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CommonDialogService {
  private vcr!: ViewContainerRef;

  setViewContainerRef(vcr: ViewContainerRef) {
    this.vcr = vcr;
  }

  confirm(message: string, title = 'Confirm'): Promise<boolean> {
    return new Promise(resolve => {
      const cmpRef: ComponentRef<ConfirmDialogComponent> = this.vcr.createComponent(ConfirmDialogComponent);
      cmpRef.instance.message = message;
      cmpRef.instance.title = title;
      cmpRef.instance.type = 'confirm';
      cmpRef.instance.closed.subscribe(result => {
        cmpRef.destroy();
        resolve(result === 'ok');
      });
    });
  }

  alert(message: string, title = 'ALERT'): Promise<void> {
    return new Promise(resolve => {
      const cmpRef: ComponentRef<ConfirmDialogComponent> = this.vcr.createComponent(ConfirmDialogComponent);
      cmpRef.instance.message = message;
      cmpRef.instance.title = title;
      cmpRef.instance.type = 'alert';
      cmpRef.instance.closed.subscribe(() => {
        cmpRef.destroy();
        resolve();
      });
    });
  }
}
