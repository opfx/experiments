import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcadeActivity } from './arcade.activity';

describe('ArcadeComponent', () => {
  let component: ArcadeActivity;
  let fixture: ComponentFixture<ArcadeActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArcadeActivity],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArcadeActivity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
