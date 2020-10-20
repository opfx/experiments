import { ActivatedRoute, Router } from '@angular/router';
import { NavDirection } from '@webkinz/wcl';

import { RouteView } from './../types';

export const insertView = (views: RouteView[], view: RouteView, direction: NavDirection) => {
  if (direction === 'root') {
    return setRoot(views, view);
  }
  if (direction === 'forward') {
    return setForward(views, view);
  }
  return setBack(views, view);
};

const setRoot = (views: RouteView[], view: RouteView): RouteView[] => {
  views = views.filter((vw) => vw.stackId !== view.stackId);
  views.push(view);
  return views;
};

const setForward = (views: RouteView[], view: RouteView): RouteView[] => {
  const index = views.indexOf(view);
  if (index >= 0) {
    views = views.filter((vw) => vw.stackId !== view.stackId || vw.id <= view.id);
  } else {
    views.push(view);
  }
  return views;
};

const setBack = (views: RouteView[], view: RouteView): RouteView[] => {
  const index = views.indexOf(view);
  if (index >= 0) {
    return (views = views.filter((vw) => vw.stackId !== view.stackId || vw.id <= view.id));
  }
  return setRoot(views, view);
};

export const getUrl = (router: Router, activatedRoute: ActivatedRoute) => {
  const urlTree = router.createUrlTree(['.'], { relativeTo: activatedRoute });
  return router.serializeUrl(urlTree);
};

export const computeStackId = (prefixUrl: string[] | undefined, url: string) => {
  if (!prefixUrl) {
    return undefined;
  }
  const segments = toSegments(url);
  for (let i = 0; i < segments.length; i++) {
    if (i >= prefixUrl.length) {
      return segments[i];
    }
    if (segments[i] !== prefixUrl[i]) {
      return undefined;
    }
  }
  return undefined;
};

export const toSegments = (path: string) => {
  return path
    .split('/')
    .map((s) => s.trim())
    .filter((s) => s !== '');
};
