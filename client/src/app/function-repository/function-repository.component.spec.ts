import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionRepositoryComponent } from './function-repository.component';

describe('FunctionRepositoryComponent', () => {
  let component: FunctionRepositoryComponent;
  let fixture: ComponentFixture<FunctionRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
