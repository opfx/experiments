import { TestBed } from '@angular/core/testing';

import { CashCowService } from './cash-cow.service';

describe('CashCowService', () => {
  let service: CashCowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashCowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
