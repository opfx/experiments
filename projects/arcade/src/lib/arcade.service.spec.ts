import { TestBed } from '@angular/core/testing';

import { ArcadeService } from './arcade.service';

describe('ArcadeService', () => {
  let service: ArcadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArcadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
