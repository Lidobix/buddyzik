import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MybuddiesComponent } from './mybuddies.component';

describe('MybuddiesComponent', () => {
  let component: MybuddiesComponent;
  let fixture: ComponentFixture<MybuddiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MybuddiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MybuddiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
