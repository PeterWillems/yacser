import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinspropertyComponent } from './coinsproperty.component';

describe('CoinspropertyComponent', () => {
  let component: CoinspropertyComponent;
  let fixture: ComponentFixture<CoinspropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinspropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinspropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
