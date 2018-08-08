import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericPropertyComponent } from './numeric-property.component';

describe('NumericPropertyComponent', () => {
  let component: NumericPropertyComponent;
  let fixture: ComponentFixture<NumericPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumericPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
