import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {MainLayoutComponent} from "./main-layout/main-layout.component";


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'timbra-new',
        loadChildren: () => import('./pages/timbra-new/timbra-new.module').then(m => m.TimbraNewPageModule)
      },
      {
        path: 'richieste',
        loadChildren: () => import('./pages/richieste/storico-richieste/storico-richieste.module').then(m => m.StoricoRichiesteModule)
      },
      {path:'nuova-richiesta',
      loadChildren: () => import('./pages/richieste/nuova-richiesta/nuova-richiesta.module').then(m => m.NuovaRichiestaModule)}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
