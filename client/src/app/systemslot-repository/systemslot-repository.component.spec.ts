import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemslotRepositoryComponent } from './systemslot-repository.component';

describe('SystemslotRepositoryComponent', () => {
  let component: SystemslotRepositoryComponent;
  let fixture: ComponentFixture<SystemslotRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemslotRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemslotRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
