import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { HomeComponent } from './home.component';

const routes: Route[] = [{ path: '', component: HomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class HomeModule {
  constructor() {
    console.log(`creating ContentModule`);
  }
}
