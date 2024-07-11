import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { LoginService } from './providers/login.service';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertService } from './providers/alert.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private alertService: AlertService, // Usa il servizio
    private loginService: LoginService,
    private platform: Platform,
    private router: Router,
    private location: Location,
  ) {
    this.initializeApp();
  }

  async ngOnInit() {

    try {
      await this.checkLocationPermissions();
      await this.requestNotificationPermissions();
      this.scheduleNotifications();
      await this.loginService.checkAuthenticationStatus(); // Ensure this completes before navigating

      if (this.loginService.isAuthenticated()) {
        const userId = this.loginService.user().id; // Prendi l'ID dell'utente
        this.loginService.getuserData(userId).subscribe(
          userData => {
            this.loginService.setUser(userData); // Aggiorna i dati dell'utente nel servizio
            this.router.navigate(['/timbra-new']);
          },
          error => {
            console.error('Error fetching user data:', error);
            this.router.navigate(['/home']);
          }
        );
      } else {
        this.router.navigate(['/home']);
      }
      // Listen for notification events
      LocalNotifications.addListener('localNotificationReceived', (notification: LocalNotificationSchema) => {
        // Effettua un cast dell'oggetto notification al tipo CustomNotification
      });

    } catch (error) {
      console.error(error);
    }
  }

  private async requestNotificationPermissions() {
    const result = await LocalNotifications.requestPermissions();
    if (result.display !== 'granted') {
      await this.alertService.presentErrorAlert('È necessario concedere il permesso per le notifiche per utilizzare l\'applicazione correttamente.');
    }
  }

  async scheduleNotifications() {
    const notifications = [

      { id: 1, title: 'Promemoria', body: 'Ricordati di timbrare la pausa', hour: 14, minute: 35 },
      { id: 2, title: 'Promemoria', body: 'C N\' AMMA IJ', hour: 17, minute: 45 },

    ];

    const now = new Date();

    const notificationsToSchedule = notifications.map(notification => {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), notification.hour, notification.minute, 0);
      if (date > now) {
        return {
          id: notification.id,
          title: notification.title,
          body: notification.body,
          schedule: { at: date },
          sound: undefined,
          attachments: undefined,
          actionTypeId: "",
          extra: null,
          smallIcon: 'res://splash'
        };
      } else {
        return null;
      }
    }).filter(n => n !== null) as LocalNotificationSchema[];

    console.log('Notifiche da schedulare:', notificationsToSchedule);

    await LocalNotifications.schedule({
      notifications: notificationsToSchedule
    });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.handleBackButton();
      });
    });
  }

  private handleBackButton() {
    // Ottieni l'URL corrente
    const currentUrl = this.router.url;

    if (currentUrl === '/home') {
      // Chiudi l'app se siamo sulla homepage
      App.exitApp();
    } else {
      // Usa il metodo `back` di Location per navigare indietro
      this.location.back();
    }
  }

  private async checkLocationPermissions() {

    try {
      let permissions = await Geolocation.checkPermissions();
      while (permissions.location !== 'granted') {
        await this.alertService.presentErrorAlert("L'app ha bisogno della geolocalizzazione per funzionare.");
        await Geolocation.requestPermissions();
        permissions = await Geolocation.checkPermissions();
        if (permissions.location === 'granted') {
          try {
            await Geolocation.getCurrentPosition();
            break;
          } catch (e) {
            await this.alertService.presentErrorAlert('Il servizio di geolocalizzazione non è attivo. Per favore, attiva la geolocalizzazione per continuare.');
            break;
          }
        }
      }
      if (permissions.location !== 'granted') {
        await this.alertService.presentErrorAlert("Permessi di geolocalizzazione non concessi. L'app non può funzionare correttamente.");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
