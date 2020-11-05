import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { RuntimeModule } from '@webkinz/runtime';

import { ArcadeActivity } from './arcade.activity';

const routes: Route[] = [{ path: '', component: ArcadeActivity }];
@NgModule({
  imports: [RuntimeModule, RouterModule.forChild(routes)],
  declarations: [ArcadeActivity],

  exports: [ArcadeActivity],
})
export class ArcadeModule {}
