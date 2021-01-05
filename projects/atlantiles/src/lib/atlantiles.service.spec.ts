import { TestBed } from '@angular/core/testing';

import { AtlantilesService } from './atlantiles.service';

describe('AtlantilesService', () => {
  let service: AtlantilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtlantilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
