import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RuntimeModule } from '@webkinz/runtime';

import { GameComponent } from './components';
import { AtlantilesActivity } from './atlantiles.activity';
import { AssetLoader } from './providers';

const routes: Routes = [{ path: '', component: AtlantilesActivity }];

@NgModule({
  declarations: [AtlantilesActivity, GameComponent],
  providers: [AssetLoader],
  imports: [RuntimeModule, RouterModule.forChild(routes)],
  exports: [],
})
export class AtlantilesModule {}
