import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SampleService } from './../sample.service';

@Component({
  selector: 'wx-home',
  template: `<button (click)="play()">Play</button>`,
  styles: [],
})
export class HomeComponent {
  constructor(private router: Router, private sample: SampleService) {}

  public play(): void {
    this.sample.authenticated = true;
    this.router.navigate(['/content'], { skipLocationChange: true });
  }
}
