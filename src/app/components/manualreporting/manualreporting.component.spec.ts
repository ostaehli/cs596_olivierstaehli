import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualreportingComponent } from './manualreporting.component';

describe('ManualreportingComponent', () => {
  let component: ManualreportingComponent;
  let fixture: ComponentFixture<ManualreportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualreportingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualreportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
