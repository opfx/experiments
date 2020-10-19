import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'wx-content',
  template: `
    <p><button (click)="cashCow()">Cash Cow</button></p>
    <p><button (click)="wshop()">WShop</button></p>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class ContentComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('content init');
  }

  ngOnDestroy(): void {
    console.log('content destroy');
  }

  public cashCow(): void {
    this.router.navigate(['content/cash-cow']);
  }
  public wshop(): void {
    // this.router.navigate(['/cash-cow']);
  }
}
