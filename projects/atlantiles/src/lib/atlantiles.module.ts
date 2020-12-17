import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RuntimeModule } from '@webkinz/runtime';

import { AtlantilesComponent } from './atlantiles.component';

import { GameComponent } from './components';
import { AtlantilesGame } from './atlantiles.game';
import { AssetLoader } from './providers';

const routes: Routes = [{ path: '', component: AtlantilesComponent }];

@NgModule({
  declarations: [AtlantilesComponent, GameComponent],
  providers: [AtlantilesGame, AssetLoader],
  imports: [RuntimeModule, RouterModule.forChild(routes)],
  exports: [AtlantilesComponent],
})
export class AtlantilesModule {}
