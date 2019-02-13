import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencePersonComponent } from './reference-person.component';

describe('ReferencePersonComponent', () => {
  let component: ReferencePersonComponent;
  let fixture: ComponentFixture<ReferencePersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencePersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
