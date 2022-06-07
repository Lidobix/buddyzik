import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbuddyComponent } from './searchbuddy.component';

describe('SearchbuddyComponent', () => {
  let component: SearchbuddyComponent;
  let fixture: ComponentFixture<SearchbuddyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchbuddyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchbuddyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
