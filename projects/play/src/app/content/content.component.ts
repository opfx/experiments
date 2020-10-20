import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'wx-content',
  template: `
    <div style="z-index:100">
      <p><button (click)="cashCow()">Cash Cow</button></p>
      <p><button (click)="kinzpost()">Kinzpost</button></p>
    </div>

    <wx-router-outlet style="z-index:-1"></wx-router-outlet>
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
  public kinzpost(): void {
    this.router.navigate(['content/kinzpost']);
  }
}
