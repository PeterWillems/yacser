import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysteminterfaceRepositoryComponent } from './systeminterface-repository.component';

describe('SysteminterfaceRepositoryComponent', () => {
  let component: SysteminterfaceRepositoryComponent;
  let fixture: ComponentFixture<SysteminterfaceRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysteminterfaceRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysteminterfaceRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
