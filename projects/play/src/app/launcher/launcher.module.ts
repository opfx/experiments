import { NgModule } from '@angular/core';

import { RuntimeModule } from '@webkinz/runtime';

import { LauncherActivity } from './launcher.activity';

@NgModule({
  imports: [RuntimeModule],
  declarations: [LauncherActivity],
  exports: [LauncherActivity],
})
export class LauncherModule {}
