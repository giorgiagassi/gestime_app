import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {AlertService} from "../../providers/alert.service";
import {LoginService} from "../../providers/login.service";
import {LoadingService} from "../../providers/loading.service";
import {StoricoTimbratureService} from "../../providers/storico-timbrature.service";
import {Storage} from "@capacitor/storage";



@Component({
  selector: 'app-storico-timbrature',
  templateUrl: './storico-timbrature.page.html',
  styleUrls: ['./storico-timbrature.page.scss'],
})
export class StoricoTimbraturePage implements OnInit {
  user: any;
  richieste: any;
  selectedYear!: number;
  availableYears: number[] = [];
  availableMonth: number[] = [];
  selectedMonth!: number;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private loginService: LoginService,
    private loadingService: LoadingService,
    private richiesteService: StoricoTimbratureService,
  ) {}
  async ngOnInit() {
    this.initializeYearsAndMonth();
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
  initializeYearsAndMonth() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    this.selectedMonth = currentDate.getMonth() + 1; // Mese corrente (1-based)
    this.availableMonth = Array.from({ length: 12 }, (_, i) => i + 1); // Mesi da 1 a 12
    for (let i = currentYear; i >= currentYear - 10; i--) {
      this.availableYears.push(i);
    }
    this.selectedYear = currentYear;
  }


  async loadStoricoRichieste(): Promise<void> {
    await this.loadingService.presentLoading('Caricamento...');
    this.richiesteService.getStorico(this.user.id, this.selectedYear,  this.selectedMonth).subscribe(
      (data) => {
        this.richieste = data;
        this.loadingService.dismissLoading();
        console.log(data);
      },
      (error) => {
        console.error('Error loading storico richieste:', error);
        this.loadingService.dismissLoading();
        this.alertService.presentErrorAlert('Impossibile caricare le richieste.');
      }
    );
  }
  async doRefresh(event: any) {
    await this.loadStoricoRichieste();
    event.target.complete();
  }
  async onFilterChange() {
    await this.loadStoricoRichieste();
  }


}
