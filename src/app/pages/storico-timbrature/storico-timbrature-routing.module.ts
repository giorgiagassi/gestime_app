import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StoricoTimbraturePage} from "./storico-timbrature.page";




const routes: Routes = [
  {
    path: '',
   component: StoricoTimbraturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoricoTimbratureRoutingModule {}
