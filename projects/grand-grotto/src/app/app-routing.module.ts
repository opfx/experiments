import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'grand-grotto', pathMatch: 'full' },
  { path: 'grand-grotto', loadChildren: () => import('./../lib/grand-grotto.module').then((m) => m.GrandGrottoModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
