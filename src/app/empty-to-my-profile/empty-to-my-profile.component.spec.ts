import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyToMyProfileComponent } from './empty-to-my-profile.component';

describe('EmptyToMyProfileComponent', () => {
  let component: EmptyToMyProfileComponent;
  let fixture: ComponentFixture<EmptyToMyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyToMyProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyToMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
