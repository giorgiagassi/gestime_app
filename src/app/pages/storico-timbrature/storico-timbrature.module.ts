import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StoricoTimbraturePage} from "./storico-timbrature.page";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {StoricoTimbratureRoutingModule} from "./storico-timbrature-routing.module";



@NgModule({
  declarations: [StoricoTimbraturePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
      StoricoTimbratureRoutingModule
  ]
})
export class StoricoTimbratureModule { }
