/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { AnimationBuilder, Color, Size } from "./api";
import { Container } from "pixi.js";
import { SwipeGestureHandler } from "./util/gesture";
import { TabBarChangedEventDetail } from "./components/tab-bar/types";
import { TabButtonClickEventDetail, TabButtonLayout } from "./components/tab-button/types";
export namespace Components {
    interface WxApp {
    }
    interface WxBackdrop {
        /**
          * If `true`, the backdrop will stop propagation on tap.
         */
        "stopPropagation": boolean;
        /**
          * If `true`, the backdrop will can be clicked and will emit the `wxBackdropTap` event.
         */
        "tappable": boolean;
        /**
          * If `true` the backdrop will be visible.
         */
        "visible": boolean;
    }
    interface WxBtn {
        /**
          * The type of button.
         */
        "buttonType": string;
        "color"?: Color;
        /**
          * If `true`, the user cannot interact with the button.
         */
        "disabled": boolean;
        "gradientname": string;
        "mode": "ios" | "md";
        /**
          * The button shape.
         */
        "shape": string;
        /**
          * The button size.
         */
        "size": Size;
    }
    interface WxButton {
        /**
          * The type of button.
         */
        "buttonType": string;
        /**
          * The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics).
         */
        "color"?: Color;
        /**
          * If `true`, the user cannot interact with the button.
         */
        "disabled": boolean;
        /**
          * This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want).
         */
        "download": string | undefined;
        /**
          * Set to `"block"` for a full-width button or to `"full"` for a full-width button without left and right borders.
         */
        "expand"?: 'full' | 'block';
        /**
          * Set to `"clear"` for a transparent button, to `"outline"` for a transparent button with a border, or to `"solid"`. The default style is `"solid"` except inside of a toolbar, where the default is `"clear"`.
         */
        "fill"?: 'clear' | 'outline' | 'solid' | 'default';
        /**
          * Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.
         */
        "href": string | undefined;
        /**
          * The mode determines which platform style to use.
         */
        "mode": "ios" | "md";
        /**
          * Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
         */
        "rel": string | undefined;
        /**
          * The button shape.
         */
        "shape"?: 'round';
        /**
          * The button size.
         */
        "size"?: Size;
        /**
          * If `true`, activates a button with a heavier font weight.
         */
        "strong": boolean;
        /**
          * Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
         */
        "target": string | undefined;
        /**
          * The type of the button.
         */
        "type": 'submit' | 'reset' | 'button';
    }
    interface WxButtons {
        /**
          * If true, buttons will disappear when its parent toolbar has fully collapsed if the toolbar is not the first toolbar. If the toolbar is the first toolbar, the buttons will be hidden and will only be shown once all toolbars have fully collapsed.
         */
        "collapse": boolean;
    }
    interface WxIcon {
        /**
          * Set the icon to hidden, respectively `true`, to remove it from the accessibility tree.
         */
        "ariaHidden"?: string;
        /**
          * Specifies the label to use for accessibility. Defaults to the icon name.
         */
        "ariaLabel"?: string;
        /**
          * The color to use for the background of the item.
         */
        "color"?: Color;
        /**
          * Specifies whether the icon should horizontally flip when `dir` is `"rtl"`.
         */
        "flipRtl"?: boolean;
        /**
          * A combination of both `name` and `src`. If a `src` url is detected it will set the `src` property. Otherwise it assumes it's a built-in named SVG and set the `name` property.
         */
        "icon"?: any;
        /**
          * Specifies which icon to use on `ios` mode.
         */
        "ios"?: string;
        /**
          * If enabled, wx-icon will be loaded lazily when it's visible in the viewport. Default, `false`.
         */
        "lazy": boolean;
        /**
          * Specifies which icon to use on `md` mode.
         */
        "md"?: string;
        /**
          * The mode determines which platform styles to use.
         */
        "mode": "ios" | "md";
        /**
          * Specifies which icon to use from the built-in set of icons.
         */
        "name"?: string;
        /**
          * When set to `false`, SVG content that is HTTP fetched will not be checked if the response SVG content has any `<script>` elements, or any attributes that start with `on`, such as `onclick`.
         */
        "sanitize": boolean;
        /**
          * The icon size.
         */
        "size"?: Size;
        /**
          * Specifies the exact `src` of an SVG file to use.
         */
        "src"?: string;
    }
    interface WxPixi {
        "loop": (delta: number) => void;
        "stage": Container;
    }
    interface WxRippleEffect {
        /**
          * Adds the ripple effect to the parent element.
          * @param x The horizontal coordinate of where the ripple should start.
          * @param y The vertical coordinate of where the ripple should start.
         */
        "addRipple": (x: number, y: number) => Promise<() => void>;
        /**
          * Sets the type of ripple-effect:  - `bounded`: the ripple effect expands from the user's click position - `unbounded`: the ripple effect expands from the center of the button and overflows the container.  NOTE: Surfaces for bounded ripples should have the overflow property set to hidden, while surfaces for unbounded ripples should have it set to visible.
         */
        "type": 'bounded' | 'unbounded';
    }
    interface WxRouterOutlet {
        /**
          * If `true`, the router-outlet will animate the transition of components.
         */
        "animated": boolean;
        /**
          * By default the router-outlet animates transition between pages based in the mode (ios or material design). However, this property allows to create custom transition using `AnimateBuilder` functions.
         */
        "animationBuilder"?: AnimationBuilder;
        "commit": (enteringEl: HTMLElement, leavingEl: HTMLElement, opts: any) => Promise<boolean>;
        /**
          * The mode determines which platform style to use.
         */
        "mode": "ios" | "md";
        "swipeHandler"?: SwipeGestureHandler;
    }
    interface WxSample {
        /**
          * The first name
         */
        "first": string;
        /**
          * The last name
         */
        "last": string;
        /**
          * The middle name
         */
        "middle": string;
    }
    interface WxTabBar {
        /**
          * The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics).
         */
        "color"?: Color;
        /**
          * The selected tab component
         */
        "selectedTab"?: string;
        /**
          * If `true`, the tab bar will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
         */
        "translucent": boolean;
    }
    interface WxTabButton {
        /**
          * If `true`, the user cannot interact with the tab button.
         */
        "disabled": boolean;
        /**
          * This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want).
         */
        "download": string | undefined;
        /**
          * Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.
         */
        "href": string | undefined;
        /**
          * Set the layout of the text and icon in the tab bar. It defaults to `'icon-top'`.
         */
        "layout"?: TabButtonLayout;
        /**
          * The mode determines which platform styles to use.
         */
        "mode"?: "ios" | "md";
        /**
          * Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
         */
        "rel": string | undefined;
        /**
          * The selected tab component
         */
        "selected": boolean;
        /**
          * A tab id must be provided for each `wx-tab`. It's used internally to reference the selected tab or by the router to switch between them.
         */
        "tab"?: string;
        /**
          * Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
         */
        "target": string | undefined;
    }
    interface WxToolbar {
    }
}
declare global {
    interface HTMLWxAppElement extends Components.WxApp, HTMLStencilElement {
    }
    var HTMLWxAppElement: {
        prototype: HTMLWxAppElement;
        new (): HTMLWxAppElement;
    };
    interface HTMLWxBackdropElement extends Components.WxBackdrop, HTMLStencilElement {
    }
    var HTMLWxBackdropElement: {
        prototype: HTMLWxBackdropElement;
        new (): HTMLWxBackdropElement;
    };
    interface HTMLWxBtnElement extends Components.WxBtn, HTMLStencilElement {
    }
    var HTMLWxBtnElement: {
        prototype: HTMLWxBtnElement;
        new (): HTMLWxBtnElement;
    };
    interface HTMLWxButtonElement extends Components.WxButton, HTMLStencilElement {
    }
    var HTMLWxButtonElement: {
        prototype: HTMLWxButtonElement;
        new (): HTMLWxButtonElement;
    };
    interface HTMLWxButtonsElement extends Components.WxButtons, HTMLStencilElement {
    }
    var HTMLWxButtonsElement: {
        prototype: HTMLWxButtonsElement;
        new (): HTMLWxButtonsElement;
    };
    interface HTMLWxIconElement extends Components.WxIcon, HTMLStencilElement {
    }
    var HTMLWxIconElement: {
        prototype: HTMLWxIconElement;
        new (): HTMLWxIconElement;
    };
    interface HTMLWxPixiElement extends Components.WxPixi, HTMLStencilElement {
    }
    var HTMLWxPixiElement: {
        prototype: HTMLWxPixiElement;
        new (): HTMLWxPixiElement;
    };
    interface HTMLWxRippleEffectElement extends Components.WxRippleEffect, HTMLStencilElement {
    }
    var HTMLWxRippleEffectElement: {
        prototype: HTMLWxRippleEffectElement;
        new (): HTMLWxRippleEffectElement;
    };
    interface HTMLWxRouterOutletElement extends Components.WxRouterOutlet, HTMLStencilElement {
    }
    var HTMLWxRouterOutletElement: {
        prototype: HTMLWxRouterOutletElement;
        new (): HTMLWxRouterOutletElement;
    };
    interface HTMLWxSampleElement extends Components.WxSample, HTMLStencilElement {
    }
    var HTMLWxSampleElement: {
        prototype: HTMLWxSampleElement;
        new (): HTMLWxSampleElement;
    };
    interface HTMLWxTabBarElement extends Components.WxTabBar, HTMLStencilElement {
    }
    var HTMLWxTabBarElement: {
        prototype: HTMLWxTabBarElement;
        new (): HTMLWxTabBarElement;
    };
    interface HTMLWxTabButtonElement extends Components.WxTabButton, HTMLStencilElement {
    }
    var HTMLWxTabButtonElement: {
        prototype: HTMLWxTabButtonElement;
        new (): HTMLWxTabButtonElement;
    };
    interface HTMLWxToolbarElement extends Components.WxToolbar, HTMLStencilElement {
    }
    var HTMLWxToolbarElement: {
        prototype: HTMLWxToolbarElement;
        new (): HTMLWxToolbarElement;
    };
    interface HTMLElementTagNameMap {
        "wx-app": HTMLWxAppElement;
        "wx-backdrop": HTMLWxBackdropElement;
        "wx-btn": HTMLWxBtnElement;
        "wx-button": HTMLWxButtonElement;
        "wx-buttons": HTMLWxButtonsElement;
        "wx-icon": HTMLWxIconElement;
        "wx-pixi": HTMLWxPixiElement;
        "wx-ripple-effect": HTMLWxRippleEffectElement;
        "wx-router-outlet": HTMLWxRouterOutletElement;
        "wx-sample": HTMLWxSampleElement;
        "wx-tab-bar": HTMLWxTabBarElement;
        "wx-tab-button": HTMLWxTabButtonElement;
        "wx-toolbar": HTMLWxToolbarElement;
    }
}
declare namespace LocalJSX {
    interface WxApp {
    }
    interface WxBackdrop {
        /**
          * Emitted when the backdrop is tapped.
         */
        "onWxBackdropTap"?: (event: CustomEvent<void>) => void;
        /**
          * If `true`, the backdrop will stop propagation on tap.
         */
        "stopPropagation"?: boolean;
        /**
          * If `true`, the backdrop will can be clicked and will emit the `wxBackdropTap` event.
         */
        "tappable"?: boolean;
        /**
          * If `true` the backdrop will be visible.
         */
        "visible"?: boolean;
    }
    interface WxBtn {
        /**
          * The type of button.
         */
        "buttonType"?: string;
        "color"?: Color;
        /**
          * If `true`, the user cannot interact with the button.
         */
        "disabled"?: boolean;
        "gradientname"?: string;
        "mode"?: "ios" | "md";
        /**
          * The button shape.
         */
        "shape"?: string;
        /**
          * The button size.
         */
        "size"?: Size;
    }
    interface WxButton {
        /**
          * The type of button.
         */
        "buttonType"?: string;
        /**
          * The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics).
         */
        "color"?: Color;
        /**
          * If `true`, the user cannot interact with the button.
         */
        "disabled"?: boolean;
        /**
          * This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want).
         */
        "download"?: string | undefined;
        /**
          * Set to `"block"` for a full-width button or to `"full"` for a full-width button without left and right borders.
         */
        "expand"?: 'full' | 'block';
        /**
          * Set to `"clear"` for a transparent button, to `"outline"` for a transparent button with a border, or to `"solid"`. The default style is `"solid"` except inside of a toolbar, where the default is `"clear"`.
         */
        "fill"?: 'clear' | 'outline' | 'solid' | 'default';
        /**
          * Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.
         */
        "href"?: string | undefined;
        /**
          * The mode determines which platform style to use.
         */
        "mode"?: "ios" | "md";
        /**
          * Emitted when the button loses focus.
         */
        "onWxBlur"?: (event: CustomEvent<void>) => void;
        /**
          * Emitted when the button has focus.
         */
        "onWxFocus"?: (event: CustomEvent<void>) => void;
        /**
          * Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
         */
        "rel"?: string | undefined;
        /**
          * The button shape.
         */
        "shape"?: 'round';
        /**
          * The button size.
         */
        "size"?: Size;
        /**
          * If `true`, activates a button with a heavier font weight.
         */
        "strong"?: boolean;
        /**
          * Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
         */
        "target"?: string | undefined;
        /**
          * The type of the button.
         */
        "type"?: 'submit' | 'reset' | 'button';
    }
    interface WxButtons {
        /**
          * If true, buttons will disappear when its parent toolbar has fully collapsed if the toolbar is not the first toolbar. If the toolbar is the first toolbar, the buttons will be hidden and will only be shown once all toolbars have fully collapsed.
         */
        "collapse"?: boolean;
    }
    interface WxIcon {
        /**
          * Set the icon to hidden, respectively `true`, to remove it from the accessibility tree.
         */
        "ariaHidden"?: string;
        /**
          * Specifies the label to use for accessibility. Defaults to the icon name.
         */
        "ariaLabel"?: string;
        /**
          * The color to use for the background of the item.
         */
        "color"?: Color;
        /**
          * Specifies whether the icon should horizontally flip when `dir` is `"rtl"`.
         */
        "flipRtl"?: boolean;
        /**
          * A combination of both `name` and `src`. If a `src` url is detected it will set the `src` property. Otherwise it assumes it's a built-in named SVG and set the `name` property.
         */
        "icon"?: any;
        /**
          * Specifies which icon to use on `ios` mode.
         */
        "ios"?: string;
        /**
          * If enabled, wx-icon will be loaded lazily when it's visible in the viewport. Default, `false`.
         */
        "lazy"?: boolean;
        /**
          * Specifies which icon to use on `md` mode.
         */
        "md"?: string;
        /**
          * The mode determines which platform styles to use.
         */
        "mode"?: "ios" | "md";
        /**
          * Specifies which icon to use from the built-in set of icons.
         */
        "name"?: string;
        /**
          * When set to `false`, SVG content that is HTTP fetched will not be checked if the response SVG content has any `<script>` elements, or any attributes that start with `on`, such as `onclick`.
         */
        "sanitize"?: boolean;
        /**
          * The icon size.
         */
        "size"?: Size;
        /**
          * Specifies the exact `src` of an SVG file to use.
         */
        "src"?: string;
    }
    interface WxPixi {
        "loop"?: (delta: number) => void;
        "stage"?: Container;
    }
    interface WxRippleEffect {
        /**
          * Sets the type of ripple-effect:  - `bounded`: the ripple effect expands from the user's click position - `unbounded`: the ripple effect expands from the center of the button and overflows the container.  NOTE: Surfaces for bounded ripples should have the overflow property set to hidden, while surfaces for unbounded ripples should have it set to visible.
         */
        "type"?: 'bounded' | 'unbounded';
    }
    interface WxRouterOutlet {
        /**
          * If `true`, the router-outlet will animate the transition of components.
         */
        "animated"?: boolean;
        /**
          * By default the router-outlet animates transition between pages based in the mode (ios or material design). However, this property allows to create custom transition using `AnimateBuilder` functions.
         */
        "animationBuilder"?: AnimationBuilder;
        /**
          * The mode determines which platform style to use.
         */
        "mode"?: "ios" | "md";
        "onWxNavDidChange"?: (event: CustomEvent<void>) => void;
        "onWxNavWillChange"?: (event: CustomEvent<void>) => void;
        "onWxNavWillLoad"?: (event: CustomEvent<void>) => void;
        "swipeHandler"?: SwipeGestureHandler;
    }
    interface WxSample {
        /**
          * The first name
         */
        "first"?: string;
        /**
          * The last name
         */
        "last"?: string;
        /**
          * The middle name
         */
        "middle"?: string;
    }
    interface WxTabBar {
        /**
          * The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics).
         */
        "color"?: Color;
        "onWxTabBarChanged"?: (event: CustomEvent<TabBarChangedEventDetail>) => void;
        /**
          * The selected tab component
         */
        "selectedTab"?: string;
        /**
          * If `true`, the tab bar will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
         */
        "translucent"?: boolean;
    }
    interface WxTabButton {
        /**
          * If `true`, the user cannot interact with the tab button.
         */
        "disabled"?: boolean;
        /**
          * This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want).
         */
        "download"?: string | undefined;
        /**
          * Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.
         */
        "href"?: string | undefined;
        /**
          * Set the layout of the text and icon in the tab bar. It defaults to `'icon-top'`.
         */
        "layout"?: TabButtonLayout;
        /**
          * The mode determines which platform styles to use.
         */
        "mode"?: "ios" | "md";
        /**
          * Emitted when the tab bar is clicked
         */
        "onWxTabButtonClick"?: (event: CustomEvent<TabButtonClickEventDetail>) => void;
        /**
          * Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
         */
        "rel"?: string | undefined;
        /**
          * The selected tab component
         */
        "selected"?: boolean;
        /**
          * A tab id must be provided for each `wx-tab`. It's used internally to reference the selected tab or by the router to switch between them.
         */
        "tab"?: string;
        /**
          * Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
         */
        "target"?: string | undefined;
    }
    interface WxToolbar {
    }
    interface IntrinsicElements {
        "wx-app": WxApp;
        "wx-backdrop": WxBackdrop;
        "wx-btn": WxBtn;
        "wx-button": WxButton;
        "wx-buttons": WxButtons;
        "wx-icon": WxIcon;
        "wx-pixi": WxPixi;
        "wx-ripple-effect": WxRippleEffect;
        "wx-router-outlet": WxRouterOutlet;
        "wx-sample": WxSample;
        "wx-tab-bar": WxTabBar;
        "wx-tab-button": WxTabButton;
        "wx-toolbar": WxToolbar;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "wx-app": LocalJSX.WxApp & JSXBase.HTMLAttributes<HTMLWxAppElement>;
            "wx-backdrop": LocalJSX.WxBackdrop & JSXBase.HTMLAttributes<HTMLWxBackdropElement>;
            "wx-btn": LocalJSX.WxBtn & JSXBase.HTMLAttributes<HTMLWxBtnElement>;
            "wx-button": LocalJSX.WxButton & JSXBase.HTMLAttributes<HTMLWxButtonElement>;
            "wx-buttons": LocalJSX.WxButtons & JSXBase.HTMLAttributes<HTMLWxButtonsElement>;
            "wx-icon": LocalJSX.WxIcon & JSXBase.HTMLAttributes<HTMLWxIconElement>;
            "wx-pixi": LocalJSX.WxPixi & JSXBase.HTMLAttributes<HTMLWxPixiElement>;
            "wx-ripple-effect": LocalJSX.WxRippleEffect & JSXBase.HTMLAttributes<HTMLWxRippleEffectElement>;
            "wx-router-outlet": LocalJSX.WxRouterOutlet & JSXBase.HTMLAttributes<HTMLWxRouterOutletElement>;
            "wx-sample": LocalJSX.WxSample & JSXBase.HTMLAttributes<HTMLWxSampleElement>;
            "wx-tab-bar": LocalJSX.WxTabBar & JSXBase.HTMLAttributes<HTMLWxTabBarElement>;
            "wx-tab-button": LocalJSX.WxTabButton & JSXBase.HTMLAttributes<HTMLWxTabButtonElement>;
            "wx-toolbar": LocalJSX.WxToolbar & JSXBase.HTMLAttributes<HTMLWxToolbarElement>;
        }
    }
}
