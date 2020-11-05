import { NgModule } from '@angular/core';

import { RuntimeModule } from '@webkinz/runtime';

import { LauncherComponent } from './launcher.component';

@NgModule({
  imports: [RuntimeModule],
  declarations: [LauncherComponent],
  exports: [LauncherComponent],
})
export class LauncherModule {}
