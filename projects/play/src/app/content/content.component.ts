import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { LauncherActivity } from './../launcher';
@Component({
  selector: 'wx-content',
  template: `
    <wx-router-outlet style="z-index:-1"></wx-router-outlet>
    <wx-launcher></wx-launcher>
    <div style="z-index:1000; position:absolute; right:0px; bottom:0px; background:yellow;">
      <button (click)="toggleLauncher()">Start</button>
    </div>
  `,
  styles: [],
})
export class ContentComponent implements OnInit, OnDestroy {
  @ViewChild(LauncherActivity) launcher: LauncherActivity;

  constructor() {}

  ngOnInit(): void {
    console.log('content init');
  }

  ngOnDestroy(): void {
    console.log('content destroy');
  }

  public toggleLauncher(): void {
    this.launcher.toggle();
  }
}
