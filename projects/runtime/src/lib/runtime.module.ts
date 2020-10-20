import { NgModule, ModuleWithProviders, APP_INITIALIZER, NgZone } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DIRECTIVES as proxies } from './wcl/components';
import { RouterOutletDirective } from './core/navigation/directives/router-outlet.directive';

import { RuntimeComponent } from './runtime.component';
import { bootstrap } from './runtime.bootstrap';

@NgModule({
  declarations: [proxies, RouterOutletDirective, RuntimeComponent],
  imports: [CommonModule],
  exports: [proxies, RouterOutletDirective, RouterModule, CommonModule],
})
export class RuntimeModule {
  static forRoot(): ModuleWithProviders<RootRuntimeModule> {
    return {
      ngModule: RootRuntimeModule,
      providers: [{ provide: APP_INITIALIZER, useFactory: bootstrap, multi: true, deps: [DOCUMENT, NgZone] }],
    };
  }
}

@NgModule({
  exports: [RuntimeModule],
})
export class RootRuntimeModule {}
