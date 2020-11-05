import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KinzpostActivity } from './kinzpost.component';

describe('KinzpostComponent', () => {
  let component: KinzpostActivity;
  let fixture: ComponentFixture<KinzpostActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KinzpostActivity],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KinzpostActivity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
