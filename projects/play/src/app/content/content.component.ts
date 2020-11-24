import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LauncherActivity } from './../launcher';

@Component({
  selector: 'wx-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, OnDestroy {
  @ViewChild(LauncherActivity) launcher: LauncherActivity;

  constructor() {}

  ngOnInit(): void {
    console.log('content init');
  }

  ngOnDestroy(): void {}

  public goHome(): void {
    // this.router.navigate(['/home']);
  }
  public toggleLauncher(): void {
    this.launcher.toggle();
  }

  public goArcade(): void {
    console.log('content.launchArcade()');
  }

  public goWShop(): void {
    console.log('content.launchWShop()');
  }

  public collapseStart(): void {
    console.log('content.minimize()');

    // coll - collapsible, see https://www.w3schools.com/howto/howto_js_collapsible.asp
    const coll = document.getElementsByClassName('start');
    let content: HTMLElement;

    for (let i = 0; i < coll.length; i++) {
      content = coll[i] as HTMLElement;
      console.log('[content], coll: ' + content + ', ' + content.style + ', ' + content.style.length);
      if (content.style.bottom) {
        content.style.bottom = null;
      } else {
        content.style.bottom = -160 + 'px';
        console.log('content.minimize() 2');
      }
    }
  }
}
