import { Injectable } from '@angular/core';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SampleService {
  private mAuthenticated = false;

  public set authenticated(flag: boolean) {
    this.mAuthenticated = flag;
  }

  public get authenticated(): boolean {
    return this.mAuthenticated;
  }
}
