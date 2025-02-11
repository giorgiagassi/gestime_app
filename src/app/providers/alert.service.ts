import { Injectable } from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';
import {Haptics, ImpactStyle} from "@capacitor/haptics";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastController: ToastController) {}

  async presentSuccessAlert(message: string) {
    await Haptics.impact({ style: ImpactStyle.Light });
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'success', // ✅ Verde per il successo
      position: 'top',
      icon: 'checkmark-circle-outline'
    });
    toast.present();
  }

  async presentErrorAlert(message: string) {
    await Haptics.vibrate();
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'danger', // ❌ Rosso per l'errore
      position: 'top',
      icon: 'close-circle-outline'
    });
    toast.present();
  }

  async presentConfirmAlert(header: string, message: string): Promise<boolean> {
    await Haptics.impact({ style: ImpactStyle.Medium });
    return new Promise(async (resolve) => {
      const alert = await this.toastController.create({
        header: header,
        message: message,
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Sì',
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }
}
