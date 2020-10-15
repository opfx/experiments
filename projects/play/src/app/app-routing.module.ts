import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CashCowModule, CashCowComponent } from '@webkinz/cash-cow';

const routes: Routes = [
  { path: 'cash-cow', loadChildren: () => import('@webkinz/cash-cow').then((m) => m.CashCowModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
