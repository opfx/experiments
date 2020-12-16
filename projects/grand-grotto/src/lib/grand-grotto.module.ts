import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RuntimeModule } from '@webkinz/runtime';

import { GrandGrottoComponent } from './grand-grotto.component';

import { GameComponent } from './components';
import { GrandGrottoGame } from './grand-grotto.game';
import { AssetLoader } from './providers';

import { Game } from './game';

const routes: Routes = [
  { path: '', component: GrandGrottoComponent },
  // { path: 'instructions', component: GameComponent },
];
@NgModule({
  declarations: [GrandGrottoComponent, GameComponent],
  // providers: [{ provide: Game, useValue: 23 }],
  providers: [GrandGrottoGame, AssetLoader],
  imports: [RuntimeModule, RouterModule.forChild(routes)],
  exports: [GrandGrottoComponent],
})
export class GrandGrottoModule {}
