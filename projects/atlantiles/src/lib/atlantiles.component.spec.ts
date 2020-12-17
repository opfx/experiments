import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlantilesComponent } from './atlantiles.component';

describe('AtlantilesComponent', () => {
  let component: AtlantilesComponent;
  let fixture: ComponentFixture<AtlantilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtlantilesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlantilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
