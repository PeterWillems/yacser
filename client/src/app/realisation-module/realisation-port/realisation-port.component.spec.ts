import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealisationPortComponent } from './realisation-port.component';

describe('RealisationPortComponent', () => {
  let component: RealisationPortComponent;
  let fixture: ComponentFixture<RealisationPortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealisationPortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealisationPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
