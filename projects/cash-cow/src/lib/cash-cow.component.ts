import { Component, AfterViewInit, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Container, Loader, Renderer, Text, Ticker, utils } from 'pixi.js';
import { WxPixi } from 'projects/runtime/src/lib/wcl/components/proxies';

@Component({
  selector: 'wx-cash-cow',
  template: `<wx-pixi stage="this.stage" loop="this.loop"></wx-pixi>`,
  styles: [],
})
export class CashCowComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(WxPixi, { static: false }) pixi: WxPixi;
  private player: WxPixi;
  private stage: Container;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.init();
    this.stage = new Container();
  }

  ngAfterViewInit(): void {
    const defaultText = new Text('Cash-Cow', { fontFamily: 'Webkinz Medium', fontSize: 50 });
    defaultText.position.set(50, 50);
    this.stage.addChild(defaultText);

    this.pixi.stage = this.stage;
    this.pixi.loop = this.loop;
  }

  ngOnDestroy(): void {
    console.log('[cash-cow].destroy');
  }

  private init(): void {
    const loader = Loader.shared;
    const webGLSupported = utils.isWebGLSupported();
    // const target = utils.CanvasRenderTarget;
  }

  public loop(delta: number): void {
    // console.log('[cash-cow] delta: ' + delta);
  }

  public close(): void {
    this.router.navigate(['/content']);
  }
}
