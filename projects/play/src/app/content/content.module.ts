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
      { path: 'cash-cow', loadChildren: () => import('@webkinz/cash-cow').then((m) => m.CashCowModule) },
      { path: 'arcade', loadChildren: () => import('@webkinz/arcade').then((m) => m.ArcadeModule) },
      { path: 'kinzpost', loadChildren: () => import('@webkinz/kinzpost').then((m) => m.KinzpostModule) },
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
