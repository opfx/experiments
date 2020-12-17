import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RuntimeModule } from '@webkinz/runtime';

import { AtlantilesComponent } from './atlantiles.component';

const routes: Routes = [{ path: '', component: AtlantilesComponent }];

@NgModule({
  declarations: [AtlantilesComponent],
  imports: [RuntimeModule, RouterModule.forChild(routes)],
  exports: [AtlantilesComponent],
})
export class AtlantilesModule {}
