import { Component } from '@angular/core';

import { Activity } from '@webkinz/runtime';

@Component({
  selector: 'wx-arcade',
  template: ` <p>arcade works!</p> `,
  styleUrls: [`./arcade.activity.scss`],
})
export class ArcadeActivity extends Activity {}
