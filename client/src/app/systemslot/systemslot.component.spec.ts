import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemslotComponent } from './systemslot.component';

describe('SystemslotComponent', () => {
  let component: SystemslotComponent;
  let fixture: ComponentFixture<SystemslotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemslotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
