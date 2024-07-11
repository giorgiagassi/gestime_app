import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {StoricoRichiesteRoutingModule} from "./storico-richieste-routing.module";
import {StoricoRichiestePage} from "./storico-richieste.page";




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoricoRichiesteRoutingModule
  ],
  declarations: [StoricoRichiestePage]
})
export class StoricoRichiesteModule {}
