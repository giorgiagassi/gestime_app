import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StoricoRichiestePage} from "./storico-richieste.page";


const routes: Routes = [
  {
    path: '',
    component: StoricoRichiestePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoricoRichiesteRoutingModule {}
