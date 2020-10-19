import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wx-cash-cow',
  template: `
    <p>cash-cow works!</p>
    <p><button (click)="close()">Close</button></p>
  `,
  styles: [],
})
export class CashCowComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Cash cow init');
  }

  ngOnDestroy(): void {
    console.log('Cash cow destroy');
  }

  public close(): void {
    this.router.navigate(['/content']);
  }
}
