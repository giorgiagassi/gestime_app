import {Component, OnInit} from '@angular/core';
import {Storage} from "@capacitor/storage";
import {interval} from "rxjs";
import {AlertService} from "../providers/alert.service";
import {Router} from "@angular/router";
import {TimbraService} from "../providers/timbra.service";
import {LoadingService} from "../providers/loading.service";
import {LoginService} from "../providers/login.service";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit{
  user: any;
  constructor(
    private alertService: AlertService, // Usa il servizio
    private router: Router,
    private loginService: LoginService,
  ) { }

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state['User']) {
      this.user = navigation.extras.state['User'];
      console.log('User data loaded from navigation:', this.user);
    } else {
      const userId = localStorage.getItem('User') || sessionStorage.getItem('User');
      if (userId) {
        try {
          const userData = await this.loginService.getuserData(userId).toPromise();
          this.user = userData;
          console.log('User data loaded from API:', this.user);

        } catch (error) {
          console.error('Failed to load user data from API:', error);
          await this.alertService.presentErrorAlert('Impossibile caricare i dati utente.');
        }
      } else {
        const {value} = await Storage.get({key: 'userId'});
        if (value) {
          try {
            this.user = await this.loginService.getuserData(value).toPromise();
            console.log('User data loaded from API:', this.user);
          } catch (error) {
            console.error('Failed to load user data from API:', error);
            await this.alertService.presentErrorAlert('Impossibile caricare i dati utente.');
          }
        } else {
          console.error('Failed to load user ID');
          await this.alertService.presentErrorAlert('Impossibile caricare i dati utente.');
        }
      }
    }
  }
}
