import { NgModule } from '@angular/core';

import { RuntimeModule } from '@webkinz/runtime';

import { LauncherActivity } from './launcher.activity';
import { TileComponent } from './components';

@NgModule({
  imports: [RuntimeModule],
  declarations: [LauncherActivity, TileComponent],
  exports: [LauncherActivity],
})
export class LauncherModule {}
