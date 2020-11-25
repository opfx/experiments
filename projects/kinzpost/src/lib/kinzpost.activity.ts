import { Component } from '@angular/core';

import { Activity } from '@webkinz/runtime';

@Component({
  selector: 'wx-kinzpost',
  template: `
    <wx-backdrop (wxBackdropTap)="dismiss()"></wx-backdrop>

    <div style="position:absolute; top:0px; right:0px">
      <wx-button name="close" (click)="finish()"><wx-icon name="close" slot="icon-only"></wx-icon></wx-button>
    </div>
  `,
  styleUrls: ['./kinzpost.activity.scss'],
})
export class KinzpostActivity extends Activity {
  dismiss(): void {
    console.log('dissmissed');
  }
}
