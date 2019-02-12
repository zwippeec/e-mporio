import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingHistoryDetailComponent } from './shopping-history-detail.component';

describe('ShoppingHistoryDetailComponent', () => {
  let component: ShoppingHistoryDetailComponent;
  let fixture: ComponentFixture<ShoppingHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
