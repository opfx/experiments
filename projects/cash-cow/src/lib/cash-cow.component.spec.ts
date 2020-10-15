import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashCowComponent } from './cash-cow.component';

describe('CashCowComponent', () => {
  let component: CashCowComponent;
  let fixture: ComponentFixture<CashCowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashCowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashCowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
