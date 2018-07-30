import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealisationModuleComponent } from './realisation-module.component';

describe('RealisationModuleComponent', () => {
  let component: RealisationModuleComponent;
  let fixture: ComponentFixture<RealisationModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealisationModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealisationModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
