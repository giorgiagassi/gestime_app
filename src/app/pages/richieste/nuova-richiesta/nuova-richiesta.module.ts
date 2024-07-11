import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {NuovaRichiestaPage} from "./nuova-richiesta.page";
import {NuovaRichiestaRoutingModule} from "./nuova-richiesta-routing.module";





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuovaRichiestaRoutingModule
  ],
  declarations: [NuovaRichiestaPage]
})
export class NuovaRichiestaModule {}
