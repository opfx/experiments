import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { ContentComponent } from './content.component';

const routes: Route[] = [{ path: '', component: ContentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ContentModule {
  constructor() {
    console.log(`creating ContentModule`);
  }
}
