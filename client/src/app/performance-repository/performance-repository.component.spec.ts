import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceRepositoryComponent } from './performance-repository.component';

describe('PerformanceRepositoryComponent', () => {
  let component: PerformanceRepositoryComponent;
  let fixture: ComponentFixture<PerformanceRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
