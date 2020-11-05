import { Injectable } from '@angular/core';
import { Router, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanLoad, CanActivate } from '@angular/router';

import { SampleService } from './../sample.service';

@Injectable({ providedIn: 'root' })
export class ContentGuard implements CanLoad, CanActivate {
  constructor(private router: Router, private sample: SampleService) {}
  public canLoad(route: Route, segments: UrlSegment[]): boolean {
    return true;
    if (this.sample.authenticated) {
      return true;
    }
    this.router.navigate(['/home'], { skipLocationChange: true });
    return false;
  }

  public canActivate(activatedRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true;
  }
}
