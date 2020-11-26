import { Component, Input } from '@angular/core';

import { ActivityInfo } from '@webkinz/runtime';
@Component({
  selector: 'wx-tile',
  template: `
    <span class="icon">
      <wx-icon name="{{ activity.name }}"></wx-icon>
      <span class="glow"></span>
    </span>
    <span class="label">{{ activity.label }}</span>
  `,
  styleUrls: ['./tile.component.scss'],
})
export class TileComponent {
  private mActivity: ActivityInfo;

  @Input() set activity(info: ActivityInfo) {
    this.mActivity = info;
  }
  get activity(): ActivityInfo {
    return this.mActivity;
  }

  @Input() set index(index: number) {
    console.log(`${index}`);
  }
}
