import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KinzpostComponent } from './kinzpost.component';

describe('KinzpostComponent', () => {
  let component: KinzpostComponent;
  let fixture: ComponentFixture<KinzpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KinzpostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KinzpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
