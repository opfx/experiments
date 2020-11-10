import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LauncherActivity } from './../launcher';
@Component({
  selector: 'wx-content',
  templateUrl: './content.component.html',
  styles: [],
})
export class ContentComponent {
  @ViewChild(LauncherActivity) launcher: LauncherActivity;

  constructor() {}

  ngOnInit(): void {
    console.log('content init');
  }

  public goHome(): void {
    // this.router.navigate(['/home']);
  }
  public toggleLauncher(): void {
    this.launcher.toggle();
  }

  public launchHome(): void {
    console.log('content.launchHome()');
  }

  public launchArcade(): void {
    console.log('content.launchArcade()');
  }

  public launchWShop(): void {
    console.log('content.launchWShop()');
  }

  public minimize(): void {
    console.log('content.minimize()');
  }

  public maximize(): void {
    console.log('content.maximize()');
  }
}
