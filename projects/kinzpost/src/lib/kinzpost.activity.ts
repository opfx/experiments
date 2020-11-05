import { Component } from '@angular/core';

import { Activity } from '@webkinz/runtime';

@Component({
  selector: 'wx-kinzpost',
  template: `
    <p>kinzpost works!</p>
    <div style="position:absolute; top:0px; right:0px">
      <button name="close" (click)="finish()">X</button>
    </div>
  `,
  styleUrls: ['./kinzpost.activity.scss'],
})
export class KinzpostActivity extends Activity {}
