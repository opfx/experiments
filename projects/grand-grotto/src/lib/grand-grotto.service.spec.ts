import { TestBed } from '@angular/core/testing';

import { GrandGrottoService } from './grand-grotto.service';

describe('GrandGrottoService', () => {
  let service: GrandGrottoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrandGrottoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
