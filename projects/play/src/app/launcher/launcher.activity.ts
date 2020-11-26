import { Component, HostBinding } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { openClose, openCloseStagger, staggerEnter } from '../animations';

import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Activity, ActivityInfo } from '@webkinz/runtime';
import { Intent } from '@webkinz/runtime';

const COLUMNS_COUNT = 7;
const ROW_COUNT = 4;

/*
 * not working yet:
 * [@openCloseStagger]="!isHidden ? 'open' : 'closed'"
 * @staggerEnter
 */
@Component({
  selector: 'wx-launcher',
  template: `
    <div class="backdrop" (click)="dismiss()"></div>

    <div class="grid">
      <wx-tile
        [@openClose]="!isHidden ? 'open' : 'closed'"
        *ngFor="let activity of activities$ | async; index as i"
        [index]="i"
        [activity]="activity"
        (click)="launch(activity)"
      ></wx-tile>
    </div>
  `,
  styleUrls: [`./launcher.activity.scss`],
  animations: [
    openClose
  ]
})
export class LauncherActivity extends Activity {
  public activities$: Observable<ActivityInfo[]>;

  @HostBinding('class.hidden') isHidden = false;

  // see for async stagger: https://itnext.io/angular-animations-stagger-over-static-and-async-data-3907c4889479
  protected onCreate(): void {
    console.log('launcher init');
    const filterIntent = new Intent();
    // this.activities$ = this.manager.queryActivities(filterIntent).pipe(filter());
    this.activities$ = of([
      { name: 'arcade', path: '', label: 'Arcade' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'arcade', path: '', label: 'Arcade' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'arcade', path: '', label: 'Arcade' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
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
    // console.log(this.isHidden);
  }

  public launch(activity): void {
    console.log(`launching activity ${JSON.stringify(activity)}`);
    const intent = new Intent(Intent.ACTION.DEFAULT, `content://${activity.name}`);
    this.startActivity(intent);
    this.isHidden = true;
  }
}
