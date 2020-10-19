import { TestBed } from '@angular/core/testing';

import { KinzpostService } from './kinzpost.service';

describe('KinzpostService', () => {
  let service: KinzpostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KinzpostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
