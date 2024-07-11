import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../../providers/alert.service';
import { LoadingService } from '../../../providers/loading.service';
import { LoginService } from '../../../providers/login.service';
import { RichiesteService } from '../../../providers/richieste.service';
import { Storage } from '@capacitor/storage';
import {BackButtonService} from "../../../providers/backbutton.service";


@Component({
  selector: 'app-storico-richieste',
  templateUrl: './storico-richieste.page.html',
  styleUrls: ['./storico-richieste.page.scss'],
})
export class StoricoRichiestePage implements OnInit {
  user: any;
  richieste: any[] = [];
  selectedYear!: number;
  availableYears: number[] = [];

  constructor(
    private alertService: AlertService,
    private router: Router,
    private loginService: LoginService,
    private loadingService: LoadingService,
    private richiesteService: RichiesteService,
    private backButtonService: BackButtonService // Inietta il servizio
  ) {}

  async ngOnInit() {
    this.initializeYears();
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
        const { value } = await Storage.get({ key: 'userId' });
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

    if (this.user) {
      await this.loadStoricoRichieste();
    }
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 10; i--) {
      this.availableYears.push(i);
    }
    this.selectedYear = currentYear;
  }

  async doRefresh(event: any) {
    await this.loadStoricoRichieste();
    event.target.complete();
  }

  async onYearChange() {
    await this.loadStoricoRichieste();
  }

  async loadStoricoRichieste(): Promise<void> {
    await this.loadingService.presentLoading('Caricamento...');
    this.richiesteService.getStorico(this.user.id, this.selectedYear).subscribe(
      (data) => {
        this.richieste = data;
        this.loadingService.dismissLoading();
      },
      (error) => {
        console.error('Error loading storico richieste:', error);
        this.loadingService.dismissLoading();
        this.alertService.presentErrorAlert('Impossibile caricare le richieste.');
      }
    );
  }

  navigateToNuovaRichiesta(): void {
    this.router.navigate(['/nuova-richiesta']);
  }
}
