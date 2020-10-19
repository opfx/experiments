import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { KinzpostComponent } from './kinzpost.component';

import { RuntimeModule } from '@webkinz/runtime';

const routes: Route[] = [{ path: '', component: KinzpostComponent }];

@NgModule({
  declarations: [KinzpostComponent],
  imports: [RuntimeModule, RouterModule.forChild(routes)],
  exports: [KinzpostComponent],
})
export class KinzpostModule {}
