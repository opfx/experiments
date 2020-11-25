import { Component, HostBinding } from '@angular/core';

import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Activity, ActivityInfo } from '@webkinz/runtime';
import { Intent } from '@webkinz/runtime';

@Component({
  selector: 'wx-launcher',
  template: `
    <div class="backdrop" (click)="dismiss()"></div>

    <div class="grid">
      <wx-tile *ngFor="let activity of activities$ | async" [activity]="activity" (click)="launch(activity)"></wx-tile>
    </div>
  `,
  styleUrls: [`./launcher.activity.scss`],
})
export class LauncherActivity extends Activity {
  public activities$: Observable<ActivityInfo[]>;

  @HostBinding('class.hidden') isHidden = false;

  protected onCreate(): void {
    console.log('launcher init');
    const filterIntent = new Intent();
    // this.activities$ = this.manager.queryActivities(filterIntent).pipe(filter());
    this.activities$ = of([
      { name: 'arcade', path: '', label: 'Arcade' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
    ]);
    // this.activities$ = this.manager.getActivities().pipe(
    //   map((ai: ActivityInfo[]) => {
    //     const filter = (activityInfo: ActivityInfo) => {
    //       const intentFlt = (activityInfo as any).intentFilter;
    //       if (!intentFlt.category || !intentFlt.category.includes('LAUNCHER')) {
    //         return false;
    //       }

    //       return true;
    //     };
    //     const result = ai.filter(filter);
    //     return result;
    //   })
    // );
  }

  protected onDestroy(): void {
    console.log('launcher destroy');
  }

  public dismiss(): void {
    this.toggle();
  }

  public toggle(): void {
    this.isHidden = !this.isHidden;
    console.log(this.isHidden);
  }

  public launch(activity): void {
    console.log(`launching activity ${JSON.stringify(activity)}`);
    const intent = new Intent(Intent.ACTION.DEFAULT, `content://${activity.name}`);
    this.startActivity(intent);
    this.isHidden = true;
  }
}
