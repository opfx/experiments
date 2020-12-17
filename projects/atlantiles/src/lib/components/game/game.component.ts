import { Component, ElementRef, ViewChild } from '@angular/core';
import { AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { AtlantilesGame } from '../../atlantiles.game';;

@Component({
  selector: 'wx-game',
  template: `<div [hidden]="view != 'load'" class="loading">Loading...</div>
    <div [hidden]="view != 'ready'" class="ready">
      <wx-button (click)="play()">Play</wx-button>
    </div>
    <div #renderer [hidden]="view != 'play'" class="canvas"></div>
    <div class="payout"></div>`,
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('renderer', { static: false }) private mRendererElRef: ElementRef;

  private mView: string;
  constructor(private mGame: AtlantilesGame) {
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

  ngAfterViewInit() {
    this.mRendererElRef.nativeElement.appendChild(this.mGame.renderer.view);
  }

  ngOnDestroy(): void {
    this.mGame.exit();
  }

  play(): void {
    this.mGame.start();
  }
}
