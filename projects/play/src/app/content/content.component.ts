import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LauncherActivity } from './../launcher';
@Component({
  selector: 'wx-content',
  template: `
    <wx-router-outlet style="z-index:-1"></wx-router-outlet>
    <wx-launcher></wx-launcher>
    <div style="z-index:1000; position:absolute; right:0px; bottom:0px; background:yellow;">
      <button (click)="toggleLauncher()">Start</button>
      <button (click)="goHome()">Home</button>
    </div>
  `,
  styles: [],
})
export class ContentComponent {
  @ViewChild(LauncherActivity) launcher: LauncherActivity;

  constructor(private router: Router) {}

  public goHome(): void {
    this.router.navigate(['/home']);
  }
  public toggleLauncher(): void {
    this.launcher.toggle();
  }
}
