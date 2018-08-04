import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortrealisationComponent } from './portrealisation.component';

describe('PortrealisationComponent', () => {
  let component: PortrealisationComponent;
  let fixture: ComponentFixture<PortrealisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortrealisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortrealisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
