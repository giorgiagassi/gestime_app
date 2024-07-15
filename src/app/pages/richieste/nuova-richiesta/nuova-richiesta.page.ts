import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { BackButtonService } from "../../../providers/backbutton.service";
import { RichiesteService } from "../../../providers/richieste.service";
import { Storage } from "@capacitor/storage";
import { LoginService } from "../../../providers/login.service";
import { AlertService } from "../../../providers/alert.service";

@Component({
  selector: 'app-nuova-richiesta',
  templateUrl: './nuova-richiesta.page.html',
  styleUrls: ['./nuova-richiesta.page.scss'],
})
export class NuovaRichiestaPage implements OnInit {

  causalizzazioni: any;
  user: any;
  richiesta: any = {
    tipoIns: '',
    daData: '',
    aData: '',
    giornoIntero: '',
    numOreGG: null,
    causalizzazione: '',
    note: ''
  };
  timbratura: any = {
    note: null,
    noteSelect: '',
    daData: '',
    aData: '',
    tipoIns: 'Timbratura',
    giornoIntero: 'SI',
    numOreGG: '',
    ggDiCalendario: null,
    causalizzazione: 'TIMBRATURA',
  };

  constructor(private router: Router,
              private backButtonService: BackButtonService,
              private richiesteService: RichiesteService,
              private loginService: LoginService,
              private alertService: AlertService) { }

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
      await this.getCaus();
    }
  }

  async doRefresh(event: any) {
    event.target.complete();
  }

  getCaus(): void {
    this.richiesteService.getCausalizzazioni().subscribe(value => {
      this.causalizzazioni = value;
      console.log('causa', this.causalizzazioni);
    });
  }

  onTipoInsChange() {
    if (this.richiesta.tipoIns === 'Timbratura') {
      this.richiesta.giornoIntero = 'SI';
      this.richiesta.numOreGG = '';
      this.richiesta.causalizzazione = 'TIMBRATURA';
      this.timbratura.noteSelect = 'Entrata';
    } else {
      this.richiesta.numOreGG = null;
      this.richiesta.causalizzazione = '';
    }
  }

  syncDates() {
    if (this.richiesta.tipoIns === 'Timbratura') {
      this.richiesta.aData = this.richiesta.daData;
    }
  }

  async inviaRichiesta() {
    const userId = this.user.id;
    const body = {
      ...this.richiesta,
      applicationUserID: userId,
      statoRichiesta: 'Da Approvare'
    };

    if (this.richiesta.tipoIns === 'Timbratura') {
      body.aData = this.richiesta.daData; // Ensure aData is same as daData for Timbratura
      body.noteSelect = this.timbratura.noteSelect; // Include noteSelect in the body
    }

    this.richiesteService.inviaRichiesta(userId, body).subscribe({
      next: async (response) => {
        console.log('Response:', response);
        await this.alertService.presentSuccessAlert('Richiesta Inviata con successo');
        this.router.navigate(['/richieste']);
      },
      error: async (error) => {
        console.error('Error:', error);
        await this.alertService.presentErrorAlert('Errore Durante l\'invio della richiesta');
      }
    });
  }

}
