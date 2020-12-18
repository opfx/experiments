import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { AtlantilesGame } from '../../atlantiles.game';

@Component({
  selector: 'wx-game',
  template: `<div [hidden]="view != 'load'" class="loading">Loading...</div>
    <div [hidden]="view != 'ready'" class="ready">
      <wx-button (click)="play()">Play</wx-button>
    </div>
    <div #renderer [hidden]="view != 'play'" class="renderer"></div>
    <div class="payout"></div>`,
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('renderer', { static: false }) private mRendererElRef: ElementRef;

  private mView: string;
  constructor(private mGame: AtlantilesGame, private mElementRef: ElementRef) {
    // console.log(JSON.stringify(game));
  }

  get view(): string {
    return this.mView;
  }

  ngOnInit(): void {
    this.mGame.activeView$.subscribe((view) => {
      this.mView = view;
    });
    this.mGame.load();
  }

  ngAfterViewInit(): void {
    this.mRendererElRef.nativeElement.appendChild(this.mGame.renderer.view);
    const w = this.mElementRef.nativeElement.offsetWidth;
    console.log(w);
    const h = this.mElementRef.nativeElement.offsetHeight;
    this.mGame.resize(w, h);
  }

  ngOnDestroy(): void {
    this.mGame.exit();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mGame.resize(event.target.innerWidth, event.target.innerHeight);
  }

  play(): void {
    this.mGame.start();
  }
}
