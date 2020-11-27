import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RuntimeModule } from '@webkinz/runtime';

import { CashCowComponent } from './cash-cow.component';

const routes: Routes = [{ path: '', component: CashCowComponent }];

@NgModule({
  declarations: [CashCowComponent],
  imports: [RuntimeModule, RouterModule.forChild(routes)],
  exports: [CashCowComponent],
})
export class CashCowModule {}
