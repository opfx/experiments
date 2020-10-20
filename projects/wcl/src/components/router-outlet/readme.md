# wx-router-outlet



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute  | Description                                                                                                                                                                                            | Type                                     | Default           |
| ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- | ----------------- |
| `animated`         | `animated` | If `true`, the router-outlet will animate the transition of components.                                                                                                                                | `boolean`                                | `true`            |
| `animationBuilder` | --         | By default the router-outlet animates transition between pages based in the mode (ios or material design). However, this property allows to create custom transition using `AnimateBuilder` functions. | `(baseEl: any, opts?: any) => Animation` | `undefined`       |
| `mode`             | `mode`     | The mode determines which platform style to use.                                                                                                                                                       | `"ios" \| "md"`                          | `getWxMode(this)` |


## Events

| Event             | Description | Type                |
| ----------------- | ----------- | ------------------- |
| `wxNavDidChange`  |             | `CustomEvent<void>` |
| `wxNavWillChange` |             | `CustomEvent<void>` |
| `wxNavWillLoad`   |             | `CustomEvent<void>` |


## Methods

### `commit(enteringEl: HTMLElement, leavingEl: HTMLElement, opts: any) => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
