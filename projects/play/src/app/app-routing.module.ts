import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CashCowModule, CashCowComponent } from '@webkinz/cash-cow';
import { ContentGuard } from './content';

const routes: Routes = [
  { path: '', redirectTo: 'content', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },

  {
    path: 'content',
    loadChildren: () => import('./content').then((m) => m.ContentModule),
    canLoad: [ContentGuard],
    canActivate: [ContentGuard],
  },

  { path: 'cash-cow', loadChildren: () => import('@webkinz/cash-cow').then((m) => m.CashCowModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
