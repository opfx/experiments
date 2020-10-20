import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DIRECTIVES as proxies } from './components';

import { RuntimeComponent } from './runtime.component';

@NgModule({
  declarations: [proxies, RuntimeComponent],
  imports: [],
  exports: [proxies, RouterModule],
})
export class RuntimeModule {}
