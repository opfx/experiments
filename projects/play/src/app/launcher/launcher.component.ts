import { Component, Input, HostBinding } from '@angular/core';
import { OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { of } from 'rxjs';

import { Activity, ActivityInfo } from '@webkinz/runtime';
import { Intent } from '@webkinz/runtime';

@Component({
  selector: 'wx-launcher',
  template: `
    <button *ngFor="let activity of activities$ | async" (click)="launch(activity)">
      {{ activity.name }}
    </button>
  `,
  styleUrls: [`./launcher.component.scss`],
})
export class LauncherComponent extends Activity {
  public activities$: Observable<ActivityInfo[]>;

  @HostBinding('class.hidden') isHidden = true;

  @Input() set hidden(hidden) {
    console.log(`hidden : ${hidden}`);
    this.isHidden = hidden;
  }

  onCreate(): void {
    console.log('launcher init');
    this.activities$ = of([
      { name: 'arcade', label: 'Arcade' },
      { name: 'kinzpost', label: 'Kinzpost' },
    ]);
  }

  onDestroy(): void {
    console.log('launcher destroy');
  }

  launch(activity): void {
    const intent = new Intent(Intent.ACTION.DEFAULT, `content://${activity.name}`);
    this.startActivity(intent);
    this.isHidden = true;
  }
}
