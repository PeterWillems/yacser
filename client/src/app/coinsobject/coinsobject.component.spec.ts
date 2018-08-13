import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsobjectComponent } from './coinsobject.component';

describe('CoinsobjectComponent', () => {
  let component: CoinsobjectComponent;
  let fixture: ComponentFixture<CoinsobjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinsobjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinsobjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
