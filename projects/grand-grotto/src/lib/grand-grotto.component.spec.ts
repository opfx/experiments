import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandGrottoComponent } from './grand-grotto.component';

describe('GrandGrottoComponent', () => {
  let component: GrandGrottoComponent;
  let fixture: ComponentFixture<GrandGrottoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrandGrottoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrandGrottoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
