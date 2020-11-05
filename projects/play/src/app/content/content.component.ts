import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'wx-content',
  template: `
    <!--
    <div style="z-index:100">
      <p><button (click)="cashCow()">Cash Cow</button></p>
      <p><button (click)="kinzpost()">Kinzpost</button></p>
    </div>
-->
    <wx-router-outlet style="z-index:-1"></wx-router-outlet>
    <wx-launcher [hidden]="hideLauncher"></wx-launcher>
    <div style="z-index:1000; position:absolute; right:0px; bottom:0px;">
      <button (click)="cashCow()">Start</button>
    </div>
  `,
  styles: [],
})
export class ContentComponent implements OnInit, OnDestroy {
  hideLauncher = true;
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('content init');
  }

  ngOnDestroy(): void {
    console.log('content destroy');
  }

  public cashCow(): void {
    // this.router.navigate(['content/cash-cow']);
    console.log('starting');
    this.hideLauncher = !this.hideLauncher;
  }
  public kinzpost(): void {
    this.router.navigate(['content/kinzpost']);
  }
}
