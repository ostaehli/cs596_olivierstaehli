import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionlistComponent } from './detectionlist.component';

describe('DetectionlistComponent', () => {
  let component: DetectionlistComponent;
  let fixture: ComponentFixture<DetectionlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetectionlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
