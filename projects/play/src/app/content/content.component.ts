import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'wx-content',
  template: `
    <p><button (click)="cashCow()">Cash Cow</button></p>
    <p><button (click)="wshop()">WShop</button></p>
  `,
  styles: [],
})
export class ContentComponent {
  constructor(private router: Router) {}
  public cashCow(): void {
    this.router.navigate(['/cash-cow']);
  }
  public wshop(): void {
    // this.router.navigate(['/cash-cow']);
  }
}
