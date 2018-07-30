import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealisationModuleRepositoryComponent } from './realisation-module-repository.component';

describe('RealisationModuleRepositoryComponent', () => {
  let component: RealisationModuleRepositoryComponent;
  let fixture: ComponentFixture<RealisationModuleRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealisationModuleRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealisationModuleRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
