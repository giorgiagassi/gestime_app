import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NuovaRichiestaPage} from "./nuova-richiesta.page";



const routes: Routes = [
  {
    path: '',
    component: NuovaRichiestaPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NuovaRichiestaRoutingModule {}
