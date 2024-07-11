


import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {BackButtonService} from "../../../providers/backbutton.service";
import {RichiesteService} from "../../../providers/richieste.service";
import {Storage} from "@capacitor/storage";
import {LoginService} from "../../../providers/login.service";
import {AlertService} from "../../../providers/alert.service";

@Component({
  selector: 'app-nuova-richiesta',
  templateUrl: './nuova-richiesta.page.html',
  styleUrls: ['./nuova-richiesta.page.scss'],
})
export class NuovaRichiestaPage implements OnInit {

causalizzazioni:any;
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
  constructor( private router:Router,
               private backButtonService: BackButtonService,
               private richiesteService: RichiesteService,
               private loginService: LoginService,
               private alertService: AlertService,
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

getCaus():void {
    this.richiesteService.getCausalizzazioni().subscribe( value => {
      this.causalizzazioni = value;
      console.log('causa', this.causalizzazioni)
    })
}
  async inviaRichiesta() {
    const userId = this.user.id; // Sostituisci con il metodo per ottenere l'ID utente
    const body = {
      ...this.richiesta,
      applicationUserID: userId,
      statoRichiesta: 'Da Approvare'
    };

    this.richiesteService.inviaRichiesta(userId, body).subscribe(
      async (response) => {
        console.log('Response:', response);
        await this.alertService.presentSuccessAlert('Richiesta Inviata con successo');
        this.router.navigate(['/richieste']); // Reindirizza l'utente alla pagina home o a un'altra pagina
      },
      async (error) => {
        console.error('Error:', error);
        await this.alertService.presentErrorAlert('Errore Durante l\'invio della richiesta');
      }
    );
  }

}
