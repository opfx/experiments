export type Mode = 'ios' | 'md';

// prettier-ignore
export type PredefinedColors = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';
export type Color = PredefinedColors | string;

export type PredefinedSizes = 'x-small' | 'small' | 'default' | 'large' | 'x-large';
export type Size = PredefinedSizes;

export type CssClassMap = { [className: string]: boolean };

export type ComponentTags = string;
export type ComponentRef = Function | HTMLElement | string | null;
export type ComponentProps = { [key: string]: any };

export interface BackButtonEventDetail {
  register(priority: number, handler: () => Promise<any> | void): void;
}

export interface AnchorInterface {
  href: string | undefined;
  target: string | undefined;
  rel: string | undefined;
  download: string | undefined;
}

export interface ButtonInterface {
  type: 'submit' | 'reset' | 'button';
  disabled: boolean;
}
