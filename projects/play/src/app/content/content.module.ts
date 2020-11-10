import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { RuntimeModule } from '@webkinz/runtime';

import { LauncherModule } from './../launcher';

import { ContentComponent } from './content.component';

const routes: Route[] = [
  {
    path: '',
    component: ContentComponent,
    children: [
      {
        path: 'cash-cow',
        loadChildren: () => import('@webkinz/cash-cow').then((m) => m.CashCowModule),
        data: { intentFilter: { category: ['GAMES', 'ARCADE'] } },
      },
      {
        path: 'arcade',
        loadChildren: () => import('@webkinz/arcade').then((m) => m.ArcadeModule),
        data: { intentFilter: { category: ['LAUNCHER'] } },
      },
      {
        path: 'kinzpost',
        loadChildren: () => import('@webkinz/kinzpost').then((m) => m.KinzpostModule),
        data: { intentFilter: { category: ['LAUNCHER'] } },
      },
    ],
  },
];

@NgModule({
  imports: [RuntimeModule, RouterModule.forChild(routes), LauncherModule],
  declarations: [ContentComponent],
})
export class ContentModule {
  constructor() {
    console.log(`creating ContentModule`);
  }
}
