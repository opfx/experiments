import { Component, HostBinding } from '@angular/core';

import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Activity, ActivityInfo } from '@webkinz/runtime';
import { Intent } from '@webkinz/runtime';

@Component({
  selector: 'wx-launcher',
  template: `
    <div class="backdrop" (click)="dismiss()"></div>
    <div class="tilegrid">
      <button *ngFor="let activity of activities$ | async" (click)="launch(activity)">
        {{ activity.name }}
      </button>
    </div>
  `,
  styleUrls: [`./launcher.activity.scss`],
})
export class LauncherActivity extends Activity {
  public activities$: Observable<ActivityInfo[]>;

  @HostBinding('class.hidden') isHidden = true;

  protected onCreate(): void {
    console.log('launcher init');
    const filterIntent = new Intent();
    // this.activities$ = this.manager.queryActivities(filterIntent).pipe(filter());
    this.activities$ = of([
      { name: 'arcade', label: 'Arcade' },
      { name: 'kinzpost', label: 'Kinzpost' },
    ]);
  }

  protected onDestroy(): void {
    console.log('launcher destroy');
  }

  public dismiss(): void {
    this.toggle();
  }

  public toggle(): void {
    this.isHidden = !this.isHidden;
  }

  public launch(activity): void {
    const intent = new Intent(Intent.ACTION.DEFAULT, `content://${activity.name}`);
    this.startActivity(intent);
    this.isHidden = true;
  }
}
