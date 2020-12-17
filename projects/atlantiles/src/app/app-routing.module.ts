import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'atlantiles', pathMatch: 'full' },
  { path: 'atlantiles', loadChildren: () => import('./../lib/atlantiles.module').then((m) => m.AtlantilesModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
