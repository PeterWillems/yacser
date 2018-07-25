import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementRepositoryComponent } from './requirement-repository.component';

describe('RequirementRepositoryComponent', () => {
  let component: RequirementRepositoryComponent;
  let fixture: ComponentFixture<RequirementRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
