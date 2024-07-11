import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BackButtonService {
  constructor(private platform: Platform, private location: Location) {
    this.initializeBackButtonCustomHandler();
  }

  private initializeBackButtonCustomHandler(): void {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.handleBackButton();
    });
  }

  private handleBackButton(): void {
    this.location.back();
  }
}
