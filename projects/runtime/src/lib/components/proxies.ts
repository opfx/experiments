/* eslint-disable */
/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from "@angular/core";
import { ProxyCmp, proxyOutputs } from "./proxies-utils";
import { Components } from "@webkinz/wcl";
export declare interface WxRouterOutlet extends Components.WxRouterOutlet {
}
@ProxyCmp({ inputs: ["animated", "animationBuilder", "mode"], "methods": ["commit"] })
@Component({ selector: "wx-router-outlet", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["animated", "animationBuilder", "mode"] })
export class WxRouterOutlet {
    wxNavWillLoad!: EventEmitter<CustomEvent>;
    wxNavWillChange!: EventEmitter<CustomEvent>;
    wxNavDidChange!: EventEmitter<CustomEvent>;
    protected el: HTMLElement;
    constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ["wxNavWillLoad", "wxNavWillChange", "wxNavDidChange"]);
    }
}
export declare interface WxSample extends Components.WxSample {
}
@ProxyCmp({ inputs: ["first", "last", "middle"] })
@Component({ selector: "wx-sample", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["first", "last", "middle"] })
export class WxSample {
    protected el: HTMLElement;
    constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
        c.detach();
        this.el = r.nativeElement;
    }
}
