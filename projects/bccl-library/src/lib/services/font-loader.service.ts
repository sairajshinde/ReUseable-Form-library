import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root' // makes it available app-wide
})
export class FontLoaderService {
  private document = inject(DOCUMENT);

  constructor() {
    this.loadOpenSans();
  }

  private loadOpenSans() {
    const id = 'lib-font-opensans';
    if (!this.document.getElementById(id)) {
      const link = this.document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap';
      this.document.head.appendChild(link);
    }
  }
}
 