import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HamburgerRepositoryComponent } from './hamburger-repository.component';

describe('HamburgerRepositoryComponent', () => {
  let component: HamburgerRepositoryComponent;
  let fixture: ComponentFixture<HamburgerRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HamburgerRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HamburgerRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
