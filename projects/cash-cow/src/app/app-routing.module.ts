import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'cash-cow', pathMatch: 'full' },
  { path: 'cash-cow', loadChildren: () => import('./../lib/cash-cow.module').then((m) => m.CashCowModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
