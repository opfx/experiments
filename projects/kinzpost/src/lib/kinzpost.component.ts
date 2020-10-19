import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'wx-kinzpost',
  template: ` <p>kinzpost works!</p> `,
  styles: [],
})
export class KinzpostComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit(): void {
    console.log('kinzpost init');
  }

  ngOnDestroy(): void {
    console.log('kinzpost destroy');
  }
}
