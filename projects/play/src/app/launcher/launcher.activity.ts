import { Component, HostBinding } from '@angular/core';
import { animate, keyframes, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { openClose, openCloseStagger, staggerEnter } from '../animations';

import { from, Observable, of, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Activity, ActivityInfo } from '@webkinz/runtime';
import { Intent } from '@webkinz/runtime';

const COLUMNS_COUNT = 7;
const ROW_COUNT = 4;

// https://github.com/angular/angular/blob/master/aio/content/examples/animations/src/app/hero-list-page.component.ts
// https://itnext.io/angular-animations-stagger-over-static-and-async-data-3907c4889479

// https://embed.plnkr.co/CBaVvF/


/**
 * Easing:
 * The easing value controls how the animation accelerates and decelerates during its runtime.
 * Value is one of ease, ease-in, ease-out, ease-in-out, or a cubic-bezier() function call.
 * If not supplied, no easing is applied.
 */

/**
 * Animation is triggered by changing row.length in div tag: <div class="grid" [@listSmooth]='rows.length'>
 *
 * For some reason animations are not triggered for *ng for with observable (why?):
 * [@listSmooth]='activities$.length'
 * *ngFor="let activity of activities$ | async; index as i"
 * [index]="i"
 *
 * Switch animation between @listEaseBounce and @listSmooth in <div class="grid">;
 *     <div class="grid" [@listEaseBounce]='rows.length'> // rows.length value change triggers @[animation]
 *     OR
 *     <div class="grid" [@listEaseBounce]='rowsLength'> // rowsLength value change triggers @[animation]
 *
 * I've switch to rows from activities$ in ngFor, as we play animation on item entering or leaving DOM.
 *   As I can't change activities$ => there is rows
 * But angular animation's :enter, :leave can't animate array from end by it's nature.
 * Could I create other states open, closed and query by rowIndex or class?
 *     But still I can't write correct function for easeBounceOut, easeBounceIn in angular.
 * Other option is - JS animation
 */
@Component({
  selector: 'wx-launcher',
  template: `
    <div class="backdrop" (click)="dismiss()"></div>

    <div class="grid" [@listEaseBounce]='rows.length'>
      <wx-tile
        *ngFor="let activity of rows; index as i"
        [index]="i"
        [activity]="activity"
        (click)="launch(activity)"
      ></wx-tile>
    </div>
  `,
  styleUrls: [`./launcher.activity.scss`],
  animations: [
    trigger('listEaseBounce', [  // 'listStagger'
      transition('* <=> *', [
        /*
          // stagger:
          query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger(
              '50ms',
              animate(
                '550ms ease-out',
                style({ opacity: 1, transform: 'translateY(0px)' })
              )
            )
          ],
          { optional: true }
        ),*/

        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-25%)' }),

            // see https://angular.io/api/animations/keyframes
            // see https://easings.net/#easeOutBounce
            animate(
              '400ms ease-out', // ease-in // ease-out
              keyframes([
                style({ opacity: 1, transform: 'translateY(0)', offset: 1 / 2.75 }),
                style({ opacity: 0.75, transform: 'translateY(-6%)', offset: 1.5 / 2.75 }),
                style({ opacity: 1, transform: 'translateY(0)', offset: 2 / 2.75 }),
                style({ opacity: 0.9375, transform: 'translateY(-2%)', offset: 2.25 / 2.75 }),
                style({ opacity: 1, transform: 'translateY(0)', offset: 2.5 / 2.75 }),
                style({ opacity: 0.984375, transform: 'translateY(-0.5%)', offset: 2.625 / 2.75 }),
                style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
              ])
            )
          ],
          { optional: true }
        ),

        // as per https://easings.net/#easeInBounce :
        // easeInBounce = (x: number) => (return 1 - easeOutBounce(1 - x));
        query(':leave',
          animate(
            '400ms',
            keyframes([
              style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
              style({ opacity: 0.984375, transform: 'translateY(-0.5%)', offset: 1 - 2.625 / 2.75 }),
              style({ opacity: 1, transform: 'translateY(0)', offset: 1 - 2.5 / 2.75 }),
              style({ opacity: 0.9375, transform: 'translateY(-2%)', offset: 1 - 2.25 / 2.75 }),
              style({ opacity: 1, transform: 'translateY(0)', offset: 1 - 2 / 2.75 }),
              style({ opacity: 0.75, transform: 'translateY(-6%)', offset: 1 - 1.5 / 2.75 }),
              style({ opacity: 1, transform: 'translateY(0)', offset: 1 - 1 / 2.75 }),
              style({ opacity: 0, transform: 'translateY(-25%)', offset: 1 }),
            ])
          ),
          { optional: true }
        ),
      ]),
    ]),

    trigger('listSmooth', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(40%)' }),
            animate(
              '300ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'translateY(0px)' })
            )
          ],
          { optional: true }
        ),

        query(':leave', animate('200ms ease-in-out', style({ opacity: 0, transform: 'translateY(40%)' })), {
          optional: true
        })
      ]),
    ]),

    openClose

  ]
})
export class LauncherActivity extends Activity {
  public activities$: Observable<ActivityInfo[]>;
  public rows: ActivityInfo[] = [];
  private currentActivities: ActivityInfo[];
  private subscription: Subscription;
  private interval = -1;
  private timeouts: number[] = [];
  private isHiddenByClick = true; // counts by mouse click as isHidden is delayed to wait 'fading' animation to finish

  @HostBinding('class.hidden') isHidden = true; // false;

  // see for async stagger: https://itnext.io/angular-animations-stagger-over-static-and-async-data-3907c4889479
  protected onCreate(): void {
    console.log('launcher init');

    const filterIntent = new Intent();
    // this.activities$ = this.manager.queryActivities(filterIntent).pipe(filter());
    this.activities$ = of([
      { name: 'arcade', path: '', label: 'Arcade' },
      { name: 'cash-cow', path: '', label: 'Cash Cow' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'arcade', path: '', label: 'Arcade' },
      { name: 'cash-cow', path: '', label: 'Cash Cow' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'arcade', path: '', label: 'Arcade' },
      { name: 'cash-cow', path: '', label: 'Cash Cow' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
      { name: 'arcade', path: '', label: 'Arcade' },
      { name: 'cash-cow', path: '', label: 'Cash Cow' },
      { name: 'kinzpost', path: '', label: 'Kinzpost' },
    ]);

    this.subscription = this.activities$.subscribe(
      (list: ActivityInfo[]) => this.currentActivities = list
    );

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

    this.subscription.unsubscribe();
  }

  public dismiss(): void {
    this.toggle();
  }

  public toggle(): void {
    // this.isHidden = !this.isHidden;

    this.changeRowsNumber(this.isHiddenByClick);
    this.isHiddenByClick = !this.isHiddenByClick; // counts by mouse click as isHidden is delayed to wait 'fading' animation to finish

    // console.log('this.isHiddenByClick:' + this.isHiddenByClick);
  }

  private changeRowsNumber(isHiddenByClick: boolean): void {
    // clear previous interval
    if (this.interval !== -1) {
      clearInterval(this.interval);
    }
    while (this.timeouts.length) {
      clearTimeout(this.timeouts.pop());
    }

    let totalRows: number;
    let delay: number;
    let timeout: number;

    // show
    if (isHiddenByClick) {
      this.isHidden = false;

      totalRows = Math.ceil(this.currentActivities.length / COLUMNS_COUNT);

      // variable interval, but it is impossible in angular, as first array elements appears last :(
      for (let row = 0; row < totalRows; row++) {
        delay = (totalRows - row) * .12; // delay = (howManyRowsAreThere - whatRowAmI) * .15; // from flash
        // console.log('row: ' + row + ', delay: ' + delay);

        timeout = setTimeout(() => {
          const fromIndex = this.rows.length;
          const toIndex = Math.min(fromIndex + COLUMNS_COUNT, this.currentActivities.length);
          for (let i = fromIndex; i < toIndex; i++) {
            this.rows.push(this.currentActivities[i]);
          }
        }, delay * 1000);
        this.timeouts.push(timeout);
      }

      // hide
    } else {

      totalRows = Math.ceil(this.rows.length / COLUMNS_COUNT);

      for (let row = 0; row < totalRows; row++) {
        delay = row * .2; // delay = (howManyRowsAreThere - whatRowAmI) * .15; // from flash
        // console.log('row: ' + row + ', delay: ' + delay);

        timeout = setTimeout(() => {
          const fromIndex = this.rows.length;
          const modulus = fromIndex % COLUMNS_COUNT;
          const toIndex = Math.max(0, fromIndex - (modulus === 0 ? COLUMNS_COUNT : modulus));
          for (let i = fromIndex - 1; i >= toIndex; i--) {
            this.rows.pop();
          }

        }, delay * 1000);
        this.timeouts.push(timeout);
      }

      this.interval = setInterval(() => {
        // on top - to hide on finishing first row animation
        if (this.rows.length === 0) {
          clearInterval(this.interval);
          this.isHidden = true;
        }
      }, (delay + 0.3) * 1000);
    }
  }

  public launch(activity): void {
    console.log(`launching activity ${JSON.stringify(activity)}`);
    const intent = new Intent(Intent.ACTION.DEFAULT, `content://${activity.name}`);
    this.startActivity(intent);

    this.isHidden = this.isHiddenByClick = true;
    this.rows.length = 0;
  }
}
