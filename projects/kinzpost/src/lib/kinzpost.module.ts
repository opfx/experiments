import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { KinzpostActivity } from './kinzpost.activity';

import { RuntimeModule } from '@webkinz/runtime';

const routes: Route[] = [{ path: '', component: KinzpostActivity }];

@NgModule({
  declarations: [KinzpostActivity],
  imports: [RuntimeModule, RouterModule.forChild(routes)],
  exports: [KinzpostActivity],
})
export class KinzpostModule {}
