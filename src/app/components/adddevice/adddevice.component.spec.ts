import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddeviceComponent } from './adddevice.component';

describe('AdddeviceComponent', () => {
  let component: AdddeviceComponent;
  let fixture: ComponentFixture<AdddeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdddeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdddeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
