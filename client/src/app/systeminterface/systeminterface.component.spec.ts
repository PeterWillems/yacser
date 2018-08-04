import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysteminterfaceComponent } from './systeminterface.component';

describe('SysteminterfaceComponent', () => {
  let component: SysteminterfaceComponent;
  let fixture: ComponentFixture<SysteminterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysteminterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysteminterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
